// ─── Sound Engine (Web Audio API — no external files) ───
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function ensureAudio() {
  if (!audioCtx) audioCtx = new AudioCtx();
  if (audioCtx.state === "suspended") audioCtx.resume();
}

let soundEnabled = true;

function playTone(freq, duration, type = "square", vol = 0.15) {
  if (!soundEnabled) return;
  ensureAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playClick()    { playTone(600, 0.08, "square", 0.1); }
function playWin()      {
  playTone(523, 0.12, "square", 0.12);
  setTimeout(() => playTone(659, 0.12, "square", 0.12), 80);
  setTimeout(() => playTone(784, 0.18, "square", 0.15), 160);
}
function playLose()     {
  playTone(330, 0.15, "sawtooth", 0.12);
  setTimeout(() => playTone(220, 0.25, "sawtooth", 0.12), 120);
}
function playTie()      { playTone(440, 0.15, "triangle", 0.1); }
function playStreak()   {
  playTone(784, 0.08, "square", 0.1);
  setTimeout(() => playTone(988, 0.08, "square", 0.1), 60);
  setTimeout(() => playTone(1175, 0.12, "square", 0.12), 120);
}
function playRoundWin() {
  [523, 659, 784, 1047].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.18, "square", 0.12), i * 100);
  });
}
function playRoundLose() {
  playTone(330, 0.2, "sawtooth", 0.1);
  setTimeout(() => playTone(262, 0.2, "sawtooth", 0.1), 150);
  setTimeout(() => playTone(196, 0.35, "sawtooth", 0.12), 300);
}
function playPause()    { playTone(300, 0.15, "triangle", 0.1); }
function playResume()   {
  playTone(400, 0.1, "triangle", 0.1);
  setTimeout(() => playTone(600, 0.12, "triangle", 0.12), 80);
}

// ─── Particle System ───
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor(x, y, color, velX, velY, size, life) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = velX;
    this.vy = velY;
    this.size = size;
    this.life = life;
    this.maxLife = life;
    this.gravity = 0.15;
  }
  update() {
    this.x += this.vx;
    this.vy += this.gravity;
    this.y += this.vy;
    this.life--;
    this.vx *= 0.98;
  }
  draw() {
    const alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function spawnBurst(x, y, colors, count = 30) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = 3 + Math.random() * 5;
    particles.push(new Particle(
      x, y,
      colors[Math.floor(Math.random() * colors.length)],
      Math.cos(angle) * speed,
      Math.sin(angle) * speed - 2,
      2 + Math.random() * 4,
      30 + Math.random() * 20
    ));
  }
}

function spawnConfetti(count = 50) {
  const colors = ["#ff2d55", "#00d4ff", "#ffcc00", "#00ff88", "#ff69b4", "#7b68ee"];
  const w = canvas.width;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(
      Math.random() * w,
      -10 - Math.random() * 40,
      colors[Math.floor(Math.random() * colors.length)],
      (Math.random() - 0.5) * 4,
      2 + Math.random() * 3,
      3 + Math.random() * 5,
      60 + Math.random() * 40
    ));
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── Haptic Feedback ───
function haptic(ms = 15) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

// ─── DOM Elements ───
const playerScoreDisplay = document.querySelector("#playerScore");
const computerScoreDisplay = document.querySelector("#computerScore");
const playerEmoji = document.querySelector("#playerEmoji");
const computerEmoji = document.querySelector("#computerEmoji");
const resultDisplay = document.querySelector("#resultDisplay");
const resultBanner = document.querySelector("#resultBanner");
const trialsDisplay = document.querySelector("#trialsDisplay");
const winsDisplay = document.querySelector("#winsDisplay");
const finalResultDisplay = document.querySelector("#finalResultDisplay");
const replayBtn = document.querySelector("#replayBtn");
const playerSlot = document.querySelector("#playerChoice");
const computerSlot = document.querySelector("#computerChoice");
const vsDisplay = document.querySelector("#vsDisplay");
const streakBox = document.querySelector("#streakBox");
const streakNum = document.querySelector("#streakNum");
const streakFire = document.querySelector("#streakFire");
const pauseBtn = document.querySelector("#pauseBtn");
const pauseOverlay = document.querySelector("#pauseOverlay");
const pauseResume = document.querySelector("#pauseResume");
const pauseRestart = document.querySelector("#pauseRestart");
const pauseMenu = document.querySelector("#pauseMenu");
const pauseSound = document.querySelector("#pauseSound");

