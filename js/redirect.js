document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const countdownElement = document.getElementById('countdown');
    const destinationUrlElement = document.getElementById('destination-url').querySelector('span');
    const proceedBtn = document.getElementById('proceed-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const progressBar = document.getElementById('progress-bar');
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const shortCode = urlParams.get('code');
    
    // Load database
    const urlDatabase = JSON.parse(localStorage.getItem('urlDatabase')) || {};
    
    if (!shortCode || !urlDatabase[shortCode]) {
        // Invalid or missing short code
        window.location.href = '/';
        return;
    }
    
    const redirectData = urlDatabase[shortCode];
    const destinationUrl = redirectData.originalUrl;
    
    // Update UI with destination URL
    destinationUrlElement.textContent = destinationUrl;
    proceedBtn.href = destinationUrl;
    
    // Start countdown
    let countdown = 5;
    countdownElement.textContent = countdown;
    
    const timer = setInterval(function() {
        countdown--;
        countdownElement.textContent = countdown;
        
        // Update progress bar
        const progressPercent = (countdown / 5) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        if (countdown <= 0) {
            clearInterval(timer);
            redirectNow();
        }
    }, 1000);
    
    // Proceed button click
    proceedBtn.addEventListener('click', function(e) {
        e.preventDefault();
        clearInterval(timer);
        redirectNow();
    });
    
    // Cancel button click
    cancelBtn.addEventListener('click', function(e) {
        e.preventDefault();
        clearInterval(timer);
        window.location.href = '/';
    });
    
    // Track click (only first time)
    if (!redirectData.redirected) {
        redirectData.clicks++;
        redirectData.redirected = true;
        localStorage.setItem('urlDatabase', JSON.stringify(urlDatabase));
    }
    
    function redirectNow() {
        window.location.href = destinationUrl;
    }
    
    // Add click event to destination URL display
    destinationUrlElement.parentElement.addEventListener('click', function() {
        const range = document.createRange();
        range.selectNode(destinationUrlElement);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        
        // Show copied feedback
        const originalText = destinationUrlElement.textContent;
        destinationUrlElement.textContent = 'Copied to clipboard!';
        
        setTimeout(function() {
            destinationUrlElement.textContent = originalText;
        }, 1000);
    });
});