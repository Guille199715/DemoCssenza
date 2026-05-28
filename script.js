const body = document.body;
const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-scroll-progress]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuClose = document.querySelector("[data-menu-close]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const menuOverlay = document.querySelector("[data-menu-overlay]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const backTop = document.querySelector("[data-back-top]");
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main > section, .signal-strip");
const navLinks = document.querySelectorAll('.desktop-nav a[href^="#"]');
const panelButtons = document.querySelectorAll("[data-panel-target]");
const panels = document.querySelectorAll("[data-panel]");
const previewPanel = document.querySelector("[data-preview-panel]");
const previewModeButtons = document.querySelectorAll("[data-preview-mode]");
const intensityRange = document.querySelector("[data-intensity-range]");
const countItems = document.querySelectorAll("[data-count]");
const expandCards = document.querySelectorAll("[data-expand-card]");
const focusButton = document.querySelector("[data-focus-mode]");
const timeline = document.querySelector("[data-timeline]");
const steps = document.querySelectorAll(".timeline .step");
const faqItems = document.querySelectorAll(".faq-item");
const magneticItems = document.querySelectorAll(".btn, .header-cta, .icon-button, .contact-link, .back-top");
const tiltCards = document.querySelectorAll("[data-tilt-card]");
const internalLinks = document.querySelectorAll('a[href^="#"]');
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const compactMotionQuery = window.matchMedia("(max-width: 760px)");
const lightMotion = reducedMotionQuery.matches || compactMotionQuery.matches || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

if (lightMotion) {
  body.classList.add("light-motion");
}

const savedTheme = localStorage.getItem("cssenza-demo-theme");
if (savedTheme === "light") {
  body.classList.add("modo-claro");
}

function openMenu() {
  body.classList.add("menu-open");
  mobileMenu?.classList.add("active");
  menuOverlay?.classList.add("active");
  menuToggle?.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  body.classList.remove("menu-open");
  mobileMenu?.classList.remove("active");
  menuOverlay?.classList.remove("active");
  menuToggle?.setAttribute("aria-expanded", "false");
}

function toggleTheme() {
  body.classList.toggle("modo-claro");
  localStorage.setItem("cssenza-demo-theme", body.classList.contains("modo-claro") ? "light" : "dark");
}

function updateScrollState() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const amount = maxScroll > 0 ? window.scrollY / maxScroll : 0;

  if (progress) progress.style.transform = `scaleX(${amount})`;
  if (header) header.classList.toggle("scrolled", window.scrollY > 24);
  if (backTop) backTop.classList.toggle("visible", window.scrollY > 520);

  if (!lightMotion) {
    body.style.setProperty("--hero-shift", `${Math.min(window.scrollY * -0.06, 0)}px`);
  }

  updateActiveNav();
  updateProcessLine();
}

function updateActiveNav() {
  let activeId = "inicio";

  navLinks.forEach((link) => {
    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);

    if (target && window.scrollY >= target.offsetTop - 190) {
      activeId = targetId;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
  });
}

function updateProcessLine() {
  if (!timeline) return;
  if (lightMotion) {
    timeline.style.setProperty("--process-progress", "100%");
    steps.forEach((step) => step.classList.add("process-lit"));
    return;
  }

  const rect = timeline.getBoundingClientRect();
  const raw = (window.innerHeight * 0.72 - rect.top) / Math.max(rect.height, 1);
  const amount = Math.min(Math.max(raw, 0), 1);
  const litCount = Math.ceil(amount * steps.length);

  timeline.style.setProperty("--process-progress", `${amount * 100}%`);
  steps.forEach((step, index) => {
    step.classList.toggle("process-lit", index < litCount);
  });
}

function scrollToTarget(hash, behavior = "smooth") {
  const target = hash === "#inicio" ? document.getElementById("inicio") : document.querySelector(hash);
  if (!target) return;

  const headerOffset = (header?.offsetHeight || 0) + 34;
  const top = hash === "#inicio"
    ? 0
    : target.getBoundingClientRect().top + window.scrollY - headerOffset;

  window.scrollTo({ top: Math.max(top, 0), behavior: lightMotion ? "auto" : behavior });
}

