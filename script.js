
const cursor = document.getElementById("cursor");
const dot = document.getElementById("cursorDot");

let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  if (dot) {
    dot.style.left = `${mx}px`;
    dot.style.top = `${my}px`;
  }
});

(function animateCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  if (cursor) {
    cursor.style.left = `${cx}px`;
    cursor.style.top = `${cy}px`;
  }
  requestAnimationFrame(animateCursor);
})();


const canvas = document.getElementById("particles");
const ctx = canvas ? canvas.getContext("2d") : null;
let W = 0;
let H = 0;
let pts = [];

function resizeCanvas() {
  if (!canvas) return;
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

if (canvas && ctx) {
  for (let i = 0; i < 80; i++) {
    pts.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random(),
      color: Math.random() > 0.5 ? "124,58,237" : "34,211,238"
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    pts.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.a * 0.7})`;
      ctx.fill();
    });

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${0.15 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  drawParticles();
}


function animateCounter(el, target, duration = 1600) {
  let start = null;

  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

setTimeout(() => {
  document.querySelectorAll("[data-target]").forEach((el) => {
    animateCounter(el, parseInt(el.dataset.target, 10));
  });
}, 900);

// DEMO TILE
const injectedStyle = document.createElement("style");
injectedStyle.textContent = `
@keyframes tileIn {
  from { opacity: 0; transform: scale(0.6) rotateY(90deg); }
  to { opacity: 1; transform: scale(1) rotateY(0deg); }
}`;
document.head.appendChild(injectedStyle);


const tileInners = document.querySelectorAll(".demo-tile .tile-inner");
let autoFlipIdx = 0;
let activeDemo = null;

setInterval(() => {
  if (tileInners.length === 0) return;

  if (activeDemo !== null && tileInners[activeDemo]) {
    tileInners[activeDemo].style.transform = "";
  }

  activeDemo = autoFlipIdx;

  if (tileInners[autoFlipIdx]) {
    tileInners[autoFlipIdx].style.transform = "rotateY(180deg)";
  }

  setTimeout(() => {
    if (tileInners[autoFlipIdx]) {
      tileInners[autoFlipIdx].style.transform = "";
    }
    activeDemo = null;
  }, 1200);

  autoFlipIdx = (autoFlipIdx + 1) % tileInners.length;
}, 2000);


updateLoginUI();