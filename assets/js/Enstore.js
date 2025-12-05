// Function to format prices
function formatPrice(price) {
    return typeof price === 'number' ? price.toFixed(2) + ' €' : price + ' €';
}

// Function to generate beats in the store
function generateStoreBeats() {
    const beatsContainer = document.getElementById('beats-container');
    const tracks = getTracks().filter(track => track.type === "shop"); // Only store beats

    tracks.forEach(track => {
        const beatCard = document.createElement('div');
        beatCard.className = 'beat-card reveal';
        beatCard.setAttribute('data-track', track.id);

        beatCard.innerHTML = `
        <div class="top-bar-detail" style="position: relative; bottom: 2rem; max-width: none; width: calc(100% + 4rem); right: 2rem"></div>
            <div class="beat-header">
                <div class="beat-icon">
                    <i class="fas fa-music"></i>
                </div>
                <div class="beat-info">
                    <h3 class="beat-title">${track.title}</h3>
                    <p class="beat-artist">${track.artist}</p>
                    <span class="beat-duration">${track.duration}</span>
                </div>
            </div>
            <div class="beat-actions">
                <button class="beat-btn listen" data-track="${track.id}">
                    <i class="fas fa-play-circle"></i> Listen Sample
                </button>
                <button class="beat-btn buy" data-track="${track.id}">
                    <i class="fas fa-shopping-cart"></i> Buy
                </button>
            </div>
        `;

        beatsContainer.appendChild(beatCard);
    });

    // Add Diamond option after all beats
    generateStoreDiamondOption();

    // Add event listeners to buttons
    addStoreEventListeners();
}

function generateStoreDiamondOption() {
    const beatsContainer = document.getElementById('beats-container');

    const DiamondOption = document.createElement('div');
    DiamondOption.className = 'beat-card reveal diamond-option';
    DiamondOption.setAttribute('data-track', 'diamond');

    DiamondOption.innerHTML = `
        <div class="top-bar-detail diamond-bar" style="position: relative; bottom: 2rem; max-width: none; width: calc(100% + 4rem); right: 2rem"></div>
        <div class="diamond-badge">
            <i class="fas fa-gem"></i> EXCLUSIVE
        </div>
        <div class="beat-header">
            <div class="beat-icon diamond-icon">
                <i class="fas fa-crown"></i>
            </div>
            <div class="beat-info">
                <h3 class="beat-title diamond-title">Diamond Offer</h3>
                <p class="beat-artist diamond-artist">Buy rights</p>
                <span class="beat-duration diamond-duration">100% Exclusive</span>
            </div>
        </div>
        <div class="beat-description diamond-description">
            <p>Want one of my productions? Contact me to negotiate the copyrights of my works.</p>
            <ul class="diamond-features">
                <li><i class="fas fa-check"></i> 100% original and exclusive beat</li>
                <li><i class="fas fa-check"></i> .wav and .mp3 files</li>
                <li><i class="fas fa-check"></i> Optional tag</li>
                <li><i class="fas fa-check"></i> Complete FL Studio project</li>
                <li><i class="fas fa-check"></i> All stems and samples</li>
                <li><i class="fas fa-check"></i> Full exclusive and legal rights of the beat</li>
            </ul>
        </div>
        <div class="beat-actions">
            <button class="beat-btn diamond-btn" data-track="diamond">
                <i class="fas fa-gem"></i> Contact Me
            </button>
        </div>
    `;

    beatsContainer.appendChild(DiamondOption);
}