const EMOJI_MAP = {
  Rock: "🪨",
  Paper: "📄",
  Scissors: "✂️",
};

const choices = ["Rock", "Paper", "Scissors"];
let playerScore = 0;
let computerScore = 0;
let trials = Number(sessionStorage.getItem("trials")) || 0;
let wins = Number(sessionStorage.getItem("wins")) || 0;
let gameActive = true;
let currentLevel = 1;
let streak = 0;
let autoResetTimer = null;
let autoResetScheduledAt = 0;
let isPaused = false;

trialsDisplay.textContent = `Matches: ${trials}`;
winsDisplay.textContent = `Wins: ${wins}`;

// ─── Sound Toggle (in pause overlay) ───
function updateSoundUI() {
  pauseSound.textContent = soundEnabled ? "🔊 SOUND" : "🔇 SOUND";
  pauseSound.classList.toggle("muted", !soundEnabled);
}

pauseSound.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  updateSoundUI();
  haptic(10);
});

updateSoundUI();

// ─── Pause / Resume ───
function pauseGame() {
  if (isPaused) return;
  isPaused = true;
  playPause();
  haptic(15);
  pauseOverlay.classList.add("active");
  // Freeze the timer but remember when it was scheduled
  clearTimeout(autoResetTimer);
}

function resumeGame() {
  if (!isPaused) return;
  isPaused = false;
  playResume();
  haptic(10);
  pauseOverlay.classList.remove("active");
  // Resume the auto-reset timer with remaining time
  resumeAutoReset();
}

pauseBtn.addEventListener("click", () => {
  if (isPaused) {
    resumeGame();
  } else {
    pauseGame();
  }
});

pauseResume.addEventListener("click", () => {
  resumeGame();
});

// ─── Restart Round ───
function restartRound() {
  playClick();
  haptic(10);
  clearTimeout(autoResetTimer);
  autoResetScheduledAt = 0;
  if (isPaused) {
    isPaused = false;
    pauseOverlay.classList.remove("active");
  }
  // Keep wins and trials, just reset the current round scores
  playerScore = 0;
  computerScore = 0;
  streak = 0;
  playerScoreDisplay.textContent = 0;
  computerScoreDisplay.textContent = 0;
  finalResultDisplay.textContent = "";
  resultDisplay.textContent = "";
  resultBanner.classList.remove("win", "lose", "tie");
  replayBtn.style.display = "none";
  playerEmoji.textContent = "❓";
  computerEmoji.textContent = "❓";
  playerSlot.classList.remove("winner", "loser");
  computerSlot.classList.remove("winner", "loser");
  streakBox.classList.remove("active", "hot");
  gameActive = true;
  setChoiceButtonsDisabled(false);
}

pauseRestart.addEventListener("click", restartRound);

// ─── Back to Menu ───
function showMenu() {
  playClick();
  haptic(10);
  if (isPaused) {
    isPaused = false;
    pauseOverlay.classList.remove("active");
  }
  displayInstructions();
}

pauseMenu.addEventListener("click", showMenu);

// ─── Instructions Modal ───
function displayInstructions() {
  // Remove existing modal if any
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.style.cssText = `
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.92);
    color: #e8e6f0;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    z-index: 1000; padding: 24px;
    font-family: 'Orbitron', sans-serif;
    animation: fadeIn 0.3s ease;
  `;
  modal.innerHTML = `
    <h1 style="font-family:'Press Start 2P',monospace;font-size:1.2rem;margin-bottom:1.5rem;text-align:center;color:#ffcc00;">ROCK PAPER SCISSORS</h1>
    <p style="font-size:0.8rem;letter-spacing:2px;color:#6a6a8a;margin-bottom:1rem;">HOW TO PLAY</p>
    <ul style="list-style:none;padding:0;font-size:0.75rem;line-height:2.2;max-width:380px;">
      <li>🪨 📄 ✂️ — Tap a card to choose</li>
      <li>⚡ First to 5 wins the round</li>
      <li>🏆 Win 5 rounds → unlock Level 2</li>
      <li>🔥 Win streaks for bonus glory</li>
      <li>🤖 Level 2 CPU plays smarter</li>
    </ul>
    <div style="margin-top:24px;display:flex;gap:12px;">
      <button id="closeInstructions" style="font-family:'Press Start 2P',monospace;font-size:0.55rem;padding:12px 20px;cursor:pointer;background:#ffcc00;color:#0a0a1a;border:none;border-radius:10px;">LET'S GO</button>
      <button id="howToPage" style="font-family:'Press Start 2P',monospace;font-size:0.55rem;padding:12px 20px;cursor:pointer;background:transparent;color:#6a6a8a;border:2px solid #6a6a8a;border-radius:10px;">HOW TO PLAY</button>
    </div>
  `;
  document.body.appendChild(modal);

  document.querySelector("#closeInstructions").addEventListener("click", () => {
    ensureAudio();
    playClick();
    modal.remove();
  });
  document.querySelector("#howToPage").addEventListener("click", () => {
    playClick();
    window.location.href = "how-to.html";
  });
}

