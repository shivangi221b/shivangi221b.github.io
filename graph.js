/* ============================================================
   Project constellation.

   Project nodes sit on a drifting field. Edges form between close
   pairs. The cursor joins as a node of its own: it pulls nearby
   nodes toward it, lights the edges it touches, and everything
   springs back as you move on.

   Hovering a project node still expands its detail card.
   The live field disables itself on touch devices, narrow screens,
   and for reduced-motion users (static map with semantic edges).

   Exposes window.PGRAPH = { filter, layout } for script.js.
   ============================================================ */
(function () {
  "use strict";

  var map = document.getElementById("mapView");
  var svg = document.getElementById("pgedges");
  if (!map || !svg || typeof PROJECTS === "undefined" || typeof DOMAINS === "undefined") return;

  var items = PROJECTS.filter(function (p) { return p.pos && p.domain; });
  if (!items.length) return;

  var HEIGHT = (typeof MAP_HEIGHT !== "undefined") ? MAP_HEIGHT : 720;
  map.style.setProperty("--map-h", HEIGHT + "px");

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- cluster labels ---------- */
  DOMAINS.forEach(function (d) {
    var lab = el("span", "pgdomain", d.label);
    lab.style.left = d.lx + "%";
    lab.style.top = d.ly + "px";
    map.appendChild(lab);
  });

  /* ---------- nodes ---------- */
  var slots = [];
  items.forEach(function (p, idx) {
    var node = el("article", "pnode");
    node.style.left = p.pos.x + "%";
    node.style.top = p.pos.y + "px";
    node.style.setProperty("--i", String(idx));
    node.tabIndex = 0;
    node.setAttribute("aria-label", p.title);

    var dot = el("span", "pnode-dot");
    var label = el("span", "pnode-label", p.short || p.title);

    var expand = el("div", "pnode-expand");
    if (p.kicker) expand.appendChild(el("p", "pkicker", p.kicker));
    expand.appendChild(el("h3", "pgtitle", p.title));
    expand.appendChild(el("p", "pgline", p.line || p.blurb));
    if (p.stack && p.stack.length) {
      var ul = el("ul", "pstack pgstack");
      p.stack.slice(0, 4).forEach(function (t) {
        var li = el("li", null, t);
        li.style.opacity = 1;
        li.style.transform = "none";
        ul.appendChild(li);
      });
      expand.appendChild(ul);
    }
    if (p.links && p.links.length) {
      var lb = el("div", "plinks pglinks");
      p.links.forEach(function (l) {
        var a = el("a", "plink", l.label);
        a.href = l.href;
        if (/^https?:/.test(l.href)) { a.target = "_blank"; a.rel = "noopener"; }
        lb.appendChild(a);
      });
      expand.appendChild(lb);
    }

    if (p.pos.y > HEIGHT * 0.62) node.classList.add("opens-up");

    node.appendChild(dot);
    node.appendChild(label);
    node.appendChild(expand);
    map.appendChild(node);

    slots.push({
      p: p, node: node, idx: idx,
      // physics state filled in on resize
      homeX: 0, homeY: 0,
      hx: 0, hy: 0, x: 0, y: 0,
      ox: 0, oy: 0, lit: 0,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      phase: Math.random() * Math.PI * 2
    });
  });

  /* ---------- SVG: proximity edges + cursor ---------- */
  var edgePool = [];
  var cursorLines = [];
  var cursorDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  cursorDot.setAttribute("class", "pg-cursor");
  cursorDot.setAttribute("r", "3.5");
  cursorDot.setAttribute("cx", "-99");
  cursorDot.setAttribute("cy", "-99");
  svg.appendChild(cursorDot);

  function ensureEdges(n) {
    while (edgePool.length < n) {
      var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("class", "pg-edge");
      svg.insertBefore(line, cursorDot);
      edgePool.push(line);
    }
  }

  function ensureCursorLines(n) {
    while (cursorLines.length < n) {
      var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("class", "pg-edge pg-cursor-edge");
      svg.insertBefore(line, cursorDot);
      cursorLines.push(line);
    }
  }

  /* ---------- static semantic edges (fallback / reduced motion) ---------- */
  var HAIRBALL = { "ML": true };
  var CROSS_REACH = 42;
  var staticEdges = [];

  function buildStaticEdges() {
    staticEdges.forEach(function (e) { if (e.el.parentNode) e.el.parentNode.removeChild(e.el); });
    staticEdges = [];
    for (var i = 0; i < slots.length; i++) {
      for (var j = i + 1; j < slots.length; j++) {
        var a = slots[i], b = slots[j], reason = null;
        if (a.p.domain === b.p.domain) reason = "cluster";
        else {
          var dx = a.p.pos.x - b.p.pos.x;
          var dy = ((a.p.pos.y - b.p.pos.y) / HEIGHT) * 100;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= CROSS_REACH) {
            var at = a.p.tags || [], bt = b.p.tags || [];
            for (var k = 0; k < at.length; k++) {
              if (!HAIRBALL[at[k]] && bt.indexOf(at[k]) >= 0) { reason = at[k]; break; }
            }
          }
        }
        if (reason) {
          var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("class", "pg-edge" + (reason === "cluster" ? " is-cluster" : ""));
          svg.insertBefore(line, cursorDot);
          staticEdges.push({ a: a, b: b, el: line, reason: reason });
        }
      }
    }
  }

  /* ---------- constellation physics ---------- */
  var LINK_DIST = 240;
  var PULL_DIST = 280;
  var MAX_OFFSET = 32;
  var EASE = 0.08;
  var LEASH = 56;       // how far a home may wander from its seed
  var mouse = { x: -9999, y: -9999, active: false };
  var raf = null;
  var live = false;
  var mapW = 0, mapH = 0;
  var filterValue = "*";

  function canLive() {
    if (reduce || coarse) return false;
    if (window.innerWidth < 1040) return false;
    var flow = window.getComputedStyle(map).getPropertyValue("--map-flow").trim() === "1";
    if (flow) return false;
    if (map.hidden) return false;
    return true;
  }

  function seedHomes() {
    var box = map.getBoundingClientRect();
    mapW = box.width;
    mapH = box.height || HEIGHT;
    if (mapW < 2) return;
    svg.setAttribute("viewBox", "0 0 " + Math.round(mapW) + " " + Math.round(mapH));
    slots.forEach(function (s) {
      var hx = (s.p.pos.x / 100) * mapW;
      var hy = s.p.pos.y;
      s.homeX = hx; s.homeY = hy;
      if (!s.seeded) {
        s.hx = hx; s.hy = hy;
        s.x = hx; s.y = hy;
        s.seeded = true;
      }
    });
  }

  function placeStatic() {
    slots.forEach(function (s) {
      s.node.style.left = s.p.pos.x + "%";
      s.node.style.top = s.p.pos.y + "px";
      s.node.style.transform = "translate(-50%,-50%)";
      s.node.classList.remove("is-lit");
    });
    var box = map.getBoundingClientRect();
    if (box.width < 2) return;
    svg.setAttribute("viewBox", "0 0 " + Math.round(box.width) + " " + Math.round(box.height));
    staticEdges.forEach(function (e) {
      var ax = (e.a.p.pos.x / 100) * box.width, ay = e.a.p.pos.y;
      var bx = (e.b.p.pos.x / 100) * box.width, by = e.b.p.pos.y;
      e.el.setAttribute("x1", ax.toFixed(1));
      e.el.setAttribute("y1", ay.toFixed(1));
      e.el.setAttribute("x2", bx.toFixed(1));
      e.el.setAttribute("y2", by.toFixed(1));
      e.el.style.opacity = "";
      e.el.style.strokeWidth = "";
    });
    edgePool.forEach(function (l) {
      l.setAttribute("x1", 0); l.setAttribute("y1", 0);
      l.setAttribute("x2", 0); l.setAttribute("y2", 0);
      l.style.opacity = "0";
    });
    cursorLines.forEach(function (l) {
      l.setAttribute("x1", 0); l.setAttribute("y1", 0);
      l.setAttribute("x2", 0); l.setAttribute("y2", 0);
      l.style.opacity = "0";
    });
    cursorDot.setAttribute("cx", "-99");
    cursorDot.setAttribute("cy", "-99");
    cursorDot.style.opacity = "0";
  }

  function hideStaticEdges() {
    staticEdges.forEach(function (e) {
      e.el.setAttribute("x1", 0); e.el.setAttribute("y1", 0);
      e.el.setAttribute("x2", 0); e.el.setAttribute("y2", 0);
    });
  }

  function isDim(s) {
    return filterValue !== "*" && (s.p.tags || []).indexOf(filterValue) < 0;
  }

  function step() {
    if (!live) { raf = null; return; }
    var i, j, a, b, dx, dy, d, d2, used = 0;

    for (i = 0; i < slots.length; i++) {
      a = slots[i];
      if (isDim(a)) {
        a.ox += (0 - a.ox) * EASE;
        a.oy += (0 - a.oy) * EASE;
        a.lit += (0 - a.lit) * EASE;
        a.x = a.homeX; a.y = a.homeY;
        a.node.style.left = a.x + "px";
        a.node.style.top = a.y + "px";
        a.node.classList.toggle("is-lit", false);
        continue;
      }

      // home wanders gently, leashed to its seed
      a.hx += a.vx; a.hy += a.vy;
      dx = a.homeX - a.hx; dy = a.homeY - a.hy;
      d2 = dx * dx + dy * dy;
      if (d2 > LEASH * LEASH) {
        d = Math.sqrt(d2);
        a.hx = a.homeX - dx / d * LEASH;
        a.hy = a.homeY - dy / d * LEASH;
        a.vx *= -0.6; a.vy *= -0.6;
      }
      // soft pull toward seed + tiny damping so paths stay calm
      a.vx += dx * 0.00035;
      a.vy += dy * 0.00035;
      a.vx *= 0.995; a.vy *= 0.995;

      var tx = 0, ty = 0, f = 0;
      if (mouse.active && !a.node.classList.contains("is-hot")) {
        dx = mouse.x - a.hx; dy = mouse.y - a.hy;
        d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < PULL_DIST) {
          f = 1 - d / PULL_DIST;
          var pull = f * f * MAX_OFFSET;
          tx = (dx / d) * pull;
          ty = (dy / d) * pull;
        }
      }
      a.ox += (tx - a.ox) * EASE;
      a.oy += (ty - a.oy) * EASE;
      a.lit += (f - a.lit) * EASE;

      a.x = a.hx + a.ox;
      a.y = a.hy + a.oy;
      a.node.style.left = a.x + "px";
      a.node.style.top = a.y + "px";
      a.node.classList.toggle("is-lit", a.lit > 0.12);
    }

    // proximity edges
    ensureEdges(slots.length * slots.length);
    for (i = 0; i < slots.length; i++) {
      a = slots[i];
      if (isDim(a)) continue;
      for (j = i + 1; j < slots.length; j++) {
        b = slots[j];
        if (isDim(b)) continue;
        dx = a.x - b.x; dy = a.y - b.y;
        d2 = dx * dx + dy * dy;
        if (d2 > LINK_DIST * LINK_DIST) continue;
        d = Math.sqrt(d2) || 1;
        var base = (1 - d / LINK_DIST) * 0.42;
        var glow = Math.max(a.lit, b.lit);
        var line = edgePool[used++];
        line.setAttribute("x1", a.x.toFixed(1));
        line.setAttribute("y1", a.y.toFixed(1));
        line.setAttribute("x2", b.x.toFixed(1));
        line.setAttribute("y2", b.y.toFixed(1));
        line.style.opacity = Math.min(0.95, base + glow * 0.55).toFixed(3);
        line.style.strokeWidth = (1.2 + glow * 1.1).toFixed(2);
        line.classList.toggle("is-hot", glow > 0.35);
      }
    }
    for (i = used; i < edgePool.length; i++) {
      edgePool[i].style.opacity = "0";
      edgePool[i].setAttribute("x1", 0);
      edgePool[i].setAttribute("y1", 0);
      edgePool[i].setAttribute("x2", 0);
      edgePool[i].setAttribute("y2", 0);
    }

    // cursor joins the graph
    if (mouse.active) {
      var near = [];
      for (i = 0; i < slots.length; i++) {
        a = slots[i];
        if (isDim(a)) continue;
        dx = mouse.x - a.x; dy = mouse.y - a.y;
        d2 = dx * dx + dy * dy;
        if (d2 < PULL_DIST * PULL_DIST) near.push({ n: a, d: Math.sqrt(d2) });
      }
      near.sort(function (m, n) { return m.d - n.d; });
      ensureCursorLines(4);
      for (i = 0; i < cursorLines.length; i++) {
        if (i < Math.min(4, near.length) && near[i].d < LINK_DIST) {
          var t = 1 - near[i].d / LINK_DIST;
          cursorLines[i].setAttribute("x1", mouse.x.toFixed(1));
          cursorLines[i].setAttribute("y1", mouse.y.toFixed(1));
          cursorLines[i].setAttribute("x2", near[i].n.x.toFixed(1));
          cursorLines[i].setAttribute("y2", near[i].n.y.toFixed(1));
          cursorLines[i].style.opacity = (t * 0.55).toFixed(3);
          cursorLines[i].style.strokeWidth = (1 + t * 1.2).toFixed(2);
        } else {
          cursorLines[i].style.opacity = "0";
          cursorLines[i].setAttribute("x1", 0);
          cursorLines[i].setAttribute("y1", 0);
          cursorLines[i].setAttribute("x2", 0);
          cursorLines[i].setAttribute("y2", 0);
        }
      }
      cursorDot.setAttribute("cx", mouse.x.toFixed(1));
      cursorDot.setAttribute("cy", mouse.y.toFixed(1));
      cursorDot.style.opacity = "0.7";
    } else {
      cursorLines.forEach(function (l) {
        l.style.opacity = "0";
        l.setAttribute("x1", 0); l.setAttribute("y1", 0);
        l.setAttribute("x2", 0); l.setAttribute("y2", 0);
      });
      cursorDot.style.opacity = "0";
    }

    raf = requestAnimationFrame(step);
  }

  function startLive() {
    if (raf !== null) return;
    live = true;
    map.classList.add("is-live");
    hideStaticEdges();
    seedHomes();
    slots.forEach(function (s) {
      s.node.style.left = s.hx + "px";
      s.node.style.top = s.hy + "px";
    });
    raf = requestAnimationFrame(step);
  }

  function stopLive() {
    live = false;
    map.classList.remove("is-live");
    if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
    mouse.active = false;
    placeStatic();
  }

  function layout() {
    var want = canLive();
    seedHomes();
    if (!staticEdges.length) buildStaticEdges();
    if (want) {
      hideStaticEdges();
      if (!live) startLive();
      else {
        // already running — keep homes fresh after resize
        slots.forEach(function (s) {
          if (!s.node.classList.contains("is-hot")) {
            s.hx = s.homeX; s.hy = s.homeY;
          }
        });
      }
    } else {
      stopLive();
    }
  }

  /* ---------- hover expand (works in both modes) ---------- */
  function setHot(s, on) {
    s.node.classList.toggle("is-hot", on);
    map.classList.toggle("has-hot", on);
    if (!live) {
      staticEdges.forEach(function (e) {
        if (e.a === s || e.b === s) {
          e.el.classList.toggle("is-hot", on);
          (e.a === s ? e.b : e.a).node.classList.toggle("is-near", on);
        }
      });
    } else {
      slots.forEach(function (o) {
        if (o === s) return;
        // light neighbours by proximity while expanded
        var dx = o.x - s.x, dy = o.y - s.y;
        var close = on && (dx * dx + dy * dy) < LINK_DIST * LINK_DIST;
        o.node.classList.toggle("is-near", !!close);
      });
    }
  }

  slots.forEach(function (s) {
    s.node.addEventListener("mouseenter", function () { setHot(s, true); });
    s.node.addEventListener("mouseleave", function () { setHot(s, false); });
    s.node.addEventListener("focus", function () { setHot(s, true); });
    s.node.addEventListener("blur", function () { setHot(s, false); });
  });

  /* ---------- cursor tracking on the map ---------- */
  map.addEventListener("mousemove", function (e) {
    if (!live) return;
    var box = map.getBoundingClientRect();
    mouse.x = e.clientX - box.left;
    mouse.y = e.clientY - box.top;
    mouse.active = true;
  }, { passive: true });
  map.addEventListener("mouseleave", function () { mouse.active = false; });

  /* ---------- filtering ---------- */
  function filter(value) {
    filterValue = value;
    slots.forEach(function (s) {
      var ok = value === "*" || (s.p.tags || []).indexOf(value) >= 0;
      s.node.classList.toggle("is-dim", !ok);
      s.node.tabIndex = ok ? 0 : -1;
      if (!ok) setHot(s, false);
    });
    staticEdges.forEach(function (e) {
      var ok = value === "*" ||
        ((e.a.p.tags || []).indexOf(value) >= 0 && (e.b.p.tags || []).indexOf(value) >= 0);
      e.el.classList.toggle("is-dim", !ok);
    });
  }

  buildStaticEdges();
  layout();

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(layout, 140);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  window.addEventListener("load", layout);

  // pause when the map is off-screen or the tab is hidden
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      var vis = entries[0] && entries[0].isIntersecting;
      if (!vis) {
        if (live) { live = false; if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }
      } else if (canLive()) startLive();
    }, { threshold: 0.05 });
    io.observe(map);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
    } else if (canLive()) startLive();
  });

  window.PGRAPH = { filter: filter, layout: layout };
})();
