const WORD = "JAMESBOND";
const CODE = "0525";

/* Emoji rain control */
const EMOJI_RAIN_DURATION = 2500;
const EMOJI_INTERVAL = 150;

const GRID = [
  ["J","A","M","E","S","B","O","N","D"],
  ["Q","J","A","M","E","S","B","O","N"],
  ["R","Q","J","A","M","E","S","B","O"],
  ["T","R","Q","J","A","M","E","S","B"],
  ["U","T","R","Q","J","A","M","E","S"],
  ["V","U","T","R","Q","J","A","M","E"],
  ["W","V","U","T","R","Q","J","A","M"],
  ["X","W","V","U","T","R","Q","J","A"],
  ["Y","X","W","V","U","T","R","Q","J"]
];

const gridEl = document.getElementById("grid");
const codeBox = document.getElementById("codeBox");
const continueBtn = document.getElementById("continueBtn");
const resetBtn = document.getElementById("resetBtn");
const celebration = document.getElementById("celebration");

let selected = [];
let dragging = false;
let emojiTimer = null;

/* ---------- BUILD GRID ---------- */
GRID.forEach((row, r) => {
  row.forEach((letter, c) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = letter;
    cell.dataset.row = r;
    cell.dataset.col = c;

    cell.addEventListener("mousedown", () => start(cell));
    cell.addEventListener("mouseenter", () => move(cell));

    cell.addEventListener("touchstart", e => {
      e.preventDefault();
      start(cell);
    });

    cell.addEventListener("touchmove", e => {
      e.preventDefault();
      const t = document.elementFromPoint(
        e.touches[0].clientX,
        e.touches[0].clientY
      );
      if (t && t.classList.contains("cell")) move(t);
    });

    gridEl.appendChild(cell);
  });
});

document.addEventListener("mouseup", end);
document.addEventListener("touchend", end);

/* ---------- GAME LOGIC ---------- */
function start(cell) {
  clearSelection();
  dragging = true;
  select(cell);
}

function move(cell) {
  if (!dragging) return;
  if (selected.includes(cell)) return;
  if (selected.length >= WORD.length) return;
  select(cell);
}

function end() {
  if (!dragging) return;
  dragging = false;
  validate();
}

function select(cell) {
  selected.push(cell);
  cell.classList.add("selected");
}

function clearSelection() {
  selected.forEach(c => c.classList.remove("selected"));
  selected = [];
}

function validate() {
  if (selected.length !== WORD.length || !isStraightLine()) {
    wrong();
    return;
  }

  const text = selected.map(c => c.textContent).join("");
  const reversed = text.split("").reverse().join("");

  if (text === WORD || reversed === WORD) {
    revealSuccess();
  } else {
    wrong();
  }
}

function isStraightLine() {
  const rows = selected.map(c => +c.dataset.row);
  const cols = selected.map(c => +c.dataset.col);

  const sameRow = rows.every(r => r === rows[0]);
  const sameCol = cols.every(c => c === cols[0]);
  const diag1 = rows.every((r,i) => r - rows[0] === cols[i] - cols[0]);
  const diag2 = rows.every((r,i) => r - rows[0] === -(cols[i] - cols[0]));

  return sameRow || sameCol || diag1 || diag2;
}

/* ✅ THIS WAS THE KEY FIX */
function revealSuccess() {
  codeBox.classList.remove("hidden");
  continueBtn.classList.remove("hidden");
  resetBtn.classList.remove("hidden");
  startEmojiCelebration();
}

function wrong() {
  gridEl.classList.add("shake");
  setTimeout(() => {
    gridEl.classList.remove("shake");
    clearSelection();
  }, 400);
}

/* ---------- RESET ---------- */
resetBtn.addEventListener("click", () => {
  clearSelection();
  codeBox.classList.add("hidden");
  continueBtn.classList.add("hidden");
  resetBtn.classList.add("hidden");
  celebration.innerHTML = "";

  if (emojiTimer) {
    clearInterval(emojiTimer);
    emojiTimer = null;
  }
});

/* ---------- 🎊 EMOJI CELEBRATION ---------- */
const EMOJIS = ["🎉", "🎊", "✨", "🥳"];

function startEmojiCelebration() {
  const startTime = Date.now();

  emojiTimer = setInterval(() => {
    if (Date.now() - startTime > EMOJI_RAIN_DURATION) {
      clearInterval(emojiTimer);
      emojiTimer = null;
      return;
    }
    createEmoji();
  }, EMOJI_INTERVAL);
}

function createEmoji() {
  const emoji = document.createElement("div");
  emoji.className = "emoji";
  emoji.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  emoji.style.left = Math.random() * 100 + "vw";
  emoji.style.animationDuration = 2 + Math.random() * 1 + "s";

  celebration.appendChild(emoji);

  setTimeout(() => emoji.remove(), 3000);
}
