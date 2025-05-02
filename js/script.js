document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const urlForm = document.getElementById('url-form');
    const originalUrlInput = document.getElementById('original-url');
    const shortenBtn = document.getElementById('shorten-btn');
    const resultSection = document.getElementById('result-section');
    const shortUrlInput = document.getElementById('short-url');
    const copyBtn = document.getElementById('copy-btn');
    const testBtn = document.getElementById('test-btn');
    const newLinkBtn = document.getElementById('new-link-btn');
    const clickCountElement = document.getElementById('click-count');
    const charCountElement = document.getElementById('char-count');
    const qrCodeContainer = document.getElementById('qr-code');
    const downloadQrBtn = document.getElementById('download-qr');
    
    // In-memory storage (replace with database in production)
    const urlDatabase = {};
    let currentShortCode = '';
    
    // Character counter for URL input
    originalUrlInput.addEventListener('input', function() {
        charCountElement.textContent = this.value.length;
    });
    
    // Shorten URL
    shortenBtn.addEventListener('click', function() {
        const originalUrl = originalUrlInput.value.trim();
        
        if (!isValidUrl(originalUrl)) {
            showAlert('Please enter a valid URL (e.g., https://example.com)', 'danger');
            return;
        }
        
        // Generate short code
        const shortCode = generateShortCode();
        currentShortCode = shortCode;
        
        // Create full short URL
        const shortUrl = `${window.location.origin}/redirect.html?code=${shortCode}`;
        
        // Store in database
        urlDatabase[shortCode] = {
            originalUrl: addHttpPrefix(originalUrl),
            clicks: 0,
            createdAt: new Date(),
            qrCodeData: shortUrl
        };
        
        // Save to localStorage (for demo purposes)
        localStorage.setItem('urlDatabase', JSON.stringify(urlDatabase));
        
        // Display result
        shortUrlInput.value = shortUrl;
        clickCountElement.textContent = '0';
        
        // Generate QR Code
        generateQRCode(shortUrl, qrCodeContainer);
        
        // Show result section
        urlForm.style.display = 'none';
        resultSection.style.display = 'block';
    });
    
    // Copy short URL
    copyBtn.addEventListener('click', function() {
        shortUrlInput.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.classList.add('btn-success');
        
        setTimeout(function() {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('btn-success');
        }, 2000);
    });
    
    // Test link
    testBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentShortCode && urlDatabase[currentShortCode]) {
            // Increment click count
            urlDatabase[currentShortCode].clicks++;
            clickCountElement.textContent = urlDatabase[currentShortCode].clicks;
            localStorage.setItem('urlDatabase', JSON.stringify(urlDatabase));
            
            // Open in new tab
            window.open(`/redirect.html?code=${currentShortCode}`, '_blank');
        }
    });
    
    // Create new link
    newLinkBtn.addEventListener('click', function() {
        originalUrlInput.value = '';
        charCountElement.textContent = '0';
        resultSection.style.display = 'none';
        urlForm.style.display = 'block';
        originalUrlInput.focus();
    });
    
    // Download QR Code
    downloadQrBtn.addEventListener('click', function() {
        if (!currentShortCode || !urlDatabase[currentShortCode]) return;
        
        const canvas = qrCodeContainer.querySelector('canvas');
        if (!canvas) return;
        
        const link = document.createElement('a');
        link.download = `qrcode-${currentShortCode}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
    
    // Helper functions
    function isValidUrl(url) {
        try {
            new URL(addHttpPrefix(url));
            return true;
        } catch (_) {
            return false;
        }
    }
    
    function addHttpPrefix(url) {
        return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    }
    
    function generateShortCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    function generateQRCode(text, element) {
        // Clear previous QR code
        element.innerHTML = '';
        
        // Generate new QR code
        new QRCode(element, {
            text: text,
            width: 180,
            height: 180,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    
    function showAlert(message, type) {
        // Implement alert system as needed
        alert(message);
    }
    
    // Initialize from localStorage
    const storedUrls = JSON.parse(localStorage.getItem('urlDatabase')) || {};
    Object.assign(urlDatabase, storedUrls);
});