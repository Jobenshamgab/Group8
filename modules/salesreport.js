// Initialize the sales chart
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    // Sample sales data for October
    const salesData = {
        labels: ['Oct 1', 'Oct 5', 'Oct 10', 'Oct 15', 'Oct 20', 'Oct 25', 'Oct 30'],
        datasets: [{
            label: 'Sales (₱)',
            data: [18500, 21000, 19800, 22500, 24100, 23200, 24580],
            backgroundColor: 'rgba(241, 31, 31, 0.5)',
            borderColor: 'rgba(241, 31, 31, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    };
    
    const salesChart = new Chart(ctx, {
        type: 'line',
        data: salesData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `₱${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '₱' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update chart based on selected period
            const period = this.getAttribute('data-period');
            updateChart(period);
        });
    });
    
    // Function to update chart based on selected period
    function updateChart(period) {
        let newData, newLabels;
        
        switch(period) {
            case 'daily':
                newLabels = ['6am', '9am', '12pm', '3pm', '6pm', '9pm'];
                newData = [3200, 4200, 6800, 5200, 7500, 2300];
                salesChart.data.datasets[0].label = 'Hourly Sales (₱)';
                break;
            case 'weekly':
                newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                newData = [82000, 86500, 89200, 91600];
                salesChart.data.datasets[0].label = 'Weekly Sales (₱)';
                break;
            case 'monthly':
                newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
                newData = [720000, 680000, 750000, 710000, 780000, 820000, 850000, 880000, 910000, 930000];
                salesChart.data.datasets[0].label = 'Monthly Sales (₱)';
                break;
            case 'yearly':
                newLabels = ['2020', '2021', '2022', '2023'];
                newData = [6500000, 7200000, 8900000, 9800000];
                salesChart.data.datasets[0].label = 'Yearly Sales (₱)';
                break;
            case 'summary':
                newLabels = ['Dine-in', 'Takeout', 'Delivery', 'Catering'];
                newData = [65, 15, 12, 8];
                salesChart.data.datasets[0].label = 'Sales Distribution (%)';
                salesChart.type = 'doughnut';
                salesChart.data.datasets[0].backgroundColor = [
                    'rgba(241, 31, 31, 0.7)',
                    'rgba(76, 201, 240, 0.7)',
                    'rgba(247, 183, 1, 0.7)',
                    'rgba(108, 117, 125, 0.7)'
                ];
                salesChart.data.datasets[0].borderColor = 'rgba(255, 255, 255, 0.8)';
                salesChart.data.datasets[0].borderWidth = 2;
                break;
        }
        
        if (period !== 'summary') {
            salesChart.type = period === 'daily' ? 'bar' : 'line';
            salesChart.data.datasets[0].backgroundColor = 'rgba(241, 31, 31, 0.5)';
            salesChart.data.datasets[0].borderColor = 'rgba(241, 31, 31, 1)';
            salesChart.data.datasets[0].borderWidth = 2;
            salesChart.data.datasets[0].fill = period !== 'daily';
        }
        
        salesChart.data.labels = newLabels;
        salesChart.data.datasets[0].data = newData;
        salesChart.update();
    }
    
    // Apply date filter
    const applyFilterBtn = document.querySelector('.date-range-selector .btn');
    applyFilterBtn.addEventListener('click', function() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        alert(`Filter applied for dates: ${startDate} to ${endDate}`);
        // In a real app, this would fetch new data from the server
    });
    
    // Export and print buttons
    document.querySelector('.btn-export').addEventListener('click', function() {
        alert('Exporting sales report as CSV...');
    });
    
    document.querySelector('.btn-print').addEventListener('click', function() {
        window.print();
    });
});