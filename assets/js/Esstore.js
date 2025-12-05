// Función para formatear precios
function formatPrice(price) {
    return typeof price === 'number' ? price.toFixed(2) + ' €' : price + ' €';
}

// Función para generar los beats en la tienda
function generateStoreBeats() {
    const beatsContainer = document.getElementById('beats-container');
    const tracks = getTracks().filter(track => track.type === "shop"); // Solo beats de la tienda

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
                    <i class="fas fa-play-circle"></i> Escuchar Muestra
                </button>
                <button class="beat-btn buy" data-track="${track.id}">
                    <i class="fas fa-shopping-cart"></i> Comprar
                </button>
            </div>
        `;

        beatsContainer.appendChild(beatCard);
    });

    // Agregar la opción Diamond después de todos los beats
    generateStoreDiamondOption();

    // Agregar event listeners a los botones
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
            <i class="fas fa-gem"></i> EXCLUSIVO
        </div>
        <div class="beat-header">
            <div class="beat-icon diamond-icon">
                <i class="fas fa-crown"></i>
            </div>
            <div class="beat-info">
                <h3 class="beat-title diamond-title">Diamond Offer</h3>
                <p class="beat-artist diamond-artist">Comprar derechos</p>
                <span class="beat-duration diamond-duration">100% Exclusivo</span>
            </div>
        </div>
        <div class="beat-description diamond-description">
            <p>¿Quieres una de mis producciones? Contácteme para negociar los derechos de autor de mis obras.</p>
            <ul class="diamond-features">
                <li><i class="fas fa-check"></i> Beat 100% original y exclusivo</li>
                <li><i class="fas fa-check"></i> archivo .wav y .mp3</li>
                <li><i class="fas fa-check"></i> Etiqueta opcional</li>
                <li><i class="fas fa-check"></i> Proyecto FL Studio completo</li>
                <li><i class="fas fa-check"></i> Todos los stems y samples</li>
                <li><i class="fas fa-check"></i> Derechos exclusivos y legales plenos del beat</li>
            </ul>
        </div>
        <div class="beat-actions">
            <button class="beat-btn diamond-btn" data-track="diamond">
                <i class="fas fa-gem"></i> Contácteme
            </button>
        </div>
    `;

    beatsContainer.appendChild(DiamondOption);
}

// Función para agregar los event listeners
function addStoreEventListeners() {
    const listenButtons = document.querySelectorAll('.beat-btn.listen');
    const buyButtons = document.querySelectorAll('.beat-btn.buy');
    const diamondButton = document.querySelector('.beat-btn.diamond-btn');
    const purchaseModal = document.getElementById('purchase-modal');
    const closePurchase = document.getElementById('close-purchase');
    const purchaseTitle = document.getElementById('purchase-track-title');

    let currentTrack = null;
    let paypalSDKLoaded = false;

    // Cargar SDK de PayPal una vez al inicio
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

    // Cargar SDK cuando la página esté lista
    loadPayPalSDK();

    // Botones de escuchar
    listenButtons.forEach(button => {
        button.addEventListener('click', function () {
            const trackId = parseInt(this.getAttribute('data-track'));
            if (typeof window.loadAndPlayTrack === 'function') {
                window.loadAndPlayTrack(trackId);
            }
        });
    });

    // Botones de compra normales
    buyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const trackId = parseInt(this.getAttribute('data-track'));
            const track = getTracks().find(t => t.id === trackId);
    
            if (track) {
                currentTrack = track;
                purchaseTitle.textContent = track.title;
                
                // Actualizar precios dinámicamente
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
                
                // Esperar a que el modal esté visible antes de renderizar PayPal
                setTimeout(() => {
                    renderPayPalButtons(track);
                }, 300);
            }
        });
    });

    // Botón Diamond
    if (diamondButton) {
        diamondButton.addEventListener('click', function () {
            window.open('https://wa.me/+22650987034?text=Hola%20J%20DaProd,%20estoy%20interesado%20en%20tu%20Diamond%20Offer%20para%20comprar%los%20derechos%20de%20una%20producción', '_blank');
        });
    }

    // Cerrar popup
    closePurchase.addEventListener('click', function () {
        purchaseModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Limpiar botones PayPal al cerrar
        clearPayPalButtons();
    });

    // Cerrar popup al hacer click fuera
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

// Función para renderizar botones PayPal
function renderPayPalButtons(track) {
    // Limpiar contenedores primero
    clearPayPalButtons();
    
    // Verificar que PayPal esté disponible
    if (typeof paypal === 'undefined') {
        console.error('PayPal SDK not loaded');
        showPayPalError();
        return;
    }

    try {
        // Botón Básico
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
                // Redirigir a página de confirmación
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

        // Botón Premium
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
                // Redirigir a página de confirmación
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

// Función para limpiar botones PayPal
function clearPayPalButtons() {
    const basicContainer = document.getElementById('paypal-container-basic');
    const premiumContainer = document.getElementById('paypal-container-premium');
    
    if (basicContainer) basicContainer.innerHTML = '';
    if (premiumContainer) premiumContainer.innerHTML = '';
}

// Función para mostrar error de PayPal
function showPayPalError() {
    const basicContainer = document.getElementById('paypal-container-basic');
    const premiumContainer = document.getElementById('paypal-container-premium');
    
    const errorHTML = `
        <div class="paypal-error">
            <p>Error al cargar los botones de pago</p>
            <a href="https://wa.me/+22650987034?text=Hola%20J%20DaProd,%20quiero%20comprar%20una%20licencia%20pero%20hay%20problemas%20con%20el%20pago" 
               class="btn btn-primary" style="margin-top: 0.5rem;">
                <i class="fab fa-whatsapp"></i> Comprar por WhatsApp
            </a>
        </div>
    `;
    
    if (basicContainer) basicContainer.innerHTML = errorHTML;
    if (premiumContainer) premiumContainer.innerHTML = errorHTML;
}

// Una vez toda la pagina sea cargada, Cargar los elemntos de la tienda
document.addEventListener('DOMContentLoaded', function () {
    generateStoreBeats();
});
















// Función para forzar los estilos de los botones PayPal
function forcePayPalButtonStyles() {
    // Esperar a que los elementos de PayPal estén en el DOM
    setTimeout(() => {
        // Seleccionar todos los botones de checkout de PayPal
        const checkoutButtons = document.querySelectorAll('#checkout-button');
        
        checkoutButtons.forEach(button => {
            // Aplicar estilos inline para forzar la apariencia
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
            
            // Determinar si es básico o premium basado en el contenedor padre
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
        
        // Ocultar elementos no deseados de PayPal
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

// Modificar la función renderPayPalButtons para incluir el forzado de estilos
function renderPayPalButtons(track) {
    // Limpiar contenedores primero
    clearPayPalButtons();
    
    // Verificar que PayPal esté disponible
    if (typeof paypal === 'undefined') {
        console.error('PayPal SDK not loaded');
        showPayPalError();
        return;
    }

    try {
        // Botón Básico
        paypal.HostedButtons({
            hostedButtonId: "XMMGD24J4K9CA",
            onInit: function(data, actions) {
                console.log('Basic button initialized');
                const container = document.getElementById('paypal-container-basic');
                if (container) {
                    container.innerHTML = '';
                }
                // Forzar estilos después de la inicialización
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

        // Botón Premium
        paypal.HostedButtons({
            hostedButtonId: "TN2YM52GDBPLS",
            onInit: function(data, actions) {
                console.log('Premium button initialized');
                const container = document.getElementById('paypal-container-premium');
                if (container) {
                    container.innerHTML = '';
                }
                // Forzar estilos después de la inicialización
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