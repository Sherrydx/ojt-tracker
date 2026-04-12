// Global state
let isCheckedIn = false;
let checkInTime = null;
let checkOutTime = null;
let totalElapsedSeconds = 0;
let checkInSessionSeconds = 0;
let targetHours = 8;
let timerInterval = null;

// DOM Elements
const checkInOutBtn = document.getElementById('checkInOutBtn');
const greeting = document.getElementById('currentDateTime');
const hoursDisplay = document.getElementById('hours-display');
const timerInfo = document.getElementById('timer-info');
const totalRendered = document.getElementById('total-rendered');

// Set current date/time in header
function setDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    greeting.textContent = `Current Date and Time: ${dateStr} ${timeStr}`;
}

// Format hours to decimal (e.g., 1.5)
function formatHours(seconds) {
    return (seconds / 3600).toFixed(1);
}

// Update timer display
function updateTimerDisplay() {
    const hours = parseFloat(formatHours(totalElapsedSeconds));
    const minutes = Math.floor((totalElapsedSeconds % 3600) / 60);

    hoursDisplay.textContent = hours.toFixed(1);

    const h = Math.floor(hours);
    totalRendered.textContent = `${h} hrs and ${minutes} minutes`;

    timerInfo.textContent = `${h}hrs ${minutes}mins / 486 hrs`;
}

// Start the timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (isCheckedIn) {
            const now = new Date();
            totalElapsedSeconds = Math.floor((now - checkInTime) / 1000);
            updateTimerDisplay();
        }
    }, 1000);
}

// Stop the timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Handle Check-In/Check-Out button click
checkInOutBtn.addEventListener('click', () => {
    const now = new Date();

    if (!isCheckedIn) {
        isCheckedIn = true;
        checkInTime = now;
        checkInSessionSeconds = 0;

        checkInOutBtn.textContent = 'Check Out';
        checkInOutBtn.classList.add('checked-out');

        updateTimerDisplay();
        startTimer();

        alert(`Checked In!\n\nGood luck for the work! Remember to stay professional at all times\n\nChecked in: ${checkInTime.toLocaleTimeString()}`);
        console.log('✓ Checked in at:', now.toLocaleTimeString());
    } else {
        isCheckedIn = false;
        checkOutTime = now;
        stopTimer();

        checkInOutBtn.textContent = 'Check In';
        checkInOutBtn.classList.remove('checked-out');

        const hoursWorked = formatHours(totalElapsedSeconds);
        const minutesWorked = Math.floor((totalElapsedSeconds % 3600) / 60);

        alert(`Checked out!\n\nHours worked today: ${hoursWorked}hrs (${Math.floor(parseFloat(hoursWorked))}hrs ${minutesWorked}mins)\n\nChecked in: ${checkInTime.toLocaleTimeString()}\nChecked out: ${checkOutTime.toLocaleTimeString()}`);
        console.log('✓ Checked out at:', checkOutTime.toLocaleTimeString());
        console.log('Hours worked:', hoursWorked);

        checkInSessionSeconds = 0;
    }
});

// ===== THEME TOGGLE =====
const themeToggleBtn = document.getElementById('themeToggle');

function applyTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark');
        themeToggleBtn.textContent = '☀️';
    } else {
        document.body.classList.remove('dark');
        themeToggleBtn.textContent = '🌙';
    }
}

// Load saved preference
const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme === 'dark');

themeToggleBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Initialize on page load
window.addEventListener('load', () => {
    setDateTime();
    updateTimerDisplay();
    // Update date/time every minute
    setInterval(setDateTime, 60000);
});