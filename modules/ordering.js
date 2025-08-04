// Timer functionality
let timerInterval;
let minutes = 30;
let seconds = 0;
let isPaused = false;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const customerMinutes = document.getElementById('customer-minutes');
const customerSeconds = document.getElementById('customer-seconds');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const generateBtn = document.getElementById('generateBtn');
const qrDiv = document.getElementById('qrcode');

// Initialize QR code
function generateQRCode(tableNumber) {
    // Clear previous QR code
    qrDiv.innerHTML = '';
    
    // Generate new QR code
    const qr = new QRCode(qrDiv, {
        text: `https://wanam-ordering.com/table/${tableNumber}?ts=${Date.now()}`,
        width: 180,
        height: 180,
        colorDark: "#f11f1f",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Update QR info
    document.querySelector('.qr-info h4').textContent = `Table #${tableNumber}`;
}

// Start the timer
function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

// Update timer display
function updateTimer() {
    if (isPaused) return;
    
    if (seconds === 0) {
        if (minutes === 0) {
            clearInterval(timerInterval);
            // Timer expired logic
            alert('QR code has expired! Please generate a new one.');
            return;
        }
        minutes--;
        seconds = 59;
    } else {
        seconds--;
    }
    
    // Update displays
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    customerMinutes.textContent = minutes.toString().padStart(2, '0');
    customerSeconds.textContent = seconds.toString().padStart(2, '0');
}

// Pause/resume timer
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        pauseBtn.classList.remove('btn-pause');
        pauseBtn.classList.add('btn-resume');
    } else {
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        pauseBtn.classList.remove('btn-resume');
        pauseBtn.classList.add('btn-pause');
    }
}

// Reset timer
function resetTimer() {
    clearInterval(timerInterval);
    minutes = 30;
    seconds = 0;
    updateDisplay();
    isPaused = false;
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    pauseBtn.classList.remove('btn-resume');
    pauseBtn.classList.add('btn-pause');
    startTimer();
}

// Update display
function updateDisplay() {
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    customerMinutes.textContent = minutes.toString().padStart(2, '0');
    customerSeconds.textContent = seconds.toString().padStart(2, '0');
}

// Generate new QR code
function generateNewQR() {
    const activeTable = document.querySelector('.table.active');
    if (activeTable) {
        const tableNumber = activeTable.getAttribute('data-table');
        generateQRCode(tableNumber);
        resetTimer();
    } else {
        alert('Please select a table first');
    }
}

// Table selection
function setupTableSelection() {
    const tables = document.querySelectorAll('.table:not(.occupied)');
    tables.forEach(table => {
        table.addEventListener('click', function() {
            // Skip occupied tables
            if (this.classList.contains('occupied')) return;
            
            // Remove active class from all tables
            tables.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked table
            this.classList.add('active');
            
            // Update QR code and info
            const tableNumber = this.querySelector('.table-number').textContent;
            generateQRCode(tableNumber);
            resetTimer();
        });
    });
}

// Initialize the module
function initOrderingModule() {
    // Generate initial QR code for active table
    generateQRCode('05');
    
    // Start the timer
    startTimer();
    
    // Set up event listeners
    pauseBtn.addEventListener('click', togglePause);
    resetBtn.addEventListener('click', resetTimer);
    generateBtn.addEventListener('click', generateNewQR);
    
    // Set up table selection
    setupTableSelection();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initOrderingModule);