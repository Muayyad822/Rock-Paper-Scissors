import { chunk } from 'stunk';
import { withPersistence } from 'stunk/middleware';

// Get the elements from the DOM
const playerScoreDisplay = document.querySelector<HTMLParagraphElement>("#playerScore");
const computerScoreDisplay = document.querySelector<HTMLParagraphElement>("#computerScore");
const playerChoiceDisplay = document.querySelector<HTMLParagraphElement>("#playerChoice");
const computerChoiceDisplay = document.querySelector<HTMLParagraphElement>("#computerChoice");
const resultDisplay = document.querySelector<HTMLParagraphElement>("#resultDisplay");
const trialsDisplay = document.querySelector<HTMLParagraphElement>("#trialsDisplay");
const winsDisplay = document.querySelector<HTMLParagraphElement>("#winsDisplay");
const finalResultDisplay = document.querySelector<HTMLParagraphElement>("#finalResultDisplay");
const replayBtn = document.querySelector<HTMLButtonElement>("#replayBtn");
const choiceButtons = document.querySelectorAll<HTMLParagraphElement>(".choice-button");


// Initialize Stunk chunks
const choices = chunk(["Rock", "Paper", "Scissors"]);
const playerScore = chunk(0);
const computerScore = chunk(0);
const trialsChunk = withPersistence(chunk({ trials: 0 }), {
  key: "trials",
  storage: sessionStorage,
});
const winsChunk = withPersistence(chunk({ wins: 0 }), {
  key: "wins",
  storage: sessionStorage,
});
const gameActive = chunk(true);
const currentLevel = chunk(1);




if (trialsDisplay && winsDisplay) {
  const trials = trialsChunk.get().trials;
  const wins = winsChunk.get().wins;

  trialsDisplay.textContent = `Trials: ${trials}`;
  winsDisplay.textContent = `No of Wins: ${wins}`;
}


function displayInstructions() {
  const instructionsModal = document.createElement("div") as HTMLDivElement;
  instructionsModal.classList.add("instructions-modal");

  instructionsModal.innerHTML = `
    <div style="font-family: "Inter"">
      <h1>Welcome to Rock, Paper, Scissors!</h1>
      <p>Instructions:</p>
      <ul>
        <li>1. Click "Rock," "Paper," or "Scissors" to make your choice.</li>
        <li>2. The computer will also make a choice.</li>
        <li>3. Win a round by reaching 5 points before the computer.</li>
        <li>4. Win five rounds to unlock Level 2 with smarter computer choices.</li>
        <li>5. Click "Play Again" after a round to reset the game and start a new round.</li>
        <li>6. Your wins and trials are tracked and saved as long as you stay in this browser.</li>
      </ul>
      <div style="display: flex; justify-content: center; gap: 1rem; font-family: "Inter"">
        <button id="closeInstructions">Got It!</button>
        <button id="howToPage">How To Play</button>
      </div>
    </div>
  `;

  document.body.appendChild(instructionsModal);

  const closeInstructionsBtn = document.querySelector<HTMLButtonElement>("#closeInstructions");
  const howToBtn = document.querySelector<HTMLButtonElement>("#howToPage");

  if (closeInstructionsBtn) {
    closeInstructionsBtn.addEventListener("click", () => {
      instructionsModal.remove();
    });
  }

  if (howToBtn) {
    howToBtn.addEventListener("click", () => {
      window.location.href = "/how-to.html";
    });
  }
}

// DDisplay instructions on the first trial
if (trialsChunk.get().trials === 0) {
  displayInstructions();
}

function updateChoices(playerChoice: string, computerChoice: string): boolean {
  try {
    if (!playerChoiceDisplay || !computerChoiceDisplay) {
      console.error("Choice display elements not found in the DOM");
      return false;
    }

    playerChoiceDisplay.textContent = `Player: ${playerChoice}`;
    computerChoiceDisplay.textContent = `Computer: ${computerChoice}`;

    return true;
  } catch (error) {
    console.error("Failed to update choices:", error);
    return false;
  }
}

function determineResult(playerChoice: string, computerChoice: string): string {
  if (playerChoice === computerChoice) return "IT'S A TIE";

  const winningConditions: Record<string, string> = {
    Rock: "Scissors",
    Paper: "Rock",
    Scissors: "Paper",
  };

  return winningConditions[playerChoice] === computerChoice ? "YOU WIN" : "YOU LOSE";
}

