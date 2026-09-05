/* Shivangi Kumar. No dependencies. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= theme ================= */
  // the inline script in <head> has already set this; kept in sync here
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  root.setAttribute("data-theme", stored === "light" ? "light" : "dark");

  var toggle = document.getElementById("themeToggle");
  if (toggle) toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    readNodeColor();
  });

  /* ================= helpers ================= */
  function nodeRGB() {
    var v = getComputedStyle(root).getPropertyValue("--node").trim();
    return v || "177,74,42";
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function linksNode(links, cls) {
    var box = el("div", cls || "plinks");
    (links || []).forEach(function (l) {
      var a = el("a", "plink", l.label);
      a.href = l.href;
      if (/^https?:/.test(l.href)) { a.target = "_blank"; a.rel = "noopener"; }
      a.addEventListener("click", function (e) { e.stopPropagation(); });
      box.appendChild(a);
    });
    return box;
  }
  function stackNode(stack) {
    if (!stack || !stack.length) return null;
    var ul = el("ul", "pstack");
    stack.forEach(function (s) { ul.appendChild(el("li", null, s)); });
    return ul;
  }
  function mediaNode(p) {
    var wrap = el("div", "pmedia"), m = p.media;
    if (!m) {
      var ph = el("div", "pmedia-ph");
      ph.appendChild(el("span", "glyph", p.title.charAt(0)));
      wrap.appendChild(ph);
      return wrap;
    }
    if (m.type === "video") {
      var v = document.createElement("video");
      v.controls = true; v.preload = "metadata"; v.playsInline = true;
      if (m.poster) v.poster = m.poster;
      v.src = m.src;
      v.addEventListener("click", function (e) { e.stopPropagation(); });
      wrap.appendChild(v);
    } else if (m.type === "youtube") {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + m.id;
      f.title = p.title + " demo"; f.loading = "lazy";
      f.allow = "accelerometer; clipboard-write; encrypted-media; picture-in-picture";
      f.setAttribute("allowfullscreen", "");
      wrap.appendChild(f);
    } else if (m.type === "image") {
      var i = document.createElement("img");
      i.src = m.src; i.alt = m.alt || p.title; i.loading = "lazy";
      wrap.appendChild(i);
    }
    return wrap;
  }

  /* ================= projects ================= */
  var featuredHost = document.getElementById("featuredProjects");
  var moreHost = document.getElementById("moreProjects");
  var filterHost = document.getElementById("filters");

  function card(p) {
    var c = el("article", "pcard reveal");
    c.setAttribute("data-tags", (p.tags || []).join("|"));
    // Media slot is off. Uncomment the next line (and give a project a `media`
    // object in data.js) to put video, YouTube or image previews back on cards.
    // c.appendChild(mediaNode(p));

    var body = el("div", "pbody");
    if (p.kicker) body.appendChild(el("p", "pkicker", p.kicker));
    body.appendChild(el("h3", "ptitle", p.title));
    body.appendChild(el("p", "pblurb", p.blurb));
    if (p.detail) body.appendChild(el("p", "pdetail", p.detail));
    var st = stackNode(p.stack);
    if (st) body.appendChild(st);
    if (p.links && p.links.length) body.appendChild(linksNode(p.links));
    c.appendChild(body);
    return c;
  }

  function mini(p) {
    var li = el("li", "mini reveal");
    li.setAttribute("data-tags", (p.tags || []).join("|"));
    var left = el("div");
    left.appendChild(el("h4", null, p.title));
    if (p.kicker) left.appendChild(el("span", "mk", p.kicker));
    li.appendChild(left);
    li.appendChild(el("p", null, p.blurb));
    li.appendChild(linksNode(p.links));
    return li;
  }

  if (typeof PROJECTS !== "undefined" && featuredHost && moreHost) {
    PROJECTS.forEach(function (p) {
      if (p.featured) featuredHost.appendChild(card(p));
      else moreHost.appendChild(mini(p));
    });

    var tagCount = {};
    PROJECTS.forEach(function (p) {
      (p.tags || []).forEach(function (t) { tagCount[t] = (tagCount[t] || 0) + 1; });
    });
    var tags = Object.keys(tagCount).sort(function (a, b) {
      return tagCount[b] - tagCount[a] || a.localeCompare(b);
    });

    var alsoHead = document.getElementById("alsoBuiltHead");
    var emptyNote = document.getElementById("projectsEmpty");

    function applyFilter(value) {
      var cards = 0, minis = 0;
      Array.prototype.forEach.call(document.querySelectorAll("[data-tags]"), function (c) {
        var ok = value === "*" || c.getAttribute("data-tags").split("|").indexOf(value) >= 0;
        c.style.display = ok ? "" : "none";
        if (ok) { if (c.classList.contains("pcard")) cards++; else minis++; }
      });
      // an empty grid or a heading with nothing under it both look like bugs
      if (alsoHead) alsoHead.hidden = minis === 0;
      if (moreHost) moreHost.hidden = minis === 0;
      if (featuredHost) featuredHost.hidden = cards === 0;
      if (emptyNote) emptyNote.hidden = cards > 0 || minis > 0;
      if (window.PGRAPH) window.PGRAPH.filter(value);
    }
    function chip(label, value) {
      var b = el("button", "chip", label);
      b.type = "button";
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(filterHost.children, function (x) { x.classList.toggle("active", x === b); });
        applyFilter(value);
      });
      return b;
    }
    if (filterHost) {
      var all = chip("All", "*");
      all.classList.add("active");
      filterHost.appendChild(all);
      tags.forEach(function (t) { filterHost.appendChild(chip(t, t)); });
    }
  }

  /* ================= core skills ================= */
  var core = document.getElementById("coreSkills");
  if (core && typeof CORE_SKILLS !== "undefined") {
    CORE_SKILLS.forEach(function (name) { core.appendChild(el("span", "cchip", name)); });
  }

  /* ================= skills marquee ================= */
  var mq = document.getElementById("marquees");
  if (mq && typeof SKILLS !== "undefined") {
    SKILLS.forEach(function (row) {
      var r = el("div", "mrow"), track = el("div", "mtrack"), half = el("div", "mhalf");
      track.appendChild(half);
      r.appendChild(track);
      mq.appendChild(r);

      function fill() {
        row.forEach(function (name) { half.appendChild(el("span", "mchip", name)); });
      }
      fill();
      // repeat the row until one half is wider than the screen, otherwise the
      // -50% loop leaves a visible gap on short rows
      var need = window.innerWidth + 240, guard = 0;
      while (half.scrollWidth < need && guard++ < 24) fill();

      var clone = half.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  }

  /* ================= timeline ================= */
  var tl = document.getElementById("timeline");
  if (tl && typeof TIMELINE !== "undefined") {
    TIMELINE.forEach(function (t) {
      var li = el("li", "tnode reveal");

      var head = el("div", "thead");
      head.appendChild(el("span", "trole", t.role));
      head.appendChild(el("span", "tsep", "/"));
      head.appendChild(el("span", "torg", t.org));
      if (t.place) head.appendChild(el("span", "tplace", t.place));
      head.appendChild(el("span", "tperiod", t.period));
      li.appendChild(head);

      li.appendChild(el("p", "tbody", t.body));
      if (t.chips && t.chips.length) {
        var ul = el("ul", "tchips");
        t.chips.forEach(function (c) { ul.appendChild(el("li", null, c)); });
        li.appendChild(ul);
      }
      tl.appendChild(li);
    });
  }

  /* ================= leadership ================= */
  var lh = document.getElementById("leadershipGrid");
  if (lh && typeof LEADERSHIP !== "undefined") {
    LEADERSHIP.forEach(function (l) {
      var d = el("div", "lcard reveal");
      d.appendChild(el("p", "lp", l.period));
      d.appendChild(el("h3", null, l.role));
      d.appendChild(el("p", "lo", l.org));
      d.appendChild(el("p", "lb", l.body));
      lh.appendChild(d);
    });
  }

  /* ================= papers ================= */
  var ph = document.getElementById("papers");
  if (ph && typeof PAPERS !== "undefined") {
    PAPERS.forEach(function (p) {
      var d = el("article", "paper reveal");
      d.appendChild(el("h3", null, p.title));
      d.appendChild(el("p", "pvenue", p.venue));
      d.appendChild(el("p", "psummary", p.summary));
      d.appendChild(linksNode(p.links));
      ph.appendChild(d);
    });
  }

  /* ================= portrait fallback ================= */
  var portrait = document.getElementById("portrait");
  var fallback = document.getElementById("photoFallback");
  if (portrait && fallback) {
    var showFallback = function () { portrait.style.display = "none"; fallback.hidden = false; };
    portrait.addEventListener("error", showFallback);
    if (portrait.complete && portrait.naturalWidth === 0) showFallback();
  }

  /* ================= map / list toggle ================= */
  var mapView = document.getElementById("mapView");
  var listView = document.getElementById("listView");
  var btnMap = document.getElementById("viewMap");
  var btnList = document.getElementById("viewList");
  if (mapView && listView && btnMap && btnList) {
    function setView(which) {
      var isMap = which === "map";
      mapView.hidden = !isMap;
      listView.hidden = isMap;
      btnMap.classList.toggle("active", isMap);
      btnList.classList.toggle("active", !isMap);
      btnMap.setAttribute("aria-pressed", isMap ? "true" : "false");
      btnList.setAttribute("aria-pressed", isMap ? "false" : "true");
      if (isMap && window.PGRAPH) requestAnimationFrame(function () { window.PGRAPH.layout(); });
    }
    btnMap.addEventListener("click", function () { setView("map"); });
    btnList.addEventListener("click", function () { setView("list"); });
    // the map needs room to read, so narrow screens open on the list
    if (window.innerWidth < 820) setView("list");
  }

  /* ================= editorial furniture ================= */
  // ghost numbers, word-by-word titles, scroll progress rail
  var heads = document.querySelectorAll(".section-head");
  Array.prototype.forEach.call(heads, function (head, i) {
    var n = el("span", "snum", (i + 1 < 10 ? "0" : "") + (i + 1));
    head.insertBefore(n, head.firstChild);

    var title = head.querySelector(".section-title");
    if (!title) return;
    var words = title.textContent.trim().split(/\s+/);
    title.textContent = "";
    words.forEach(function (w, k) {
      var span = el("span", "tword", w);
      span.style.transitionDelay = (k * 55) + "ms";
      title.appendChild(span);
      if (k < words.length - 1) title.appendChild(document.createTextNode(" "));
    });
  });

  var bar = document.getElementById("progressBar");
  if (bar) {
    var tick = function () {
      var max = document.body.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.style.transform = "scaleX(" + pct.toFixed(4) + ")";
    };
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
  }

  /* ================= cards react to the cursor ================= */
  if (!reduce && !(window.matchMedia && window.matchMedia("(pointer: coarse)").matches)) {
    Array.prototype.forEach.call(document.querySelectorAll(".pcard"), function (c) {
      c.addEventListener("mousemove", function (e) {
        var r = c.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        c.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        c.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        // small angles on purpose: enough to feel alive, not enough to distract
        var ry = (px - 0.5) * 5.0;
        var rx = (0.5 - py) * 3.4;
        c.style.transform = "perspective(1000px) rotateX(" + rx.toFixed(2) +
          "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-4px)";
      });
      c.addEventListener("mouseleave", function () { c.style.transform = ""; });
    });
    // stack chips stagger in with the card
    Array.prototype.forEach.call(document.querySelectorAll(".pstack"), function (ul) {
      Array.prototype.forEach.call(ul.children, function (li, k) {
        li.style.transitionDelay = (120 + k * 45) + "ms";
      });
    });
  }

  /* ================= reveal ================= */
  var items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(items, function (n) { n.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.04 });
    Array.prototype.forEach.call(items, function (n, i) {
      n.style.transitionDelay = Math.min(i % 5, 4) * 50 + "ms";
      io.observe(n);
    });
  }

  /* ================= nav + year ================= */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("stuck", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* =========================================================
     Waveform dividers. Rest as a slow-breathing line and swell
     with scroll speed, which is a nod to the speech work.
     ========================================================= */
  (function () {
    var canvases = document.querySelectorAll("canvas.wave");
    if (!canvases.length) return;

    var waves = [];
    var phase = 0, amp = 0, target = 0, frame = 0;
    var WRGB = nodeRGB();
    var lastY = window.scrollY, wraf = null;

    Array.prototype.forEach.call(canvases, function (wc) {
      waves.push({ el: wc, ctx: wc.getContext("2d"), w: 0, h: 0, dpr: 1 });
    });

    function wresize() {
      waves.forEach(function (wv) {
        var box = wv.el.getBoundingClientRect();
        wv.dpr = Math.min(window.devicePixelRatio || 1, 2);
        wv.w = Math.max(1, Math.round(box.width));
        wv.h = Math.max(1, Math.round(box.height));
        wv.el.width = Math.round(wv.w * wv.dpr);
        wv.el.height = Math.round(wv.h * wv.dpr);
        wv.ctx.setTransform(wv.dpr, 0, 0, wv.dpr, 0, 0);
      });
    }

    function line(wv, offset, alpha, width) {
      var ctx = wv.ctx, ww = wv.w, wh = wv.h;
      ctx.beginPath();
      for (var x = 0; x <= ww; x += 2) {
        var u = x / ww;
        var env = Math.pow(Math.sin(Math.PI * u), 0.75);
        var y = wh / 2 +
          env * amp * (
            Math.sin(u * 15 + phase + offset) * 0.55 +
            Math.sin(u * 31 - phase * 1.4 + offset) * 0.28 +
            Math.sin(u * 7 + phase * 0.6 + offset) * 0.34
          );
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(" + WRGB + "," + alpha + ")";
      ctx.lineWidth = width;
      ctx.stroke();
    }

    function drawAll() {
      waves.forEach(function (wv) {
        wv.ctx.clearRect(0, 0, wv.w, wv.h);
        line(wv, 0, 0.42, 1.5);
        line(wv, 1.9, 0.18, 1.1);
        line(wv, 3.8, 0.10, 1.0);
      });
    }

    function wstep() {
      if ((frame++ % 30) === 0) WRGB = nodeRGB();
      var dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      target = Math.min(30, 7 + dy * 0.55);
      amp += (target - amp) * 0.08;
      target *= 0.9;
      phase += 0.012 + Math.min(0.05, dy * 0.0016);
      drawAll();
      wraf = requestAnimationFrame(wstep);
    }

    wresize();
    if (reduce) { amp = 9; phase = 1; drawAll(); return; }
    wstep();
    var wrt;
    window.addEventListener("resize", function () {
      clearTimeout(wrt); wrt = setTimeout(wresize, 150);
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { if (wraf) { cancelAnimationFrame(wraf); wraf = null; } }
      else if (!wraf) wstep();
    });
  })();

  /* =========================================================
     Interactive graph background.

     A drifting field of nodes with edges between close pairs.
     The cursor pulls nearby nodes toward it and lights the edges
     it touches; springs return every node to its own path once
     the cursor moves on.
     ========================================================= */
  var canvas = document.getElementById("bg");
  if (!canvas || reduce) return;

  var ctx = canvas.getContext("2d", { alpha: true });
  var nodes = [], W = 0, H = 0, dpr = 1, raf = null;
  var mouse = { x: -9999, y: -9999, active: false };
  var NODE_RGB = "177,74,42";

  function readNodeColor() { NODE_RGB = nodeRGB(); }

  var LINK_DIST = 176;    // px between nodes for an edge to exist
  var PULL_DIST = 220;    // cursor influence radius
  var MAX_OFFSET = 20;    // px a node may ever move from its home position
  var EASE = 0.07;        // how quickly a node eases toward its target offset

  function density() {
    return Math.round(Math.min(132, Math.max(55, (W * H) / 13000)));
  }

  function build() {
    nodes = [];
    var n = density();
    for (var i = 0; i < n; i++) {
      var x = Math.random() * W, y = Math.random() * H;
      nodes.push({
        x: x, y: y, hx: x, hy: y, ox: 0, oy: 0,
        vx: (Math.random() - 0.5) * 0.10,
        vy: (Math.random() - 0.5) * 0.10,
        r: 1.3 + Math.random() * 1.3,
        lit: 0
      });
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function step() {
    ctx.clearRect(0, 0, W, H);
    var i, j, a, b, dx, dy, d2, d;

    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];

      // the node's home keeps drifting, so the field never sits still
      a.hx += a.vx; a.hy += a.vy;
      if (a.hx < 0 || a.hx > W) { a.vx *= -1; a.hx = Math.max(0, Math.min(W, a.hx)); }
      if (a.hy < 0 || a.hy > H) { a.vy *= -1; a.hy = Math.max(0, Math.min(H, a.hy)); }

      // where the cursor would like this node to sit, capped so a node can
      // never travel far from home and the field cannot collapse into a knot
      var tx = 0, ty = 0, f = 0;
      if (mouse.active) {
        dx = mouse.x - a.hx; dy = mouse.y - a.hy;
        d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < PULL_DIST) {
          f = 1 - d / PULL_DIST;
          var pull = f * f * MAX_OFFSET;
          tx = dx / d * pull;
          ty = dy / d * pull;
        }
      }
      a.ox += (tx - a.ox) * EASE;
      a.oy += (ty - a.oy) * EASE;
      a.lit += (f - a.lit) * EASE;

      a.x = a.hx + a.ox;
      a.y = a.hy + a.oy;
    }

    // edges
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        b = nodes[j];
        dx = a.x - b.x; dy = a.y - b.y;
        d2 = dx * dx + dy * dy;
        if (d2 > LINK_DIST * LINK_DIST) continue;
        d = Math.sqrt(d2);
        var base = (1 - d / LINK_DIST) * 0.18;
        var glow = Math.max(a.lit, b.lit);
        ctx.strokeStyle = "rgba(" + NODE_RGB + "," + (base + glow * 0.45).toFixed(3) + ")";
        ctx.lineWidth = 0.7 + glow * 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // the cursor joins the graph as a node of its own
    if (mouse.active) {
      var near = [];
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        dx = mouse.x - a.x; dy = mouse.y - a.y;
        d2 = dx * dx + dy * dy;
        if (d2 < 20000) near.push({ n: a, d: Math.sqrt(d2) });
      }
      near.sort(function (m, n) { return m.d - n.d; });
      for (i = 0; i < Math.min(4, near.length); i++) {
        var t = 1 - near[i].d / 142;
        if (t <= 0) continue;
        ctx.strokeStyle = "rgba(" + NODE_RGB + "," + (t * 0.40).toFixed(3) + ")";
        ctx.lineWidth = 0.7 + t * 0.8;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(near[i].n.x, near[i].n.y);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(" + NODE_RGB + ",0.50)";
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // nodes
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      ctx.fillStyle = "rgba(" + NODE_RGB + "," + (0.30 + a.lit * 0.45).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r + a.lit * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(step);
  }

  function start() { if (raf === null) raf = requestAnimationFrame(step); }
  function stop() { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }


  var coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  if (coarse || window.innerWidth < 768) { canvas.style.display = "none"; return; }

  readNodeColor();
  resize();
  start();

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      if (window.innerWidth < 768) { stop(); canvas.style.display = "none"; return; }
      canvas.style.display = "";
      resize();
      start();
    }, 160);
  });

  window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
  }, { passive: true });
  window.addEventListener("mouseout", function () { mouse.active = false; });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });
})();
