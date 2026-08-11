const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const header = document.querySelector("[data-header]");
const year = document.querySelector("[data-year]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (year) {
  year.textContent = new Date().getFullYear();
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("aman-theme", theme);
  themeToggle?.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
}

applyTheme(root.dataset.theme || "light");

themeToggle?.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function closeMenu() {
  navLinks?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open navigation menu");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks?.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}, { passive: true });

const revealElements = document.querySelectorAll(".reveal");
document.querySelectorAll(".hero .reveal").forEach((element) => element.classList.add("is-visible"));

if (!reduceMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

if ("IntersectionObserver" in window) {
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navAnchors.forEach((anchor) => {
        anchor.classList.toggle("active", anchor.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { threshold: 0.3, rootMargin: "-28% 0px -55% 0px" });

  sections.forEach((section) => activeObserver.observe(section));
}

const tiltTarget = document.querySelector("[data-tilt]");

if (tiltTarget && !reduceMotion) {
  tiltTarget.addEventListener("pointermove", (event) => {
    const bounds = tiltTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltTarget.style.transform = `rotateX(${y * -3}deg) rotateY(${x * 4}deg) translateY(-2px)`;
  });

  tiltTarget.addEventListener("pointerleave", () => {
    tiltTarget.style.transform = "";
  });
}
