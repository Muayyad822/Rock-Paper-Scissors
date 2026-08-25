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

trialsDisplay.textContent = `Matches: ${trials}`;
winsDisplay.textContent = `Wins: ${wins}`;

// Instructions modal
function displayInstructions() {
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.88);
    color: #e8e6f0;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    z-index: 1000; padding: 24px;
    font-family: 'Orbitron', sans-serif;
  `;
  modal.innerHTML = `
    <h1 style="font-family:'Press Start 2P',monospace;font-size:1.2rem;margin-bottom:1.5rem;text-align:center;color:#ffcc00;">ROCK PAPER SCISSORS</h1>
    <p style="font-size:0.8rem;letter-spacing:2px;color:#6a6a8a;margin-bottom:1rem;">HOW TO PLAY</p>
    <ul style="list-style:none;padding:0;font-size:0.75rem;line-height:2.2;max-width:380px;">
      <li>🪨 📄 ✂️ — Tap a card to choose</li>
      <li>⚡ First to 5 wins the round</li>
      <li>🏆 Win 5 rounds → unlock Level 2</li>
      <li>🤖 Level 2 CPU plays smarter</li>
      <li>📊 Matches & wins saved per session</li>
    </ul>
    <div style="margin-top:24px;display:flex;gap:12px;">
      <button id="closeInstructions" style="font-family:'Press Start 2P',monospace;font-size:0.55rem;padding:12px 20px;cursor:pointer;background:#ffcc00;color:#0a0a1a;border:none;border-radius:10px;">LET'S GO</button>
      <button id="howToPage" style="font-family:'Press Start 2P',monospace;font-size:0.55rem;padding:12px 20px;cursor:pointer;background:transparent;color:#6a6a8a;border:2px solid #6a6a8a;border-radius:10px;">HOW TO PLAY</button>
    </div>
  `;
  document.body.appendChild(modal);

  document.querySelector("#closeInstructions").addEventListener("click", () => modal.remove());
  document.querySelector("#howToPage").addEventListener("click", () => window.location.href = "how-to.html");
}

displayInstructions();

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

function updateScores(result) {
  resultBanner.classList.remove("win", "lose", "tie");

  if (result === "YOU WIN") {
    resultBanner.classList.add("win");
    playerScore++;
    playerScoreDisplay.textContent = playerScore;
  } else if (result === "YOU LOSE") {
    resultBanner.classList.add("lose");
    computerScore++;
    computerScoreDisplay.textContent = computerScore;
  } else {
    resultBanner.classList.add("tie");
  }
}

function checkGameEnd() {
  if (playerScore === 5) {
    handleGameEnd("YOU WON THE ROUND!");
    wins++;
    sessionStorage.setItem("wins", wins);
    winsDisplay.textContent = `Wins: ${wins}`;
    if (wins === 5) {
      currentLevel++;
      finalResultDisplay.textContent = "🚀 LEVEL 2 UNLOCKED!";
      replayBtn.textContent = "LEVEL 2 →";
    }
  } else if (computerScore === 5) {
    handleGameEnd("CPU WINS THE ROUND");
  }
}

function handleGameEnd(message) {
  finalResultDisplay.textContent = message;
  playerScore = 0;
  computerScore = 0;
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
  trials++;
  sessionStorage.setItem("trials", trials);
  trialsDisplay.textContent = `Matches: ${trials}`;
  resetGameState();
});

function resetGameState() {
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
  if (!gameActive) return;

  const computerChoice =
    currentLevel === 1
      ? choices[Math.floor(Math.random() * 3)]
      : getBiasedComputerChoice(playerChoice);

  updateChoices(playerChoice, computerChoice);
  const result = determineResult(playerChoice, computerChoice);
  resultDisplay.textContent = result;
  updateScores(result);
  checkGameEnd();
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