displayInstructions();

// ─── Auto-Reset After 2 Seconds ───
function scheduleAutoReset() {
  clearTimeout(autoResetTimer);
  autoResetScheduledAt = Date.now();
  autoResetTimer = setTimeout(() => {
    clearRoundState();
  }, 2000);
}

function resumeAutoReset() {
  if (autoResetScheduledAt === 0) return;
  const elapsed = Date.now() - autoResetScheduledAt;
  const remaining = Math.max(2000 - elapsed, 100);
  clearTimeout(autoResetTimer);
  autoResetTimer = setTimeout(() => {
    autoResetScheduledAt = 0;
    clearRoundState();
  }, remaining);
}

function clearRoundState() {
  autoResetScheduledAt = 0;
  playerEmoji.textContent = "❓";
  computerEmoji.textContent = "❓";
  resultDisplay.textContent = "";
  resultBanner.classList.remove("win", "lose", "tie");
  playerSlot.classList.remove("winner", "loser");
  computerSlot.classList.remove("winner", "loser");
  setChoiceButtonsDisabled(false);
}

// ─── Game Logic ───
function updateChoices(playerChoice, computerChoice) {
  playerEmoji.textContent = EMOJI_MAP[playerChoice] || "❓";
  computerEmoji.textContent = EMOJI_MAP[computerChoice] || "❓";

  playerSlot.classList.remove("winner", "loser");
  computerSlot.classList.remove("winner", "loser");

  const result = determineResult(playerChoice, computerChoice);
  if (result === "YOU WIN") {
    playerSlot.classList.add("winner");
    computerSlot.classList.add("loser");
  } else if (result === "YOU LOSE") {
    computerSlot.classList.add("winner");
    playerSlot.classList.add("loser");
  }
}

function determineResult(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return "IT'S A TIE";
  if (
    (playerChoice === "Rock" && computerChoice === "Scissors") ||
    (playerChoice === "Paper" && computerChoice === "Rock") ||
    (playerChoice === "Scissors" && computerChoice === "Paper")
  ) return "YOU WIN";
  return "YOU LOSE";
}

function updateStreak(result) {
  if (result === "YOU WIN") {
    streak++;
  } else if (result === "YOU LOSE") {
    streak = 0;
  }

  if (streak >= 2) {
    streakBox.classList.add("active");
    streakNum.textContent = streak;
    if (streak >= 3) {
      streakBox.classList.add("hot");
      streakFire.textContent = streak >= 5 ? "⚡" : "🔥";
    }
  } else {
    streakBox.classList.remove("active", "hot");
  }
}

function updateScores(result) {
  resultBanner.classList.remove("win", "lose", "tie");

  if (result === "YOU WIN") {
    resultBanner.classList.add("win");
    playerScore++;
    playerScoreDisplay.textContent = playerScore;
    document.querySelector(".score-player").classList.remove("pop");
    void document.querySelector(".score-player").offsetWidth;
    document.querySelector(".score-player").classList.add("pop");
    playWin();
    haptic(20);

    const rect = playerSlot.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2,
      ["#00ff88", "#00d4ff", "#ffcc00"], 20);

  } else if (result === "YOU LOSE") {
    resultBanner.classList.add("lose");
    computerScore++;
    computerScoreDisplay.textContent = computerScore;
    document.querySelector(".score-computer").classList.remove("pop");
    void document.querySelector(".score-computer").offsetWidth;
    document.querySelector(".score-computer").classList.add("pop");
    playLose();
    haptic([15, 30, 15]);
    vsDisplay.classList.add("shake");
    setTimeout(() => vsDisplay.classList.remove("shake"), 400);

  } else {
    resultBanner.classList.add("tie");
    playTie();
    haptic(10);
  }

  updateStreak(result);

  if (streak >= 3 && result === "YOU WIN") {
    playStreak();
    const rect = streakBox.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2,
      ["#ffcc00", "#ff69b4", "#ff2d55"], 15);
  }
}