function updateScores(result: string) {
  if (!resultDisplay || !playerScoreDisplay || !computerScoreDisplay) return;

  resultDisplay.classList.remove("greenText", "redText");

  if (result === "YOU WIN") {
    resultDisplay.classList.add("greenText");
    playerScore.update((score) => score + 1);
    playerScoreDisplay.textContent = `Player: ${playerScore.get()}`;
  } else if (result === "YOU LOSE") {
    resultDisplay.classList.add("redText");
    computerScore.update((score) => score + 1);
    computerScoreDisplay.textContent = `Computer: ${computerScore.get()}`;
  }
}

function checkGameEnd() {
  const playerScoreValue = playerScore.get();
  const computerScoreValue = computerScore.get();

  if (playerScoreValue === 5) {
    handleGameEnd("You Won This Round");

    winsChunk.update((prev) => {
      const updatedWins = prev.wins + 1;

      if (winsDisplay) {
        winsDisplay.textContent = `Wins: ${updatedWins}`;
      }

      if (updatedWins === 5) {
        currentLevel.update((level) => level + 1);
        alert("Congratulations! You've advanced to Level 2.");
        if (replayBtn) {
          replayBtn.textContent = "Go To Level 2";
        }
      }

      return { wins: updatedWins };
    });
  } else if (computerScoreValue === 5) {
    handleGameEnd("You Lost This Round");
  }

}

function handleGameEnd(message: string) {
  if (finalResultDisplay) {
    finalResultDisplay.textContent = message;
  }

  // Reset scores using Stunk
  playerScore.reset();
  computerScore.reset();

  if (replayBtn) {
    replayBtn.style.display = "block";
  }

  gameActive.set(false);
}


function setupReplayButton() {
  if (!replayBtn) return;

  replayBtn.addEventListener("click", () => {
    trialsChunk.update((prev) => {
      const updatedTrials = prev.trials + 1;

      if (trialsDisplay) {
        trialsDisplay.textContent = `Trials: ${updatedTrials}`;
      }

      return { trials: updatedTrials };
    });

    // Reset game state
    resetGameState();
  });
}


function resetGameState() {
  const compScore = computerScore.get();
  const playScore = playerScore.get();

  playerScore.reset();
  computerScore.reset();

  if (playerScoreDisplay) playerScoreDisplay.textContent = `Player: 0`;
  if (computerScoreDisplay) computerScoreDisplay.textContent = `Computer: 0`;
  if (finalResultDisplay) finalResultDisplay.textContent = "";
  if (resultDisplay) resultDisplay.textContent = "";

  if (playScore === 0 && compScore === 0) {
    if (replayBtn) replayBtn.style.display = "none";
  }

  gameActive.set(true);
}



function playGame(playerChoice: string) {
  const activeGame = gameActive.get();
  const currLevel = currentLevel.get();
  const choice = choices.get();

  if (!activeGame) return;

  const computerChoice =
    currLevel === 1
      ? choice[Math.floor(Math.random() * choice.length)]
      : getBiasedComputerChoice(playerChoice);

  const result = determineResult(playerChoice, computerChoice);

  updateChoices(playerChoice, computerChoice);

  if (resultDisplay) {
    resultDisplay.textContent = result;
  }

  updateScores(result);
  checkGameEnd();
}

function getBiasedComputerChoice(playerChoice: string) {
  const availableChoices = choices.get();

  switch (playerChoice) {
    case "Rock":
      return Math.random() < 0.7
        ? "Paper"
        : availableChoices[Math.floor(Math.random() * availableChoices.length)];
    case "Paper":
      return Math.random() < 0.7
        ? "Scissors"
        : availableChoices[Math.floor(Math.random() * availableChoices.length)];
    case "Scissors":
      return Math.random() < 0.7
        ? "Rock"
        : availableChoices[Math.floor(Math.random() * availableChoices.length)];
    default:
      return availableChoices[Math.floor(Math.random() * availableChoices.length)];
  }
}

setupReplayButton();

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const playerChoice = button.getAttribute("data-choice");
    if (playerChoice) {
      playGame(playerChoice);
    } else {
      console.error("Button missing data-choice attribute:", button);
    }
  });
});
