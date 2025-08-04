// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Current date and calendar
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Sample reservations data
    const reservations = {
        '2023-10-15': [
            { id: 1, time: '12:30 PM', table: 'Table #04', name: 'Maria Santos', 
              details: 'Party of 4 - Birthday', contact: '09123456789', 
              status: 'pending', special: 'Birthday cake preparation', image: null },
            { id: 2, time: '2:00 PM', table: 'Table #08', name: 'John Dela Cruz', 
              details: 'Party of 2 - Anniversary', contact: '09987654321', 
              status: 'pending', special: 'Flower arrangement', image: null }
        ],
        '2023-10-17': [
            { id: 3, time: '6:45 PM', table: 'Hall #2', name: 'ABC Corporation', 
              details: 'Company Event - 50 people', contact: 'admin@abccorp.com', 
              status: 'confirmed', special: 'Projector setup needed', image: null }
        ],
        '2023-10-22': [
            { id: 4, time: '7:30 PM', table: 'VIP Room', name: 'Robert Lim', 
              details: 'Family Dinner - 8 people', contact: '09223344556', 
              status: 'pending', special: 'Vegetarian options required', image: null }
        ],
        '2023-10-25': [
            { id: 5, time: '1:00 PM', table: 'Table #03', name: 'Sarah Johnson', 
              details: 'Business Lunch - 4 people', contact: 'sarahj@example.com', 
              status: 'confirmed', special: 'Quiet area preferred', image: null },
            { id: 6, time: '8:00 PM', table: 'Table #10', name: 'Michael Tan', 
              details: 'Date Night - 2 people', contact: '09112233445', 
              status: 'pending', special: 'Romantic table setup', image: null }
        ]
    };
    
    // Sample menu data
    const menuItems = [
        { id: 1, name: "Adobong Manok", 
          description: "Classic chicken adobo with soy sauce, vinegar, and garlic", 
          price: "₱220", available: true },
        { id: 2, name: "Sinigang na Baboy", 
          description: "Pork sour soup with vegetables and tamarind broth", 
          price: "₱280", available: true },
        { id: 3, name: "Lechon Kawali", 
          description: "Crispy fried pork belly served with liver sauce", 
          price: "₱320", available: false },
        { id: 4, name: "Kare-Kare", 
          description: "Oxtail and vegetable stew in peanut sauce", 
          price: "₱350", available: true },
        { id: 5, name: "Halo-Halo Special", 
          description: "Traditional Filipino dessert with mixed fruits, beans, and ice cream", 
          price: "₱150", available: true },
        { id: 6, name: "Crispy Pata", 
          description: "Deep-fried pork knuckle served with soy-vinegar dip", 
          price: "₱420", available: false }
    ];
    
    // Image upload variables
    let currentReservation = null;
    let uploadedImage = null;
    
    // Initialize calendar
    function renderCalendar(month, year) {
        const calendarGrid = document.getElementById('calendar-grid');
        const monthNames = ["January", "February", "March", "April", "May", "June",
                           "July", "August", "September", "October", "November", "December"];
        
        // Set current month header
        document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
        
        // Clear existing calendar
        calendarGrid.innerHTML = '';
        
        // Add day names
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'day-name';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });
        
        // Get first day of month
        const firstDay = new Date(year, month, 1).getDay();
        
        // Get days in month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before the first day
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day empty';
            calendarGrid.appendChild(emptyCell);
        }
        
        // Add days of the month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;
            
            // Check if today
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElement.classList.add('selected');
            }
            
            // Check if has reservations
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (reservations[dateStr]) {
                dayElement.classList.add('reserved');
                dayElement.classList.add('reserved-count');
                dayElement.setAttribute('data-count', reservations[dateStr].length);
            }
            
            // Add click event
            dayElement.addEventListener('click', () => {
                // Remove selected class from all days
                document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
                
                // Add selected class to clicked day
                dayElement.classList.add('selected');
                
                // Show reservations for this day
                showReservations(dateStr);
            });
            
            calendarGrid.appendChild(dayElement);
        }
        
        // Show today's reservations by default
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        showReservations(todayStr);
    }
    
    // Show reservations for a specific date
    function showReservations(dateStr) {
        const reservationItems = document.getElementById('reservation-items');
        const selectedDateElement = document.getElementById('selected-date');
        
        // Format date for display
        const date = new Date(dateStr);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        selectedDateElement.textContent = date.toLocaleDateString('en-US', options);
        
        // Clear existing reservations
        reservationItems.innerHTML = '';
        
        // Check if there are reservations for this date
        if (reservations[dateStr]) {
            reservations[dateStr].forEach(reservation => {
                const reservationElement = document.createElement('div');
                reservationElement.className = `reservation-item ${reservation.status === 'confirmed' ? 'confirmed' : reservation.status === 'cancelled' ? 'cancelled' : ''}`;
                
                // Add image preview if exists
                const imagePreview = reservation.image ? 
                    `<div class="reservation-image">
                        <img src="${reservation.image}" alt="Reservation image">
                     </div>` : '';
                
                reservationElement.innerHTML = `
                    <div class="reservation-time">
                        <span>${reservation.time}</span>
                        <span>${reservation.table}</span>
                    </div>
                    <div class="reservation-details">
                        <h5>${reservation.name}</h5>
                        <p>${reservation.details}</p>
                        <div class="contact-info">
                            <span><i class="fas fa-phone"></i> ${reservation.contact}</span>
                            <span><i class="fas fa-info-circle"></i> ${reservation.special}</span>
                        </div>
                        ${imagePreview}
                    </div>
                    <div class="reservation-actions">
                        ${reservation.status === 'pending' ? `
                            <button class="btn btn-confirm" data-id="${reservation.id}">
                                <i class="fas fa-check"></i> Confirm
                            </button>
                            <button class="btn btn-edit upload-image-btn" data-id="${reservation.id}" data-date="${dateStr}">
                                <i class="fas fa-image"></i> Image
                            </button>
                            <button class="btn btn-edit" data-id="${reservation.id}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-cancel" data-id="${reservation.id}">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        ` : ''}
                        ${reservation.status === 'confirmed' ? `
                            <span class="badge" style="background: var(--success); color: white;">Confirmed</span>
                            <button class="btn btn-edit upload-image-btn" data-id="${reservation.id}" data-date="${dateStr}">
                                <i class="fas fa-image"></i> Image
                            </button>
                        ` : ''}
                        ${reservation.status === 'cancelled' ? `
                            <span class="badge" style="background: var(--danger); color: white;">Cancelled</span>
                        ` : ''}
                    </div>
                `;
                
                reservationItems.appendChild(reservationElement);
            });
        } else {
            reservationItems.innerHTML = `
                <div class="no-reservations">
                    <p>No reservations for this date</p>
                </div>
            `;
        }
        
        // Add event listeners to action buttons
        document.querySelectorAll('.btn-confirm').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                confirmReservation(dateStr, id);
            });
        });
        
        document.querySelectorAll('.btn-cancel').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                cancelReservation(dateStr, id);
            });
        });
        
        // Add event listeners to image upload buttons
        document.querySelectorAll('.upload-image-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const date = this.getAttribute('data-date');
                openImageUploadModal(date, id);
            });
        });
    }
    
    // Open image upload modal
    function openImageUploadModal(date, id) {
        const reservation = reservations[date].find(r => r.id == id);
        if (reservation) {
            currentReservation = reservation;
            const modal = document.getElementById('image-modal');
            const previewImg = document.getElementById('preview-img');
            const previewPlaceholder = document.querySelector('.image-preview-placeholder');
            
            // Show existing image if available
            if (reservation.image) {
                previewImg.src = reservation.image;
                previewImg.style.display = 'block';
                previewPlaceholder.style.display = 'none';
            } else {
                previewImg.style.display = 'none';
                previewPlaceholder.style.display = 'block';
            }
            
            modal.style.display = 'flex';
        }
    }
    
    // Confirm reservation
    function confirmReservation(dateStr, id) {
        const reservation = reservations[dateStr].find(r => r.id == id);
        if (reservation) {
            reservation.status = 'confirmed';
            showReservations(dateStr);
        }
    }
    
    // Cancel reservation
    function cancelReservation(dateStr, id) {
        const reservation = reservations[dateStr].find(r => r.id == id);
        if (reservation) {
            reservation.status = 'cancelled';
            showReservations(dateStr);
        }
    }
    
    // Render menu items
    function renderMenuItems() {
        const menuItemsContainer = document.getElementById('menu-items');
        menuItemsContainer.innerHTML = '';
        
        menuItems.forEach(item => {
            const menuItemElement = document.createElement('div');
            menuItemElement.className = 'menu-item';
            
            menuItemElement.innerHTML = `
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <div class="price">${item.price}</div>
                </div>
                <div class="toggle-container">
                    <span class="toggle-label">Availability:</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${item.available ? 'checked' : ''} data-id="${item.id}">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="item-status ${item.available ? 'available' : 'unavailable'}">
                    <i class="fas ${item.available ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    ${item.available ? 'Available' : 'Unavailable'}
                </div>
            `;
            
            menuItemsContainer.appendChild(menuItemElement);
        });
        
        // Add event listeners to toggle switches
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', function() {
                const id = this.getAttribute('data-id');
                const menuItem = menuItems.find(item => item.id == id);
                if (menuItem) {
                    menuItem.available = this.checked;
                    renderMenuItems();
                }
            });
        });
    }
    
    // Navigation between months
    document.getElementById('prev-month').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    // Image upload functionality
    document.getElementById('image-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const previewImg = document.getElementById('preview-img');
                const previewPlaceholder = document.querySelector('.image-preview-placeholder');
                
                previewImg.src = event.target.result;
                previewImg.style.display = 'block';
                previewPlaceholder.style.display = 'none';
                
                uploadedImage = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Save uploaded image
    document.getElementById('save-image').addEventListener('click', function() {
        if (currentReservation && uploadedImage) {
            currentReservation.image = uploadedImage;
            showReservations(Object.keys(reservations).find(date => 
                reservations[date].includes(currentReservation)
            ));
        }
        closeImageModal();
    });
    
    // Close modal functions
    document.querySelector('.close-modal').addEventListener('click', closeImageModal);
    document.getElementById('cancel-upload').addEventListener('click', closeImageModal);
    document.getElementById('image-modal').addEventListener('click', function(e) {
        if (e.target === this) closeImageModal();
    });
    
    function closeImageModal() {
        document.getElementById('image-modal').style.display = 'none';
        uploadedImage = null;
        currentReservation = null;
        document.getElementById('image-upload').value = '';
    }
    
    // New reservation button
    document.getElementById('new-reservation-btn').addEventListener('click', function() {
        alert('New reservation functionality would open a form here. Image upload would be part of that form.');
    });
    
    // Initialize the page
    renderCalendar(currentMonth, currentYear);
    renderMenuItems();
});