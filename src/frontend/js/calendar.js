
function getPhilippinesHolidays(year) {
    const holidays = {};
    
    // Fixed holidays (same date every year)
    holidays[`${year}-01-01`] = 'New Year\'s Day';
    holidays[`${year}-02-10`] = 'EDSA Revolution';
    holidays[`${year}-02-25`] = 'EDSA Revolution';
    holidays[`${year}-04-09`] = 'Araw ng Kagitingan';
    holidays[`${year}-05-01`] = 'Labor Day';
    holidays[`${year}-06-12`] = 'Independence Day';
    holidays[`${year}-08-21`] = 'Ninoy Aquino Day';
    holidays[`${year}-11-01`] = 'All Saints\' Day';
    holidays[`${year}-11-30`] = 'Bonifacio Day';
    holidays[`${year}-12-08`] = 'Feast of Immaculate Conception';
    holidays[`${year}-12-25`] = 'Christmas Day';
    holidays[`${year}-12-30`] = 'Rizal Day';
    holidays[`${year}-12-31`] = 'New Year\'s Eve';
    
    // Easter calculation (Computus algorithm)
    const easterDate = calculateEaster(year);
    
    // Easter-based holidays (relative to Easter)
    const holyThursday = new Date(easterDate);
    holyThursday.setDate(holyThursday.getDate() - 3);
    holidays[formatDate(holyThursday.getFullYear(), holyThursday.getMonth(), holyThursday.getDate())] = 'Holy Thursday';
    
    const goodFriday = new Date(easterDate);
    goodFriday.setDate(goodFriday.getDate() - 2);
    holidays[formatDate(goodFriday.getFullYear(), goodFriday.getMonth(), goodFriday.getDate())] = 'Good Friday';
    
    const blackSaturday = new Date(easterDate);
    blackSaturday.setDate(blackSaturday.getDate() - 1);
    holidays[formatDate(blackSaturday.getFullYear(), blackSaturday.getMonth(), blackSaturday.getDate())] = 'Black Saturday';
    
    const easterSunday = new Date(easterDate);
    holidays[formatDate(easterSunday.getFullYear(), easterSunday.getMonth(), easterSunday.getDate())] = 'Easter Sunday';
    
    return holidays;
}

// Computus algorithm to calculate Easter Sunday
function calculateEaster(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

// Helper to format date (reuse existing one)
function formatDateHelper(year, month, day) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
}

// Calendar Notes Storage (in localStorage)
let calendarNotes = JSON.parse(localStorage.getItem('calendarNotes')) || {};

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const monthYear = document.getElementById('monthYear');
const calendarDays = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const noteModal = document.getElementById('noteModal');
const closeModal = document.querySelector('.close');
const saveNoteBtn = document.getElementById('saveNote');
const deleteNoteBtn = document.getElementById('deleteNote');
const noteText = document.getElementById('noteText');
const modalDate = document.getElementById('modalDate');

let selectedDate = null;

// Render Calendar
function renderCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // Get holidays for current year
    const currentYearHolidays = getPhilippinesHolidays(currentYear);
    
    // Update header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Clear calendar
    calendarDays.innerHTML = '';
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayEl = createDayElement(day, true, null);
        calendarDays.appendChild(dayEl);
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDate(currentYear, currentMonth, day);
        const isToday = isDateToday(currentYear, currentMonth, day);
        const dayEl = createDayElement(day, false, dateStr, isToday, currentYearHolidays);
        calendarDays.appendChild(dayEl);
    }
    
    // Next month days
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        const dayEl = createDayElement(day, true, null);
        calendarDays.appendChild(dayEl);
    }
}

function createDayElement(day, isOtherMonth, dateStr, isToday = false, holidays = {}) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    dayEl.textContent = day;
    
    if (isOtherMonth) {
        dayEl.classList.add('other-month');
        return dayEl;
    }
    
    if (isToday) {
        dayEl.classList.add('today');
    }
    
    // Check if holiday
    if (holidays[dateStr]) {
        dayEl.classList.add('holiday');
        dayEl.title = holidays[dateStr];
    }
    
    // Check if has note
    if (calendarNotes[dateStr]) {
        dayEl.classList.add('has-note');
    }
    
    dayEl.addEventListener('click', () => openNoteModal(dateStr, day));
    
    return dayEl;
}

function formatDate(year, month, day) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
}

function isDateToday(year, month, day) {
    const today = new Date();
    return year === today.getFullYear() && 
           month === today.getMonth() && 
           day === today.getDate();
}

function openNoteModal(dateStr, day) {
    selectedDate = dateStr;
    const date = new Date(dateStr);
    modalDate.textContent = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    noteText.value = calendarNotes[dateStr] || '';
    
    // Show/hide delete button
    if (calendarNotes[dateStr]) {
        deleteNoteBtn.style.display = 'inline-block';
    } else {
        deleteNoteBtn.style.display = 'none';
    }
    
    noteModal.classList.add('show');
}

function closeNoteModalFunc() {
    noteModal.classList.remove('show');
    selectedDate = null;
}

function saveNote() {
    if (selectedDate && noteText.value.trim()) {
        calendarNotes[selectedDate] = noteText.value;
        localStorage.setItem('calendarNotes', JSON.stringify(calendarNotes));
        closeNoteModalFunc();
        renderCalendar();
    }
}

function deleteNote() {
    if (selectedDate) {
        delete calendarNotes[selectedDate];
        localStorage.setItem('calendarNotes', JSON.stringify(calendarNotes));
        closeNoteModalFunc();
        renderCalendar();
    }
}

// Event Listeners
prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

closeModal.addEventListener('click', closeNoteModalFunc);
saveNoteBtn.addEventListener('click', saveNote);
deleteNoteBtn.addEventListener('click', deleteNote);

noteModal.addEventListener('click', (e) => {
    if (e.target === noteModal) {
        closeNoteModalFunc();
    }
});

// Initialize calendar on page load
window.addEventListener('load', () => {
    renderCalendar();
});