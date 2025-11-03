// ==============================
// INICIO: Loader y modo claro
// ==============================

// Ocultar loader al cargar
window.addEventListener("load", () => {
  document.getElementById("loader").classList.add("oculto");
});

// Toggle modo claro desde tarjeta
document.getElementById("modoToggleCard").addEventListener("click", () => {
  document.body.classList.toggle("modo-claro");
});

// Toggle modo claro desde encabezado
document.getElementById("modoToggle").addEventListener("click", () => {
  document.body.classList.toggle("modo-claro");
});

// Activar modo creativo
function activarModo() {
  document.body.classList.toggle("creativo");
  alert("¡Modo creativo activado!");
}

// ==============================
// GSAP: Animaciones base
// ==============================

gsap.registerPlugin(ScrollTrigger);

// Animación de entrada para elementos con clase .animar
gsap.to(".animar", {
  opacity: 1,
  y: 0,
  duration: 1,
  stagger: 0.3,
  scrollTrigger: {
    trigger: ".animar",
    start: "top 80%",
  }
});

// ==============================
// FLIP: Tarjetas giratorias
// ==============================

function activarFlip(elemento) {
  elemento.classList.toggle("girado");
}

// ==============================
// CONTADOR animado
// ==============================

let count = { val: 0 };
gsap.to(count, {
  val: 12,
  duration: 2,
  scrollTrigger: {
    trigger: ".card.contador",
    start: "top 80%",
  },
  onUpdate: () => {
    document.getElementById("contador").textContent = Math.floor(count.val);
  }
});

// ==============================
// PARALLAX dinámico
// ==============================

gsap.to(".card.parallax-gsap", {
  backgroundPosition: "center 40%",
  scrollTrigger: {
    trigger: ".card.parallax-gsap",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

gsap.to(".contenido-parallax", {
  y: -20,
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut"
});

// ==============================
// AGRUPADOR de tarjetas
// ==============================

let agrupado = false;
let posicionesOriginales = [];

function toggleAgrupador() {
  const tarjetas = document.querySelectorAll(".card");
  const grid = document.querySelector(".grid");

  if (!agrupado) {
    posicionesOriginales = [];

    tarjetas.forEach((card, i) => {
      if (card.classList.contains("agrupador")) return;

      const rect = card.getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();
      const offsetX = rect.left - gridRect.left;
      const offsetY = rect.top - gridRect.top;

      posicionesOriginales.push({ card, x: offsetX, y: offsetY });

      card.style.position = "absolute";
      card.style.left = `${offsetX}px`;
      card.style.top = `${offsetY}px`;
      card.style.width = `${rect.width}px`;
      card.style.height = `${rect.height}px`;
      card.style.zIndex = 10 + i;

      const centroX = grid.clientWidth / 2 - rect.width / 2;
      const centroY = grid.clientHeight / 2 - rect.height / 2;

      gsap.to(card, {
        x: centroX - offsetX,
        y: centroY - offsetY + i * 8,
        scale: 0.85 - i * 0.03,
        rotation: i % 2 === 0 ? 2 : -2,
        opacity: 0.95,
        duration: 0.8,
        ease: "power2.out",
        delay: i * 0.02
      });
    });

    agrupado = true;
  } else {
    posicionesOriginales.forEach(({ card }, i) => {
      gsap.to(card, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.inOut",
        delay: i * 0.02,
        onComplete: () => {
          card.style.position = "";
          card.style.left = "";
          card.style.top = "";
          card.style.width = "";
          card.style.height = "";
          card.style.zIndex = "";
        }
      });
    });

    agrupado = false;
  }
}
