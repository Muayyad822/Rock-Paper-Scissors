document.addEventListener('DOMContentLoaded', () => {
  document.querySelector<HTMLDivElement>('#how-to')!.innerHTML = /*html*/ `
    <div class="container">
      <h1>How to Play Rock, Paper, Scissors</h1>
      <p>Welcome! Here’s a simple guide to help you understand and enjoy the game:</p>
      <ul>
        <p><span>Objective:</span>
        <ul>
          <li>The goal is to score 5 points before the computer does.</li>
        </ul>
        </p>
        <p><span>How to Play:</span></p>
        <ul>
          <li>Click on 👊 to choose "Rock, ✋ to choose" "Paper," or ✌ to choose "Scissors".</li>
          <li>The computer will make its choice randomly or strategically (depending on the level).</li>
          <li>Rock beats Scissors, Scissors beat Paper, and Paper beats Rock.</li>
        </ul>
        <p><span>Levels:</span></p>
        <ul>
          <li>Level 1: Simple randomness - anyone can win!</li>
          <li>Level 2: More challenging with smarter computer choices based on your gameplay.</li>
        </ul>

        <p><span>Winning a Round:</span>
        <ul>
          <li>Reach 5 points first to win a round.</li>
        </ul>
        </p>
        <p><span>Play Again:</span>
        <ul>
          <li>After a round, click "Play Again" to start fresh.</li>
        </ul>
        </p>
      </ul>
      <p>Ready to test your skills? Click below to head back to the game!</p>
      <button onclick="window.location.href='index.html'">Back to Game</button>
  </div>
`
})
