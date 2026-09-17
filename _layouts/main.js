(function () {
  "use strict";
  if (window.__theme_inited) return;
  window.__theme_inited = true;

  /* Older SSG releases emit the search trigger at a fixed viewport position
     instead of replacing the declared header slot. Normalise both generator
     behaviours before interaction begins. */
  var searchSlot = document.querySelector("[data-ssg-search]");
  var searchButton = document.getElementById("ssg-search-btn");
  if (searchSlot && searchButton) searchSlot.replaceWith(searchButton);

  /* Three states, not two: "system" is the absence of data-theme, so a
     visitor can hand the choice back to the operating system. The previous
     two-way switch stamped data-theme on the first click and never removed
     it. Voxt drives an emoji icon rather than paired SVGs, so the icon is
     set here rather than by CSS. */
  var ORDER = ["system", "light", "dark"];
  var ICONS = { system: "\u{1F5A5}\uFE0F", light: "\u2600\uFE0F", dark: "\u{1F319}" };

  function currentMode() {
    var set = document.documentElement.getAttribute("data-theme");
    return set === "light" || set === "dark" ? set : "system";
  }

  function labelFor(mode, btn, state) {
    if (mode === "system") return state ? state.getAttribute("data-label-system") || "System" : "System";
    return btn.getAttribute("data-label-" + mode) || (mode === "light" ? "Light" : "Dark");
  }

  function setMode(mode) {
    if (mode === "system") {
      document.documentElement.removeAttribute("data-theme");
      try { localStorage.removeItem("theme"); } catch (e) {}
    } else {
      document.documentElement.setAttribute("data-theme", mode);
      try { localStorage.setItem("theme", mode); } catch (e) {}
    }
    var btn = document.getElementById("mode-toggle");
    if (!btn) return;
    var icon = btn.querySelector(".theme-icon");
    if (icon) icon.textContent = ICONS[mode];
    var state = document.getElementById("mode-state");
    if (state) state.textContent = labelFor(mode, btn, state);
  }

  setMode(currentMode());

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("#mode-toggle");
    if (!btn) return;
    setMode(ORDER[(ORDER.indexOf(currentMode()) + 1) % ORDER.length]);
  });


  document.addEventListener("click", function (e) {
    var toggle = e.target.closest("#navToggle");
    if (!toggle) return;
    var menu = document.getElementById("navMenu");
    if (menu) {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("is-open");
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var menu = document.getElementById("navMenu");
      var toggle = document.getElementById("navToggle");
      if (menu && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
          toggle.focus();
        }
      }
    }
  });

  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var href = link.getAttribute("href");
    if (!href || href === "#") return;
    var target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      if (history.pushState) {
        history.pushState(null, null, href);
      }
      var menu = document.getElementById("navMenu");
      var toggle = document.getElementById("navToggle");
      if (menu && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      }
    }
  });
})();
