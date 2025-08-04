// dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the sales chart
    const salesChart = new Chart(document.getElementById('salesChart'), {
        type: 'bar',
        data: {
            labels: ['6am', '9am', '12pm', '3pm', '6pm', '9pm'],
            datasets: [{
                label: 'Sales (₱)',
                data: [3200, 4200, 6800, 5200, 7500, 2300],
                backgroundColor: 'rgba(241, 31, 31, 0.5)',
                borderColor: 'rgba(241, 31, 31, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₱' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Timer functionality for QR code
    let timerInterval;
    let minutes = 30;
    let seconds = 0;
    let isPaused = false;
    
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const pauseBtn = document.querySelector('.btn-pause');
    const resetBtn = document.querySelector('.btn-reset');
    
    function startTimer() {
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    function updateTimer() {
        if (isPaused) return;
        
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timerInterval);
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        
        minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }
    
    function pauseTimer() {
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
    
    function resetTimer() {
        clearInterval(timerInterval);
        minutes = 30;
        seconds = 0;
        minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        secondsDisplay.textContent = seconds.toString().padStart(2, '0');
        isPaused = false;
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        pauseBtn.classList.remove('btn-resume');
        pauseBtn.classList.add('btn-pause');
        startTimer();
    }
    
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    // Start the timer initially
    startTimer();
    
    // Table selection functionality
    const tables = document.querySelectorAll('.table');
    tables.forEach(table => {
        table.addEventListener('click', function() {
            // Remove active class from all tables
            tables.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked table
            this.classList.add('active');
            
            // Update QR info
            const tableNumber = this.textContent;
            document.querySelector('.qr-info h4').textContent = `Table #${tableNumber}`;
        });
    });
    
    // Menu item toggle functionality
    const toggleButtons = document.querySelectorAll('.btn-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const statusElement = menuItem.querySelector('.item-status');
            const isAvailable = statusElement.classList.contains('available');
            
            if (isAvailable) {
                statusElement.classList.remove('available');
                statusElement.classList.add('unavailable');
                statusElement.innerHTML = '<i class="fas fa-times-circle"></i> Unavailable';
                this.innerHTML = '<i class="fas fa-toggle-off"></i>';
            } else {
                statusElement.classList.remove('unavailable');
                statusElement.classList.add('available');
                statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Available';
                this.innerHTML = '<i class="fas fa-toggle-on"></i>';
            }
        });
    });
    
    // Tab switching for sales reports
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // In a real app, this would update the chart data
            // For demo, we'll just update the chart title
            salesChart.options.plugins.title = {
                display: true,
                text: `${this.textContent} Sales Report`
            };
            salesChart.update();
        });
    });
    
    // Calendar navigation
    const calendarHeader = document.querySelector('.calendar-header');
    calendarHeader.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            // This would change the month in a real application
            // For demo, we just show an alert
            const direction = e.target.querySelector('i').classList.contains('fa-chevron-left') ? 'previous' : 'next';
            console.log(`Navigating to ${direction} month`);
        }
    });
    
    // Reservation actions
    const confirmButtons = document.querySelectorAll('.btn-confirm');
    const cancelButtons = document.querySelectorAll('.btn-cancel');
    
    confirmButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reservation = this.closest('.reservation-item');
            reservation.style.opacity = '0.6';
            this.textContent = 'Confirmed';
            this.disabled = true;
            reservation.querySelector('.btn-cancel').style.display = 'none';
        });
    });
    
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reservation = this.closest('.reservation-item');
            reservation.style.opacity = '0.6';
            this.textContent = 'Cancelled';
            this.disabled = true;
            reservation.querySelector('.btn-confirm').style.display = 'none';
        });
    });
});