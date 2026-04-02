// Global state
let isCheckedIn = false;
let checkInTime = null;
let checkOutTime = null;
let elapsedSeconds = 0;
let targetHours = 8; // 8 hour workday
let timerInterval = null;

// DOM Elements
const checkInOutBtn = document.getElementById('checkInOutBtn');
const greeting = document.getElementById('greeting');
const hoursDisplay = document.getElementById('hours-display');
const timerInfo = document.getElementById('timer-info');
const progressRing = document.querySelector('.progress-ring-circle');

const circumference = progressRing.r.baseVal.value * 2 * Math.PI;
progressRing.style.strokeDasharray = circumference;
progressRing.style.strokeDashoffset = circumference;

// Set greeting based on time of day
function setGreeting() {
    const hour = new Date().getHours();
    let greetingText = '';
    
    if (hour < 12) {
        greetingText = 'Good Morning';
    } else if (hour < 18) {
        greetingText = 'Good Afternoon';
    } else {
        greetingText = 'Good Night';
    }
    
    greeting.textContent = greetingText + ', User!';
}

// Update progress ring
function updateProgressRing(hours) {
    const progress = Math.min(hours / targetHours, 1);
    const offset = circumference - (progress * circumference);
    progressRing.style.strokeDashoffset = offset;
}

// Format hours to decimal (e.g., 1.5)
function formatHours(seconds) {
    return (seconds / 3600).toFixed(1);
}

// Update timer display
function updateTimerDisplay() {
    const hours = parseFloat(formatHours(elapsedSeconds));
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    
    // Top display: decimal format (3.5)
    hoursDisplay.textContent = hours.toFixed(1);
    
    // Bottom display: time format (3hrs 30mins)
    timerInfo.textContent = `${Math.floor(hours)}hrs ${minutes}mins`;
    
    updateProgressRing(hours);
}

// Start the timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (isCheckedIn) {
            elapsedSeconds++;
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
        // CHECK-IN
        isCheckedIn = true;
        checkInTime = now;
        elapsedSeconds = 0;
        
        checkInOutBtn.textContent = 'Check-Out';
        checkInOutBtn.classList.add('checked-out');
        
        updateTimerDisplay();
        startTimer();
        
        // Show Check-In Alert
        alert(`Checked In!\n\nGood luck for the work! Remember to stay professional at all times\n\nChecked in: ${checkInTime.toLocaleTimeString()}`);
        
        console.log('✓ Checked in at:', now.toLocaleTimeString());
    } else {
        // CHECK-OUT
        isCheckedIn = false;
        checkOutTime = now;
        stopTimer();
        
        checkInOutBtn.textContent = 'Check-In';
        checkInOutBtn.classList.remove('checked-out');
        
        const hoursWorked = formatHours(elapsedSeconds);
        const minutesWorked = Math.floor((elapsedSeconds % 3600) / 60);
        
        alert(`Checked out!\n\nHours worked today: ${hoursWorked}hrs (${Math.floor(parseFloat(hoursWorked))}hrs ${minutesWorked}mins)\n\nChecked in: ${checkInTime.toLocaleTimeString()}\nChecked out: ${checkOutTime.toLocaleTimeString()}`);
        
        console.log('✓ Checked out at:', checkOutTime.toLocaleTimeString());
        console.log('Hours worked:', hoursWorked);
        
        // Reset for next day
        elapsedSeconds = 0;
        updateTimerDisplay();
    }
});

function setGreeting() {
    const hour = new Date().getHours();
    let greetingText = '';
    
    if (hour < 12) {
        greetingText = 'Good Morning, User!';
    } else if (hour < 18) {
        greetingText = 'Good Afternoon, User!';
    } else {
        greetingText = 'Good Evening, User!';
    }
    
    document.getElementById('greeting').textContent = greetingText;
}

// Initialize on page load
window.addEventListener('load', () => {
    setGreeting();
    updateTimerDisplay();
});

