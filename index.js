// let playerScoreDisplay = document.querySelector("#playerScore");
// let computerScoreDisplay = document.querySelector("#computerScore");
// let playerChoiceDisplay = document.querySelector("#playerChoice");
// let computerChoiceDisplay = document.querySelector("#computerChoice");
// let resultDisplay = document.querySelector("#resultDisplay"); 

// let choices = ["Rock", "Paper", "Scissors"];
// let trialsDisplay = document.querySelector("#trialsDisplay")
// let winsDisplay = document.querySelector("#winsDisplay")
// let playerScore = 0;
// let computerScore = 0;
// let trials = 0;
// let wins = sessionStorage.getItem("wins") ? parseInt(sessionStorage.getItem("wins")) : 0;


// function playGame(playerChoice){
//     let computerChoice = choices[Math.floor(Math.random() * 3)];
//     let result = " "
//     let finalResultDisplay = document.querySelector("#finalResultDisplay");
//     let replayBtn = document.querySelector('#replayBtn');
    
//     winsDisplay.textContent = `Wins: ${wins}`

//     if (playerChoice === computerChoice) {
//         result = "IT'S A TIE"
//     } else{
//         switch (playerChoice) {
//             case "Rock":
//                 result = (computerChoice === "Scissors") ? "YOU WIN" : "YOU LOSE"
//                 break;
//             case "Paper":
//                 result = (computerChoice === "Rock") ? "YOU WIN" : "YOU LOSE"
//                 break;
//             case "Scissors":
//                 result =  (computerChoice === "Paper") ? "YOU WIN" : "YOU LOSE"
//                 break;
        
//             default:
//                 break;
//         }
        
//     } 

//     playerChoiceDisplay.textContent = `Player: ${playerChoice}`
//     computerChoiceDisplay.textContent = `Computer: ${computerChoice}`
//     resultDisplay.textContent = result;
//     resultDisplay.classList.remove("greenText", "redText")
//     switch (result) {
//         case "YOU WIN":
//             resultDisplay.classList.add("greenText")
//             playerScore++
//             playerScoreDisplay.textContent = `Player: ${playerScore}`
            
//             break;
//         case "YOU LOSE":
//            resultDisplay.classList.add("redText")
//             computerScore++
//             computerScoreDisplay.textContent = `Computer: ${computerScore}`
//             break;
    
//         default:
//             break;
//     }

//     if (playerScore === 5) {
//         finalResultDisplay.textContent = "You Won This Round"
//         playerScore = 0;
//         computerScore = 0;
//         replayBtn.style.display = "block"
//         wins++;
//         sessionStorage.setItem("wins", wins);
//         winsDisplay.textContent = `Wins: ${wins}`
//     } else if (computerScore === 5){
//         finalResultDisplay.textContent = "You Lost This Round"
//         playerScore = 0;
//         computerScore = 0;
//         replayBtn.style.display = "block"
        
//     } 
    
//    // Initialize trials from localStorage or set it to 0 if it doesn't exist
// let trials = sessionStorage.getItem("trials") ? parseInt(sessionStorage.getItem("trials")) : 0;

// // Display the current trials count
// trialsDisplay.textContent = `Trials: ${trials}`;


// replayBtn.addEventListener("click", () => {
//     trials++;
//     sessionStorage.setItem("trials", trials); // Update trials in localStorage
//     trialsDisplay.textContent = `Trials: ${trials}`;
//     window.location.reload(); // Reload the page
// });

// }







// Select DOM elements for displaying scores, choices, and results
const playerScoreDisplay = document.querySelector("#playerScore");
const computerScoreDisplay = document.querySelector("#computerScore");
const playerChoiceDisplay = document.querySelector("#playerChoice");
const computerChoiceDisplay = document.querySelector("#computerChoice");
const resultDisplay = document.querySelector("#resultDisplay");
const trialsDisplay = document.querySelector("#trialsDisplay");
const winsDisplay = document.querySelector("#winsDisplay");
const finalResultDisplay = document.querySelector("#finalResultDisplay");
const replayBtn = document.querySelector("#replayBtn");
const instructionsModal = document.createElement("div"); // Modal for instructions
const choiceButtons = document.querySelectorAll(".choice-button"); // Buttons for player choices

// Initialize game variables
const choices = ["Rock", "Paper", "Scissors"];
let playerScore = 0;
let computerScore = 0;
let trials = Number(sessionStorage.getItem("trials")) || 0;
let wins = Number(sessionStorage.getItem("wins")) || 0;
let gameActive = true; // New variable to control game state
let currentLevel = 1; // Track the current level

// Display initial values
trialsDisplay.textContent = `Trials: ${trials}`;
winsDisplay.textContent = `Wins: ${wins}`;

