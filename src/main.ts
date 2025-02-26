document.addEventListener('DOMContentLoaded', () => {
  const appDiv = document.querySelector<HTMLDivElement>('#app')!;

  appDiv.innerHTML = /*html*/ `
    <div>
      <h1 style="text-align: center;">Rock Paper Scissors</h1>
      <div class="info">
        <div class="scoreDisplay">
          <p id="playerScore">Player: 0</p>
          <p id="computerScore">Computer: 0</p>
        </div>
        <div class="scoreDisplay">
          <p id="trialsDisplay">Trials: 0</p>
          <p id="winsDisplay">No of Wins: 0</p>
        </div>
      </div>

      <div class="choices">
        <p class="choice-button" data-choice="Rock">👊</p>
        <p class="choice-button" data-choice="Paper">✋</p>
        <p class="choice-button" data-choice="Scissors">✌</p>
      </div>

      <div class="choiceDisplay">
        <p id="playerChoice">Player: </p>
        <p id="computerChoice">Computer: </p>
      </div>

      <p id="resultDisplay" style="text-align: center;"></p>
      <p id="finalResultDisplay"></p>

      <div style="display: flex; justify-content: center;">
        <!-- I removed the css own because it is conflicting -->
        <button id="replayBtn" style="display: none;">
          Next Round
        </button>
      </div>
    </div>
  `;

  import('./game').then((module) => {
    console.log("Game logic loaded successfully.", module);
  }).catch((err) => {
    console.error("Failed to load game.ts:", err);
  });
});
