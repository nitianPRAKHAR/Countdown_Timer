document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const eventNameInput = document.getElementById('eventName');
    const targetDateInput = document.getElementById('targetDate');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const daysDisplay = document.getElementById('days');
    const hoursDisplay = document.getElementById('hours');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const displayEventName = document.getElementById('displayEventName');
    const targetDateDisplay = document.getElementById('targetDateDisplay');
    const presetButtons = document.querySelectorAll('.preset');
    const alarmSound = document.getElementById('alarmSound');
    
    // Variables
    let countdownInterval;
    let targetDate;
    
    // Initialize the datetime-local input with current datetime
    function initializeDateTimeInput() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        targetDateInput.min = minDateTime;
        targetDateInput.value = minDateTime;
    }
    
    // Format date for display
    function formatDateForDisplay(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Update the countdown display
    function updateCountdown() {
        const now = new Date();
        const difference = targetDate - now;
        
        if (difference <= 0) {
            clearInterval(countdownInterval);
            daysDisplay.textContent = '00';
            hoursDisplay.textContent = '00';
            minutesDisplay.textContent = '00';
            secondsDisplay.textContent = '00';
            
            // Play alarm sound
            alarmSound.play();
            
            // Change button text
            startBtn.innerHTML = '<i class="fas fa-check"></i> Completed';
            startBtn.style.backgroundColor = '#4CAF50';
            
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        daysDisplay.textContent = String(days).padStart(2, '0');
        hoursDisplay.textContent = String(hours).padStart(2, '0');
        minutesDisplay.textContent = String(minutes).padStart(2, '0');
        secondsDisplay.textContent = String(seconds).padStart(2, '0');
    }
    
    // Start the countdown
    function startCountdown() {
        const eventName = eventNameInput.value.trim();
        const dateTimeValue = targetDateInput.value;
        
        if (!eventName) {
            alert('Please enter an event name');
            return;
        }
        
        if (!dateTimeValue) {
            alert('Please select a target date and time');
            return;
        }
        
        targetDate = new Date(dateTimeValue);
        
        if (targetDate <= new Date()) {
            alert('Please select a future date and time');
            return;
        }
        
        // Update event info display
        displayEventName.textContent = eventName;
        targetDateDisplay.textContent = formatDateForDisplay(targetDate);
        
        // Start the countdown
        clearInterval(countdownInterval);
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
        
        // Update button state
        startBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Running';
        startBtn.style.backgroundColor = '#FF9800';
    }
    
    // Reset the countdown
    function resetCountdown() {
        clearInterval(countdownInterval);
        
        // Reset displays
        daysDisplay.textContent = '00';
        hoursDisplay.textContent = '00';
        minutesDisplay.textContent = '00';
        secondsDisplay.textContent = '00';
        
        displayEventName.textContent = 'No event set';
        targetDateDisplay.textContent = '';
        
        // Reset button state
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        startBtn.style.backgroundColor = '#4a6cf7';
        
        // Stop alarm if playing
        alarmSound.pause();
        alarmSound.currentTime = 0;
        
        // Re-initialize the datetime input
        initializeDateTimeInput();
    }
    
    // Set preset time
    function setPresetTime(minutes = 0, hours = 0, days = 0) {
        const now = new Date();
        const presetDate = new Date(now);
        
        presetDate.setMinutes(presetDate.getMinutes() + minutes);
        presetDate.setHours(presetDate.getHours() + hours);
        presetDate.setDate(presetDate.getDate() + days);
        
        // Format for datetime-local input
        const year = presetDate.getFullYear();
        const month = String(presetDate.getMonth() + 1).padStart(2, '0');
        const day = String(presetDate.getDate()).padStart(2, '0');
        const hoursStr = String(presetDate.getHours()).padStart(2, '0');
        const minutesStr = String(presetDate.getMinutes()).padStart(2, '0');
        
        targetDateInput.value = `${year}-${month}-${day}T${hoursStr}:${minutesStr}`;
        
        // Auto-fill event name if empty
        if (!eventNameInput.value.trim()) {
            if (days > 0) {
                eventNameInput.value = `${days} Day${days > 1 ? 's' : ''} Countdown`;
            } else if (hours > 0) {
                eventNameInput.value = `${hours} Hour${hours > 1 ? 's' : ''} Countdown`;
            } else if (minutes > 0) {
                eventNameInput.value = `${minutes} Minute${minutes > 1 ? 's' : ''} Countdown`;
            }
        }
    }
    
    // Event Listeners
    startBtn.addEventListener('click', startCountdown);
    resetBtn.addEventListener('click', resetCountdown);
    
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const minutes = parseInt(this.dataset.minutes) || 0;
            const hours = parseInt(this.dataset.hours) || 0;
            const days = parseInt(this.dataset.days) || 0;
            setPresetTime(minutes, hours, days);
        });
    });
    
    // Initialize the app
    initializeDateTimeInput();
});