document.addEventListener('DOMContentLoaded', () => {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = /*html*/ `
  <div>
    <h1>Rock Paper Scissors</h1>
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
      <p onclick="playGame('Rock')" id="rock">👊</p>
      <p onclick="playGame('Paper')" id="paper">✋</p>
      <p onclick="playGame('Scissors')" id="scissors">✌</p>
    </div>
    <div class="choiceDisplay">
      <p id="playerChoice">Player:  </p>
      <p id="computerChoice">Computer: </p>
    </div>
    <p id="resultDisplay"></p>
    <p id="finalResultDisplay"></p>
    <button id="replayBtn">Next Round</button>
  </div>
`
})
