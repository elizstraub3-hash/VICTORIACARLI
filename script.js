/* ===================================================================
   Victoria Carli — Lash Designer | interações
   =================================================================== */
(function () {
  "use strict";

  const header = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  /* ---- Header muda ao rolar ---- */
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Menu mobile ---- */
  const toggleMenu = (open) => {
    const willOpen = open ?? !nav.classList.contains("open");
    nav.classList.toggle("open", willOpen);
    document.body.classList.toggle("nav-open", willOpen);
    navToggle.setAttribute("aria-expanded", String(willOpen));
  };
  navToggle.addEventListener("click", () => toggleMenu());

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) toggleMenu(false);
  });

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- Dropdown de Higiene ---- */
  const navDd = document.getElementById("navDd");
  const navDdBtn = document.getElementById("navDdBtn");
  if (navDd && navDdBtn) {
    navDdBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = navDd.classList.toggle("open");
      navDdBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => {
      if (!navDd.contains(e.target)) {
        navDd.classList.remove("open");
        navDdBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Hero slideshow ---- */
  const hero = document.getElementById("inicio");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero__slide"));
    const dots = Array.from(hero.querySelectorAll(".hero__dot"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (slides.length > 1) {
      let current = 0;
      let timer = null;
      const INTERVAL = 5500;

      const go = (index) => {
        current = (index + slides.length) % slides.length;
        slides.forEach((s, i) => s.classList.toggle("is-active", i === current));
        dots.forEach((d, i) => d.classList.toggle("is-active", i === current));
      };

      const start = () => {
        if (reduceMotion) return;
        stop();
        timer = setInterval(() => go(current + 1), INTERVAL);
      };
      const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

      dots.forEach((dot) => {
        dot.addEventListener("click", () => {
          go(Number(dot.dataset.goto));
          start();
        });
      });

      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stop(); else start();
      });

      start();
    }
  }

  /* ---- Ano no rodapé ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
