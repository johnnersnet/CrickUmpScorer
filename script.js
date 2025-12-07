let runs = 0;
let balls = 0;
let wickets = 0;
let wicketDetails = [];
let counters = { one: 0, four: 0, six: 0, dot: 0 };

// Load saved state from localStorage
if (localStorage.getItem('scoreData')) {
  const saved = JSON.parse(localStorage.getItem('scoreData'));
  runs = saved.runs || 0;
  balls = saved.balls || 0;
  wickets = saved.wickets || 0;
  wicketDetails = saved.wicketDetails || [];
  counters = saved.counters || { one: 0, four: 0, six: 0, dot: 0 };
}

function updateDisplay() {
  document.getElementById('runs').textContent = runs;
  document.getElementById('overs').textContent = `${Math.floor(balls / 6)}.${balls % 6}`;
  // Run rate = runs per over (overs = balls / 6). Show two decimals.
  const oversFloat = balls / 6;
  const runRate = oversFloat === 0 ? 0 : runs / oversFloat;
  document.getElementById('runrate').textContent = runRate.toFixed(2);
  document.getElementById('wickets').textContent = wickets;

  // Render wicket details under wicket buttons as "runs/order" list
  const wl = document.getElementById('wicket-list');
  if (wl) {
    if (wicketDetails.length === 0) {
      wl.textContent = '';
    } else {
      wl.textContent = wicketDetails.join(', ');
    }
  }

  // Update counters display if present
  const c1 = document.getElementById('cnt-1'); if (c1) c1.textContent = counters.one || 0;
  const c4 = document.getElementById('cnt-four'); if (c4) c4.textContent = counters.four || 0;
  const c6 = document.getElementById('cnt-six'); if (c6) c6.textContent = counters.six || 0;
  const cd = document.getElementById('cnt-dot'); if (cd) cd.textContent = counters.dot || 0;

  // Save state to localStorage (include wicket details and counters)
  localStorage.setItem('scoreData', JSON.stringify({ runs, balls, wickets, wicketDetails, counters }));
}

function addRun(value, countBall = false) {
  // Negative values only adjust runs and do not count as a ball
  debug(`addRun called value=${value} countBall=${countBall}`);
  if (value < 0) {
    runs = Math.max(0, runs + value);
  } else {
    runs = runs + value;
    if (countBall) {
      balls = Math.max(0, balls + 1);
    }
  }
  updateDisplay();
}

// Wrapper handlers for buttons that also update counters
function pressOne() {
  // '1' button: adds 1 run and counts as a ball; increment one counter
  debug('pressOne');
  addRun(1, true);
  counters.one = (counters.one || 0) + 1;
  updateDisplay();
}

// Debug helper: show last action in a visible debug area
function debug(msg) {
  const el = document.getElementById('debug');
  if (el) el.textContent = msg;
}

function pressPlusOne() {
  // '+1' button: adds 1 run but does NOT count as a ball
  debug('pressPlusOne');
  addRun(1, false);
}

function pressTwo() { addRun(2, true); }
function pressThree() { addRun(3, true); }

function pressFour() {
  debug('pressFour');
  addRun(4, true);
  counters.four = (counters.four || 0) + 1;
  updateDisplay();
}

function pressSix() {
  debug('pressSix');
  addRun(6, true);
  counters.six = (counters.six || 0) + 1;
  updateDisplay();
}

function pressDot() {
  // Dot: counts as a ball but no runs
  debug('pressDot');
  addRun(0, true);
  counters.dot = (counters.dot || 0) + 1;
  updateDisplay();
}

function addWicket(value) {
  // Keep wickets within 0..10 (max 10 wickets)
  const newWickets = Math.max(0, Math.min(10, wickets + value));
  // If adding a wicket, record the runs at that moment as runs/order
  if (value > 0 && newWickets > wickets) {
    const order = newWickets; // e.g., 1 for first wicket
    wicketDetails.push(`${runs}/${order}`);
  }
  // If removing a wicket, remove the last recorded detail
  if (value < 0 && newWickets < wickets) {
    wicketDetails.pop();
  }
  wickets = newWickets;
  updateDisplay();
}

function reset() {
  runs = 0;
  balls = 0;
  wickets = 0;
  wicketDetails = [];
  updateDisplay();
}

function resetConfirm() {
  if (confirm('Reset scores? This will clear runs, balls, and wickets.')) {
    reset();
  }
}

updateDisplay();