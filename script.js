/* Einzelne Stelle, an der der Download-Link geändert wird. */
const DOWNLOAD_URL = "https://github.com/Magguluni/MaccaronyClient/releases/latest/download/MaccaronyClient-Setup.exe";

document.querySelectorAll("[data-download]").forEach((el) => {
  el.setAttribute("href", DOWNLOAD_URL);
});

const nav = document.getElementById("nav");
const toggle = document.querySelector(".nav-toggle");

const onScroll = () => {
  if (!nav) return;
  nav.classList.toggle("is-scrolled", window.scrollY > 8);
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

if (toggle) {
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Menü öffnen");
    });
  });
}

const revealEls = document.querySelectorAll(".reveal");
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

const shots = Array.from(document.querySelectorAll(".shot"));
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox ? lightbox.querySelector(".lightbox-img") : null;
const lightboxCap = lightbox ? lightbox.querySelector(".lightbox-cap") : null;
let shotIndex = 0;

function openLightbox(index) {
  if (!lightbox || !lightboxImg || !shots[index]) return;
  shotIndex = index;
  const shot = shots[index];
  lightboxImg.src = shot.dataset.full || shot.querySelector("img")?.src || "";
  lightboxImg.alt = shot.querySelector("img")?.alt || shot.dataset.caption || "";
  if (lightboxCap) lightboxCap.textContent = shot.dataset.caption || "";
  lightbox.hidden = false;
  lightbox.classList.add("is-open");
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lightbox-close")?.focus();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.hidden = true;
  if (lightboxImg) lightboxImg.src = "";
  document.body.style.overflow = "";
}

function stepLightbox(dir) {
  if (!shots.length) return;
  openLightbox((shotIndex + dir + shots.length) % shots.length);
}

shots.forEach((shot, i) => {
  shot.addEventListener("click", () => openLightbox(i));
});

if (lightbox) {
  lightbox.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox-nav.prev")?.addEventListener("click", (e) => {
    e.stopPropagation();
    stepLightbox(-1);
  });
  lightbox.querySelector(".lightbox-nav.next")?.addEventListener("click", (e) => {
    e.stopPropagation();
    stepLightbox(1);
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

document.addEventListener("keydown", (e) => {
  if (!lightbox?.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") stepLightbox(-1);
  if (e.key === "ArrowRight") stepLightbox(1);
});
