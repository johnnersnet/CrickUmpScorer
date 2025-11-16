let runs = 0;
let balls = 0;
let wickets = 0;

// Load saved state from localStorage
if (localStorage.getItem('scoreData')) {
  const saved = JSON.parse(localStorage.getItem('scoreData'));
  runs = saved.runs;
  balls = saved.balls;
  wickets = saved.wickets;
}

function updateDisplay() {
  document.getElementById('runs').textContent = runs;
  document.getElementById('overs').textContent = `${Math.floor(balls / 6)}.${balls % 6}`;
  document.getElementById('wickets').textContent = wickets;

  // Save state to localStorage
  localStorage.setItem('scoreData', JSON.stringify({ runs, balls, wickets }));
}

function addRun(value) {
  runs = Math.max(0, runs + value);
  updateDisplay();
}

function addBall(value) {
  balls = Math.max(0, balls + value);
  updateDisplay();
}

function addWicket(value) {
  wickets = Math.max(0, wickets + value);
  updateDisplay();
}

function reset() {
  runs = 0;
  balls = 0;
  wickets = 0;
  updateDisplay();
}

updateDisplay();