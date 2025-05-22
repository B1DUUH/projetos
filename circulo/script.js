const circle = document.getElementById("circle");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const difficultySelect = document.getElementById("difficulty");
const gameDiv = document.getElementById("game");
const menuDiv = document.getElementById("menu");
const rankingList = document.getElementById("rankingList");
const clickSound = document.getElementById("clickSound");

let score = 0;
let gameRunning = false;
let countdown;
let gameTimer;
let autoMove;
let timeLeft = 30;
let moveDelay = 1000;

function getRandomPosition() {
  const gameArea = document.getElementById("gameArea");
  const areaRect = gameArea.getBoundingClientRect();
  const maxX = areaRect.width - 100;
  const maxY = areaRect.height - 100;
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);
  return { x, y };
}

function moveCircle() {
  const gameArea = document.getElementById("gameArea");
  const { x, y } = getRandomPosition();
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  circle.style.display = "block";
}

function createExplosion(x, y) {
  const explosion = document.createElement("div");
  explosion.className = "explosion";
  explosion.style.left = `${x - 50}px`; // centraliza
  explosion.style.top = `${y - 50}px`;
  document.body.appendChild(explosion);

  setTimeout(() => {
    explosion.remove();
  }, 400); // duração da animação
}

circle.addEventListener("click", (event) => {
  if (!gameRunning) return;

  score++;
  scoreDisplay.textContent = `Pontos: ${score}`;
  clickSound.play();

  createExplosion(event.clientX, event.clientY);

  moveCircle();
});


startBtn.addEventListener("click", () => {
  const difficulty = difficultySelect.value;

  switch (difficulty) {
    case "easy":
      moveDelay = 2700;
      break;
    case "medium":
      moveDelay = 1300;
      break;
    case "hard":
      moveDelay = 300;
      break;
  }

  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = "Pontos: 0";
  timerDisplay.textContent = "Tempo: 30s";
  gameRunning = true;

  menuDiv.style.display = "none";
  gameDiv.style.display = "block";

  moveCircle();

  clearInterval(countdown);
  clearTimeout(gameTimer);
  clearInterval(autoMove); 

  autoMove = setInterval(() => {
    if (gameRunning) moveCircle();
  }, moveDelay);

  countdown = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Tempo: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(countdown);
    }
  }, 1000);

  gameTimer = setTimeout(() => {
    gameRunning = false;
    circle.style.display = "none";
    clearInterval(autoMove);
    alert("Tempo esgotado! Pontuação final: " + score);
    saveScore(score);
    showMenu();
  }, 30000);
});

function saveScore(score) {
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push(score);
  ranking.sort((a, b) => b - a);
  ranking = ranking.slice(0, 5);
  localStorage.setItem("ranking", JSON.stringify(ranking));
}

function loadRanking() {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  rankingList.innerHTML = "";
  ranking.forEach((score) => {
    const li = document.createElement("li");
    li.textContent = `${score} pontos`;
    rankingList.appendChild(li);
  });
}

function showMenu() {
  gameDiv.style.display = "none";
  menuDiv.style.display = "block";
  loadRanking();
}

window.onload = showMenu;