function selectPanel(panelName) {
  panelButtons.forEach((button) => {
    const isActive = button.dataset.panelTarget === panelName;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.panel === panelName;
    panel.hidden = !isActive;
    panel.classList.toggle("active", isActive);
  });
}

function animateCount(item) {
  if (item.dataset.counted === "true") return;
  item.dataset.counted = "true";

  const target = Number(item.dataset.count || 0);
  if (lightMotion) {
    item.textContent = String(target);
    return;
  }

  const duration = 1100;
  const start = performance.now();

  function tick(now) {
    const progressAmount = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progressAmount, 3);
    item.textContent = String(Math.round(target * eased));

    if (progressAmount < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          if (entry.target.matches("[data-count]")) animateCount(entry.target);
          entry.target.querySelectorAll?.("[data-count]").forEach(animateCount);
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    )
  : null;

const sectionObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("section-active", entry.isIntersecting);
        });
      },
      { rootMargin: "-28% 0px -55% 0px", threshold: 0 }
    )
  : null;

document.querySelectorAll(".signal-grid, .experiment-grid, .showcase-grid, .timeline, .faq-list, .contact-actions").forEach((group) => {
  group.querySelectorAll(".reveal").forEach((item, index) => {
    item.classList.add(index % 2 === 0 ? "reveal-from-left" : "reveal-from-right");
    item.style.setProperty("--reveal-delay", `${Math.min(index * 80, 280)}ms`);
  });
});

if (revealObserver) {
  revealItems.forEach((item) => revealObserver.observe(item));
  countItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
  countItems.forEach(animateCount);
}

if (sectionObserver) {
  sections.forEach((section) => sectionObserver.observe(section));
}

panelButtons.forEach((button) => {
  button.addEventListener("click", () => selectPanel(button.dataset.panelTarget));
});

previewModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.previewMode;
    previewModeButtons.forEach((item) => item.classList.toggle("active", item === button));
    previewPanel?.classList.remove("mode-flow", "mode-grid", "mode-commerce");
    previewPanel?.classList.add(`mode-${mode}`);
  });
});

intensityRange?.addEventListener("input", () => {
  const value = Number(intensityRange.value) / 100;
  previewPanel?.style.setProperty("--intensity", String(value));
});

expandCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("expanded");
  });
});

focusButton?.addEventListener("click", () => {
  body.classList.toggle("focus-mode");
  focusButton.textContent = body.classList.contains("focus-mode") ? "Salir de enfoque" : "Activar enfoque";
});

faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;

    faqItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.open = false;
      }
    });
  });
});

if (!lightMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.addEventListener("pointermove", (event) => {
    body.style.setProperty("--cursor-x", `${event.clientX}px`);
    body.style.setProperty("--cursor-y", `${event.clientY}px`);
  });

  magneticItems.forEach((item) => {
    item.classList.add("magnetic");

    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;

      item.style.setProperty("--magnet-x", `${x.toFixed(2)}px`);
      item.style.setProperty("--magnet-y", `${y.toFixed(2)}px`);
    });

    item.addEventListener("pointerleave", () => {
      item.style.setProperty("--magnet-x", "0px");
      item.style.setProperty("--magnet-y", "0px");
    });
  });

  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

themeToggle?.addEventListener("click", toggleTheme);
menuToggle?.addEventListener("click", openMenu);
menuClose?.addEventListener("click", closeMenu);
menuOverlay?.addEventListener("click", closeMenu);

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

internalLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;

    event.preventDefault();
    history.pushState(null, "", hash);
    closeMenu();
    scrollToTarget(hash);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileMenu?.classList.contains("active")) {
    closeMenu();
  }
});

backTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: lightMotion ? "auto" : "smooth" });
});

let scrollTicking = false;
function requestScrollStateUpdate() {
  if (scrollTicking) return;

  scrollTicking = true;
  requestAnimationFrame(() => {
    updateScrollState();
    scrollTicking = false;
  });
}

window.addEventListener("scroll", requestScrollStateUpdate, { passive: true });
window.addEventListener("resize", updateScrollState);

updateScrollState();

if (window.location.hash) {
  window.setTimeout(() => {
    scrollToTarget(window.location.hash, "auto");
    updateScrollState();
  }, 80);
}
