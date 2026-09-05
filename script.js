/* Shivangi Kumar. No dependencies. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= theme ================= */
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  if (stored === "dark" || stored === "light") root.setAttribute("data-theme", stored);
  else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) root.setAttribute("data-theme", "dark");

  var toggle = document.getElementById("themeToggle");
  if (toggle) toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    readNodeColor();
  });

  /* ================= helpers ================= */
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

    var tags = [];
    PROJECTS.forEach(function (p) {
      (p.tags || []).forEach(function (t) { if (tags.indexOf(t) < 0) tags.push(t); });
    });
    tags.sort();

    function applyFilter(value) {
      Array.prototype.forEach.call(document.querySelectorAll("[data-tags]"), function (c) {
        var ok = value === "*" || c.getAttribute("data-tags").split("|").indexOf(value) >= 0;
        c.style.display = ok ? "" : "none";
      });
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

  function readNodeColor() {
    var v = getComputedStyle(root).getPropertyValue("--node").trim();
    if (v) NODE_RGB = v;
  }

  var LINK_DIST = 132;    // px between nodes for an edge to exist
  var PULL_DIST = 220;    // cursor influence radius
  var MAX_OFFSET = 20;    // px a node may ever move from its home position
  var EASE = 0.07;        // how quickly a node eases toward its target offset

  function density() {
    return Math.round(Math.min(80, Math.max(34, (W * H) / 22000)));
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
        r: 1.0 + Math.random() * 1.2,
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
        var base = (1 - d / LINK_DIST) * 0.11;
        var glow = Math.max(a.lit, b.lit);
        ctx.strokeStyle = "rgba(" + NODE_RGB + "," + (base + glow * 0.26).toFixed(3) + ")";
        ctx.lineWidth = 0.55 + glow * 0.5;
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
        ctx.strokeStyle = "rgba(" + NODE_RGB + "," + (t * 0.22).toFixed(3) + ")";
        ctx.lineWidth = 0.55 + t * 0.5;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(near[i].n.x, near[i].n.y);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(" + NODE_RGB + ",0.30)";
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // nodes
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      ctx.fillStyle = "rgba(" + NODE_RGB + "," + (0.14 + a.lit * 0.34).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r + a.lit * 1.1, 0, Math.PI * 2);
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
