// Global state
let isCheckedIn = false;
let checkInTime = null;
let checkOutTime = null;
let totalElapsedSeconds = 0; // Changed: keeps cumulative total
let checkInSessionSeconds = 0; // Changed: just for current session
let targetHours = 8; // 8 hour workday
let timerInterval = null;

// DOM Elements
const checkInOutBtn = document.getElementById('checkInOutBtn');
const greeting = document.getElementById('greeting');
const hoursDisplay = document.getElementById('hours-display');
const timerInfo = document.getElementById('timer-info');
const totalRendered = document.getElementById('total-rendered');

// Set greeting based on time of day
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
    
    greeting.textContent = greetingText;
}

// Format hours to decimal (e.g., 1.5)
function formatHours(seconds) {
    return (seconds / 3600).toFixed(1);
}

// Update timer display
function updateTimerDisplay() {
    const hours = parseFloat(formatHours(totalElapsedSeconds));
    const minutes = Math.floor((totalElapsedSeconds % 3600) / 60);
    
    // Top display: decimal format (3.5)
    hoursDisplay.textContent = hours.toFixed(1);
    
    // Middle display: readable format
    const h = Math.floor(hours);
    totalRendered.textContent = `Total Rendered this shift: ${h} hours and ${minutes} minutes`;
    
    // Bottom display: time format + target
    timerInfo.textContent = `${h}hrs ${minutes}mins / 486 hrs`;
}

// Start the timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (isCheckedIn) {
            // Calculate actual elapsed time from when you checked in
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
        // CHECK-IN
        isCheckedIn = true;
        checkInTime = now;
        checkInSessionSeconds = 0; // Reset session timer only
        
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
        
        const hoursWorked = formatHours(totalElapsedSeconds);
        const minutesWorked = Math.floor((totalElapsedSeconds % 3600) / 60);
        
        alert(`Checked out!\n\nHours worked today: ${hoursWorked}hrs (${Math.floor(parseFloat(hoursWorked))}hrs ${minutesWorked}mins)\n\nChecked in: ${checkInTime.toLocaleTimeString()}\nChecked out: ${checkOutTime.toLocaleTimeString()}`);
        
        console.log('✓ Checked out at:', checkOutTime.toLocaleTimeString());
        console.log('Hours worked:', hoursWorked);
        
        // DON'T reset totalElapsedSeconds here - keep the cumulative total!
        checkInSessionSeconds = 0; // Only reset session timer
    }
});

// Initialize on page load
window.addEventListener('load', () => {
    setGreeting();
    updateTimerDisplay();
});