// Function to add event listeners
function addStoreEventListeners() {
    const listenButtons = document.querySelectorAll('.beat-btn.listen');
    const buyButtons = document.querySelectorAll('.beat-btn.buy');
    const diamondButton = document.querySelector('.beat-btn.diamond-btn');
    const purchaseModal = document.getElementById('purchase-modal');
    const closePurchase = document.getElementById('close-purchase');
    const purchaseTitle = document.getElementById('purchase-track-title');

    let currentTrack = null;
    let paypalSDKLoaded = false;

    // Load PayPal SDK once at startup
    function loadPayPalSDK() {
        if (!paypalSDKLoaded) {
            const script = document.createElement('script');
            script.src = 'https://www.paypal.com/sdk/js?client-id=BAAjLeU3hHuW_jvliJ9enzjx6anVNS6epANv1FI7PGdt-EIyrJopXLF5IeFM9yc3W3gzo2aHe6UJ124bNs&components=hosted-buttons&disable-funding=venmo&currency=EUR';
            script.async = true;
            script.onload = function() {
                paypalSDKLoaded = true;
                console.log('PayPal SDK loaded successfully');
            };
            script.onerror = function() {
                console.error('Failed to load PayPal SDK');
            };
            document.head.appendChild(script);
        }
    }

    // Load SDK when page is ready
    loadPayPalSDK();

    // Listen buttons
    listenButtons.forEach(button => {
        button.addEventListener('click', function () {
            const trackId = parseInt(this.getAttribute('data-track'));
            if (typeof window.loadAndPlayTrack === 'function') {
                window.loadAndPlayTrack(trackId);
            }
        });
    });

    // Normal buy buttons
    buyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const trackId = parseInt(this.getAttribute('data-track'));
            const track = getTracks().find(t => t.id === trackId);
    
            if (track) {
                currentTrack = track;
                purchaseTitle.textContent = track.title;
                
                // Update prices dynamically
                const basicPriceElement = document.getElementById('basic-price');
                const premiumPriceElement = document.getElementById('premium-price');
                
                if (basicPriceElement) {
                    basicPriceElement.textContent = formatPrice(track.basicPrice);
                }
                
                if (premiumPriceElement) {
                    premiumPriceElement.textContent = formatPrice(track.premiumPrice);
                }
                
                purchaseModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Wait for modal to be visible before rendering PayPal
                setTimeout(() => {
                    renderPayPalButtons(track);
                }, 300);
            }
        });
    });

    // Diamond button
    if (diamondButton) {
        diamondButton.addEventListener('click', function () {
            window.open('https://wa.me/+22650987034?text=Hello%20J%20DaProd,%20I%20am%20interested%20in%20your%20Diamond%20Offer%20to%20buy%20the%20rights%20of%20a%20production', '_blank');
        });
    }

    // Close popup
    closePurchase.addEventListener('click', function () {
        purchaseModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Clear PayPal buttons when closing
        clearPayPalButtons();
    });

    // Close popup when clicking outside
    purchaseModal.addEventListener('click', function (e) {
        if (e.target === purchaseModal) {
            purchaseModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            clearPayPalButtons();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && purchaseModal.classList.contains('active')) {
            purchaseModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            clearPayPalButtons();
        }
    });
}

// Function to render PayPal buttons
function renderPayPalButtons(track) {
    // Clear containers first
    clearPayPalButtons();
    
    // Verify PayPal is available
    if (typeof paypal === 'undefined') {
        console.error('PayPal SDK not loaded');
        showPayPalError();
        return;
    }

    try {
        // Basic button
        paypal.HostedButtons({
            hostedButtonId: "XMMGD24J4K9CA",
            onInit: function(data, actions) {
                console.log('Basic button initialized');
            },
            onClick: function() {
                console.log('Basic button clicked for track:', track.title);
            },
            onApprove: function(data, actions) {
                console.log('Basic payment approved:', data);
                // Redirect to confirmation page
                window.location.href = `confirmacion.html?track=${encodeURIComponent(track.title)}&license=basic&order=${data.orderID}`;
            },
            onError: function(err) {
                console.error('Basic button error:', err);
                showPayPalError();
            }
        }).render("#paypal-container-basic").catch(error => {
            console.error('Error rendering basic button:', error);
            showPayPalError();
        });

        // Premium button
        paypal.HostedButtons({
            hostedButtonId: "TN2YM52GDBPLS",
            onInit: function(data, actions) {
                console.log('Premium button initialized');
            },
            onClick: function() {
                console.log('Premium button clicked for track:', track.title);
            },
            onApprove: function(data, actions) {
                console.log('Premium payment approved:', data);
                // Redirect to confirmation page
                window.location.href = `confirmacion.html?track=${encodeURIComponent(track.title)}&license=premium&order=${data.orderID}`;
            },
            onError: function(err) {
                console.error('Premium button error:', err);
                showPayPalError();
            }
        }).render("#paypal-container-premium").catch(error => {
            console.error('Error rendering premium button:', error);
            showPayPalError();
        });

    } catch (error) {
        console.error('Error initializing PayPal buttons:', error);
        showPayPalError();
    }
}

// Function to clear PayPal buttons
function clearPayPalButtons() {
    const basicContainer = document.getElementById('paypal-container-basic');
    const premiumContainer = document.getElementById('paypal-container-premium');
    
    if (basicContainer) basicContainer.innerHTML = '';
    if (premiumContainer) premiumContainer.innerHTML = '';
}