// Create and display instructions modal
// Create and display instructions modal
function displayInstructions() {
  instructionsModal.style.position = "fixed";
  instructionsModal.style.top = "0";
  instructionsModal.style.left = "0";
  instructionsModal.style.width = "100vw";
  instructionsModal.style.height = "100vh";
  instructionsModal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  instructionsModal.style.color = "#fff";
  instructionsModal.style.display = "flex";
  instructionsModal.style.flexDirection = "column";
  instructionsModal.style.justifyContent = "center";
  instructionsModal.style.alignItems = "center";
  instructionsModal.style.zIndex = "1000";
  instructionsModal.style.padding = "20px";
  instructionsModal.style.boxSizing = "border-box";
  instructionsModal.style.textAlign = "center";

  instructionsModal.innerHTML = `
   <h1 style="font-size: 2rem; margin-bottom: 1rem;">Welcome to Rock, Paper, Scissors!</h1>
    <p style="font-size: 1.2rem; margin-bottom: 1rem;">Instructions:</p>
    <ul style="list-style: none; padding: 0; font-size: 1rem;">
      <li style="margin-bottom: 0.5rem;">1. Click "Rock," "Paper," or "Scissors" to make your choice.</li>
      <li style="margin-bottom: 0.5rem;">2. The computer will also make a choice.</li>
      <li style="margin-bottom: 0.5rem;">3. Win a round by reaching 5 points before the computer.</li>
      <li style="margin-bottom: 0.5rem;">4. Win five rounds to unlock Level 2 with smarter computer choices.</li>
      <li style="margin-bottom: 0.5rem;">5. Click "Play Again" after a round to reset the game and start a new round.</li>
      <li style="margin-bottom: 0.5rem;">6. Your wins and trials are tracked and saved as long as you stay in this browser.</li>
    </ul>
    <div style="margin-top: 20px; display: flex; gap: 10px;">
      <button id="closeInstructions" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background-color: #8b3535; color: white; border: none; border-radius: 5px; display: block;">Got It!</button>
      <button id="howToPage" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background-color: #8b3535; color: white; border: none; border-radius: 5px; display: block;">How To Play</button>
    </div>
  `;

  document.body.appendChild(instructionsModal);

  // Close instructions modal
  document.querySelector("#closeInstructions").addEventListener("click", () => {
    instructionsModal.style.display = "none";
  });

  // Navigate to the how-to page
  document.querySelector("#howToPage").addEventListener("click", () => {
    window.location.href = "how-to.html"; // Replace "how-to.html" with the actual URL of your how-to page
  });
}


displayInstructions();


function updateChoices(playerChoice, computerChoice) {
  playerChoiceDisplay.textContent = `Player: ${playerChoice}`;
  computerChoiceDisplay.textContent = `Computer: ${computerChoice}`;
}

function determineResult(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return "IT'S A TIE";

  switch (playerChoice) {
    case "Rock":
      return computerChoice === "Scissors" ? "YOU WIN" : "YOU LOSE";
    case "Paper":
      return computerChoice === "Rock" ? "YOU WIN" : "YOU LOSE";
    case "Scissors":
      return computerChoice === "Paper" ? "YOU WIN" : "YOU LOSE";
    default:
      return "Invalid choice";
  }
}

function updateScores(result) {
  resultDisplay.classList.remove("greenText", "redText");

  if (result === "YOU WIN") {
    resultDisplay.classList.add("greenText");
    playerScore++;
    playerScoreDisplay.textContent = `Player: ${playerScore}`;
  } else if (result === "YOU LOSE") {
    resultDisplay.classList.add("redText");
    computerScore++;
    computerScoreDisplay.textContent = `Computer: ${computerScore}`;
  }
}

function checkGameEnd() {
  if (playerScore === 5) {
    handleGameEnd("You Won This Round");
    wins++;
    sessionStorage.setItem("wins", wins);
    winsDisplay.textContent = `Wins: ${wins}`;
    if (wins === 5) {
      currentLevel++;
      alert("Congratulations! You've advanced to Level 2.");
      replayBtn.textContent = "Go To Level 2"
    }
  } else if (computerScore === 5) {
    handleGameEnd("You Lost This Round");
  }
}

function handleGameEnd(message) {
  finalResultDisplay.textContent = message;
  playerScore = 0;
  computerScore = 0;
  replayBtn.style.display = "block";
  gameActive = false; // Disable further play until replay button is clicked
}

function setupReplayButton() {
  replayBtn.addEventListener("click", () => {
    trials++;
    sessionStorage.setItem("trials", trials);
    trialsDisplay.textContent = `Trials: ${trials}`;
    resetGameState();
  });
}

function resetGameState() {
  playerScore = 0;
  computerScore = 0;
  playerScoreDisplay.textContent = `Player: ${playerScore}`;
  computerScoreDisplay.textContent = `Computer: ${computerScore}`;
  finalResultDisplay.textContent = "";
  resultDisplay.textContent = "";
  replayBtn.style.display = "none";
  gameActive = true; // Re-enable game play
}

function playGame(playerChoice) {
  if (!gameActive) return; // Prevent play if the game is inactive

  const computerChoice =
    currentLevel === 1
      ? choices[Math.floor(Math.random() * choices.length)]
      : getBiasedComputerChoice(playerChoice);
  const result = determineResult(playerChoice, computerChoice);

  updateChoices(playerChoice, computerChoice);
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

setupReplayButton();
choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const playerChoice = button.dataset.choice;
    playGame(playerChoice);
  });
});





// /**
//  * Generate the computer's choice based on the current level.
//  * @param {string} playerChoice - The player's choice.
//  * @returns {string} - The computer's choice.
//  */
// function getComputerChoice(playerChoice) {
//   if (level === 1) {
//     return choices[Math.floor(Math.random() * choices.length)];
//   } else {
//     // Level 2 logic: Introduce bias based on the player's choice
//     let bias = Math.random() > 0.7 ? playerChoice : choices[Math.floor(Math.random() * choices.length)];
//     return bias === "Rock"
//       ? Math.random() > 0.5 ? "Paper" : "Scissors"
//       : bias === "Paper"
//       ? Math.random() > 0.5 ? "Scissors" : "Rock"
//       : Math.random() > 0.5 ? "Rock" : "Paper";
//   }
// }