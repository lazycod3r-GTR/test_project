const cards = [
  "cards/card1.jpg",
  "cards/card2.jpg",
  "cards/card3.jpg",
  "cards/card4.jpg",
  "cards/card5.jpg"
];

let index = 0;

const img = document.getElementById("card");
const pageIndicator = document.getElementById("pageIndicator");

/* ---------- UPDATE PAGE NUMBER ---------- */
function updatePageIndicator() {
  pageIndicator.style.opacity = 0;

  setTimeout(() => {
    pageIndicator.textContent = `${index + 1} / ${cards.length}`;
    pageIndicator.style.opacity = 1;
  }, 200);
}

/* ---------- NAVIGATION (NO LOOPING) ---------- */
function next() {
  if (index < cards.length - 1) {
    index++;
    img.src = cards[index];
    updatePageIndicator();
  }
}

function prev() {
  if (index > 0) {
    index--;
    img.src = cards[index];
    updatePageIndicator();
  }
}

/* ---------- TOUCH / SWIPE SUPPORT ---------- */
let startX = 0;
let startY = 0;

img.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: true });

img.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const diffX = endX - startX;
  const diffY = endY - startY;

  if (Math.max(Math.abs(diffX), Math.abs(diffY)) < 30) return;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    diffX < 0 ? next() : prev();
  } else {
    diffY < 0 ? next() : prev();
  }
});