// Function to show PayPal error
function showPayPalError() {
    const basicContainer = document.getElementById('paypal-container-basic');
    const premiumContainer = document.getElementById('paypal-container-premium');
    
    const errorHTML = `
        <div class="paypal-error">
            <p>Error loading payment buttons</p>
            <a href="https://wa.me/+22650987034?text=Hello%20J%20DaProd,%20I%20want%20to%20buy%20a%20license%20but%20there%20are%20problems%20with%20the%20payment" 
               class="btn btn-primary" style="margin-top: 0.5rem;">
                <i class="fab fa-whatsapp"></i> Buy via WhatsApp
            </a>
        </div>
    `;
    
    if (basicContainer) basicContainer.innerHTML = errorHTML;
    if (premiumContainer) premiumContainer.innerHTML = errorHTML;
}

// Once the entire page is loaded, load store elements
document.addEventListener('DOMContentLoaded', function () {
    generateStoreBeats();
});

// Function to force PayPal button styles
function forcePayPalButtonStyles() {
    // Wait for PayPal elements to be in the DOM
    setTimeout(() => {
        // Select all PayPal checkout buttons
        const checkoutButtons = document.querySelectorAll('#checkout-button');
        
        checkoutButtons.forEach(button => {
            // Apply inline styles to force appearance
            button.style.cssText = `
                width: 100% !important;
                padding: 1rem !important;
                border-radius: 50px !important;
                border: none !important;
                font-weight: 600 !important;
                font-size: 1rem !important;
                cursor: pointer !important;
                transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                text-transform: uppercase !important;
                letter-spacing: 1px !important;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                font-family: Inter, sans-serif !important;
            `;
            
            // Determine if basic or premium based on parent container
            const parentContainer = button.closest('.purchase-option');
            if (parentContainer.classList.contains('premium')) {
                button.style.cssText += `
                    background: var(--gold) !important;
                    color: var(--deep-space) !important;
                    font-weight: 700 !important;
                `;
            } else {
                button.style.cssText += `
                    background: var(--emerald-medium) !important;
                    color: var(--platinum) !important;
                `;
            }
        });
        
        // Hide unwanted PayPal elements
        const unwantedElements = document.querySelectorAll(`
            .item-header,
            .item-title,
            .price-container,
            .css-au42bs,
            .paypal-buttons
        `);
        
        unwantedElements.forEach(el => {
            if (el) el.style.display = 'none !important';
        });
        
    }, 500);
}

// Modify renderPayPalButtons function to include style forcing
function renderPayPalButtons(track) {
    // Clear containers first
    clearPayPalButtons();
    
    // Verify PayPal is available
    if (typeof paypal === 'undefined') {
        console.error('PayPal SDK not loaded');
        showPayPalError();
        return;
    }

    try {
        // Basic button
        paypal.HostedButtons({
            hostedButtonId: "XMMGD24J4K9CA",
            onInit: function(data, actions) {
                console.log('Basic button initialized');
                const container = document.getElementById('paypal-container-basic');
                if (container) {
                    container.innerHTML = '';
                }
                // Force styles after initialization
                setTimeout(forcePayPalButtonStyles, 300);
            },
            onClick: function() {
                console.log('Basic button clicked for track:', track.title);
            },
            onApprove: function(data, actions) {
                console.log('Basic payment approved:', data);
                window.location.href = `confirmacion.html?track=${encodeURIComponent(track.title)}&license=basic&order=${data.orderID}`;
            },
            onError: function(err) {
                console.error('Basic button error:', err);
                showPayPalError();
            }
        }).render("#paypal-container-basic").catch(error => {
            console.error('Error rendering basic button:', error);
            showPayPalError();
        });

        // Premium button
        paypal.HostedButtons({
            hostedButtonId: "TN2YM52GDBPLS",
            onInit: function(data, actions) {
                console.log('Premium button initialized');
                const container = document.getElementById('paypal-container-premium');
                if (container) {
                    container.innerHTML = '';
                }
                // Force styles after initialization
                setTimeout(forcePayPalButtonStyles, 300);
            },
            onClick: function() {
                console.log('Premium button clicked for track:', track.title);
            },
            onApprove: function(data, actions) {
                console.log('Premium payment approved:', data);
                window.location.href = `confirmacion.html?track=${encodeURIComponent(track.title)}&license=premium&order=${data.orderID}`;
            },
            onError: function(err) {
                console.error('Premium button error:', err);
                showPayPalError();
            }
        }).render("#paypal-container-premium").catch(error => {
            console.error('Error rendering premium button:', error);
            showPayPalError();
        });

    } catch (error) {
        console.error('Error initializing PayPal buttons:', error);
        showPayPalError();
    }
}