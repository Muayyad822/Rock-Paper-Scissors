let playerScoreDisplay = document.querySelector("#playerScore");
let computerScoreDisplay = document.querySelector("#computerScore");
let playerChoiceDisplay = document.querySelector("#playerChoice");
let computerChoiceDisplay = document.querySelector("#computerChoice");
let resultDisplay = document.querySelector("#resultDisplay"); 

let choices = ["Rock", "Paper", "Scissors"];
let trialsDisplay = document.querySelector("#trialsDisplay")
let winsDisplay = document.querySelector("#winsDisplay")
let playerScore = 0;
let computerScore = 0;
let trials = 0;
let wins = sessionStorage.getItem("wins") ? parseInt(sessionStorage.getItem("wins")) : 0;


function playGame(playerChoice){
    let computerChoice = choices[Math.floor(Math.random() * 3)];
    let result = " "
    let finalResultDisplay = document.querySelector("#finalResultDisplay");
    let replayBtn = document.querySelector('#replayBtn');
    
    winsDisplay.textContent = `Wins: ${wins}`

    if (playerChoice === computerChoice) {
        result = "IT'S A TIE"
    } else{
        switch (playerChoice) {
            case "Rock":
                result = (computerChoice === "Scissors") ? "YOU WIN" : "YOU LOSE"
                break;
            case "Paper":
                result = (computerChoice === "Rock") ? "YOU WIN" : "YOU LOSE"
                break;
            case "Scissors":
                result =  (computerChoice === "Paper") ? "YOU WIN" : "YOU LOSE"
                break;
        
            default:
                break;
        }
        
    } 

    playerChoiceDisplay.textContent = `Player: ${playerChoice}`
    computerChoiceDisplay.textContent = `Computer: ${computerChoice}`
    resultDisplay.textContent = result;
    resultDisplay.classList.remove("greenText", "redText")
    switch (result) {
        case "YOU WIN":
            resultDisplay.classList.add("greenText")
            playerScore++
            playerScoreDisplay.textContent = `Player: ${playerScore}`
            
            break;
        case "YOU LOSE":
           resultDisplay.classList.add("redText")
            computerScore++
            computerScoreDisplay.textContent = `Computer: ${computerScore}`
            break;
    
        default:
            break;
    }

    if (playerScore === 5) {
        finalResultDisplay.textContent = "You Won This Round"
        playerScore = 0;
        computerScore = 0;
        replayBtn.style.display = "block"
        wins++;
        sessionStorage.setItem("wins", wins);
        winsDisplay.textContent = `Wins: ${wins}`
    } else if (computerScore === 5){
        finalResultDisplay.textContent = "You Lost This Round"
        playerScore = 0;
        computerScore = 0;
        replayBtn.style.display = "block"
        
    } 
    
   // Initialize trials from localStorage or set it to 0 if it doesn't exist
let trials = sessionStorage.getItem("trials") ? parseInt(sessionStorage.getItem("trials")) : 0;

// Display the current trials count
trialsDisplay.textContent = `Trials: ${trials}`;


replayBtn.addEventListener("click", () => {
    trials++;
    sessionStorage.setItem("trials", trials); // Update trials in localStorage
    trialsDisplay.textContent = `Trials: ${trials}`;
    window.location.reload(); // Reload the page
});

}