function checkGameEnd() {
  if (playerScore === 5) {
    handleRoundEnd("YOU WON THE ROUND!");
    playRoundWin();
    spawnConfetti(80);
    haptic([20, 50, 20, 50, 20]);
    wins++;
    sessionStorage.setItem("wins", wins);
    winsDisplay.textContent = `Wins: ${wins}`;
    if (wins === 5) {
      currentLevel++;
      finalResultDisplay.textContent = "🚀 LEVEL 2 UNLOCKED!";
      replayBtn.textContent = "LEVEL 2 →";
      spawnConfetti(120);
    }
  } else if (computerScore === 5) {
    handleRoundEnd("CPU WINS THE ROUND");
    playRoundLose();
    haptic([30, 50, 30]);
  }
}

function handleRoundEnd(message) {
  clearTimeout(autoResetTimer);
  autoResetScheduledAt = 0;
  finalResultDisplay.textContent = message;
  playerScore = 0;
  computerScore = 0;
  streak = 0;
  streakBox.classList.remove("active", "hot");
  replayBtn.style.display = "block";
  gameActive = false;
  setChoiceButtonsDisabled(true);
}

function setChoiceButtonsDisabled(disabled) {
  document.querySelectorAll(".choice-btn").forEach(btn => {
    btn.classList.toggle("disabled", disabled);
  });
}

replayBtn.addEventListener("click", () => {
  playClick();
  haptic(10);
  trials++;
  sessionStorage.setItem("trials", trials);
  trialsDisplay.textContent = `Matches: ${trials}`;
  resetGameState();
});

function resetGameState() {
  clearTimeout(autoResetTimer);
  autoResetScheduledAt = 0;
  playerScore = 0;
  computerScore = 0;
  playerScoreDisplay.textContent = 0;
  computerScoreDisplay.textContent = 0;
  finalResultDisplay.textContent = "";
  resultDisplay.textContent = "";
  resultBanner.classList.remove("win", "lose", "tie");
  replayBtn.style.display = "none";
  playerEmoji.textContent = "❓";
  computerEmoji.textContent = "❓";
  playerSlot.classList.remove("winner", "loser");
  computerSlot.classList.remove("winner", "loser");
  gameActive = true;
  setChoiceButtonsDisabled(false);
}

function playGame(playerChoice) {
  if (!gameActive || isPaused) return;

  playClick();
  haptic(8);

  // Disable buttons during cooldown
  setChoiceButtonsDisabled(true);

  const computerChoice =
    currentLevel === 1
      ? choices[Math.floor(Math.random() * 3)]
      : getBiasedComputerChoice(playerChoice);

  updateChoices(playerChoice, computerChoice);
  const result = determineResult(playerChoice, computerChoice);
  resultDisplay.textContent = result;
  updateScores(result);
  checkGameEnd();

  // Auto-reset after 2 seconds (only if round is still active)
  if (gameActive) {
    scheduleAutoReset();
  }
}

function getBiasedComputerChoice(playerChoice) {
  switch (playerChoice) {
    case "Rock":
      return Math.random() < 0.7 ? "Paper" : choices[Math.floor(Math.random() * 3)];
    case "Paper":
      return Math.random() < 0.7 ? "Scissors" : choices[Math.floor(Math.random() * 3)];
    case "Scissors":
      return Math.random() < 0.7 ? "Rock" : choices[Math.floor(Math.random() * 3)];
    default:
      return choices[Math.floor(Math.random() * 3)];
  }
}

document.querySelectorAll(".choice-btn").forEach(btn => {
  btn.addEventListener("click", () => playGame(btn.dataset.choice));
});
