/* Shivangi Kumar — site behaviour. No dependencies. */
(function () {
  "use strict";

  /* ---------- theme ---------- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  if (stored === "dark" || stored === "light") {
    root.setAttribute("data-theme", stored);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.setAttribute("data-theme", "dark");
  }
  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- helpers ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function mediaNode(p) {
    var wrap = el("div", "pmedia");
    var m = p.media;
    if (!m) {
      var ph = el("div", "pmedia-placeholder");
      ph.setAttribute("data-note", "demo coming soon");
      ph.appendChild(el("span", "glyph", p.title.charAt(0)));
      wrap.appendChild(ph);
      return wrap;
    }
    if (m.type === "video") {
      var v = document.createElement("video");
      v.setAttribute("controls", "");
      v.setAttribute("preload", "metadata");
      v.setAttribute("playsinline", "");
      if (m.poster) v.setAttribute("poster", m.poster);
      v.src = m.src;
      wrap.appendChild(v);
    } else if (m.type === "youtube") {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + m.id;
      f.title = p.title + " demo";
      f.loading = "lazy";
      f.allow = "accelerometer; clipboard-write; encrypted-media; picture-in-picture";
      f.setAttribute("allowfullscreen", "");
      wrap.appendChild(f);
    } else if (m.type === "image") {
      var i = document.createElement("img");
      i.src = m.src;
      i.alt = m.alt || p.title;
      i.loading = "lazy";
      wrap.appendChild(i);
    }
    return wrap;
  }

  function linksNode(links) {
    var box = el("div", "plinks");
    (links || []).forEach(function (l) {
      var a = el("a", "plink", l.label);
      a.href = l.href;
      if (/^https?:/.test(l.href)) { a.target = "_blank"; a.rel = "noopener"; }
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

  /* ---------- projects ---------- */
  var featuredHost = document.getElementById("featuredProjects");
  var moreHost = document.getElementById("moreProjects");
  var filterHost = document.getElementById("filters");

  function featuredCard(p) {
    var card = el("article", "pcard pcard-featured reveal");
    card.setAttribute("data-tags", (p.tags || []).join("|"));
    card.appendChild(mediaNode(p));
    var body = el("div", "pbody");
    if (p.kicker) body.appendChild(el("p", "pkicker", p.kicker));
    body.appendChild(el("h3", "ptitle", p.title));
    body.appendChild(el("p", "pblurb", p.blurb));
    if (p.detail) body.appendChild(el("p", "pdetail", p.detail));
    var st = stackNode(p.stack);
    if (st) body.appendChild(st);
    body.appendChild(linksNode(p.links));
    card.appendChild(body);
    return card;
  }

  function smallCard(p) {
    var card = el("article", "scard reveal");
    card.setAttribute("data-tags", (p.tags || []).join("|"));
    if (p.kicker) card.appendChild(el("p", "pkicker", p.kicker));
    card.appendChild(el("h3", "ptitle", p.title));
    card.appendChild(el("p", "pblurb", p.blurb));
    var st = stackNode(p.stack);
    if (st) card.appendChild(st);
    card.appendChild(linksNode(p.links));
    return card;
  }

  if (typeof PROJECTS !== "undefined" && featuredHost && moreHost) {
    PROJECTS.forEach(function (p) {
      (p.featured ? featuredHost : moreHost).appendChild(
        p.featured ? featuredCard(p) : smallCard(p)
      );
    });

    /* filter chips built from the tags actually in use */
    var tags = [];
    PROJECTS.forEach(function (p) {
      (p.tags || []).forEach(function (t) { if (tags.indexOf(t) < 0) tags.push(t); });
    });
    tags.sort();

    function makeChip(label, value) {
      var b = el("button", "chip", label);
      b.type = "button";
      b.setAttribute("data-filter", value);
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(filterHost.children, function (c) {
          c.classList.toggle("active", c === b);
        });
        applyFilter(value);
      });
      return b;
    }

    function applyFilter(value) {
      var cards = document.querySelectorAll("[data-tags]");
      Array.prototype.forEach.call(cards, function (c) {
        var match = value === "*" || c.getAttribute("data-tags").split("|").indexOf(value) >= 0;
        c.style.display = match ? "" : "none";
      });
    }

    if (filterHost) {
      var all = makeChip("All", "*");
      all.classList.add("active");
      filterHost.appendChild(all);
      tags.forEach(function (t) { filterHost.appendChild(makeChip(t, t)); });
    }
  }

  /* ---------- timeline ---------- */
  var tl = document.getElementById("timeline");
  if (tl && typeof TIMELINE !== "undefined") {
    TIMELINE.forEach(function (t) {
      var li = el("li", "tnode reveal");
      li.appendChild(el("span", "tperiod", t.period));
      li.appendChild(el("h3", "trole", t.role));
      li.appendChild(el("p", "torg", t.org));
      if (t.place) li.appendChild(el("p", "tplace", t.place));
      li.appendChild(el("p", "tbody", t.body));
      tl.appendChild(li);
    });
  }

  /* ---------- papers ---------- */
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

  /* ---------- scroll reveal ---------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(items, function (n) { n.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    Array.prototype.forEach.call(items, function (n, i) {
      n.style.transitionDelay = Math.min(i % 6, 5) * 55 + "ms";
      io.observe(n);
    });
  }

  /* ---------- sticky nav border ---------- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("stuck", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
