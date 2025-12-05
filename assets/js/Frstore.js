// Fonction pour formater les prix
function formatPrice(price) {
    return typeof price === 'number' ? price.toFixed(2) + ' €' : price + ' €';
}

// Fonction pour générer les beats dans la boutique
function generateStoreBeats() {
    const beatsContainer = document.getElementById('beats-container');
    const tracks = getTracks().filter(track => track.type === "shop"); // Seulement les beats de la boutique

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
                    <i class="fas fa-play-circle"></i> Écouter l'Extrait
                </button>
                <button class="beat-btn buy" data-track="${track.id}">
                    <i class="fas fa-shopping-cart"></i> Acheter
                </button>
            </div>
        `;

        beatsContainer.appendChild(beatCard);
    });

    // Ajouter l'option Diamond après tous les beats
    generateStoreDiamondOption();

    // Ajouter les écouteurs d'événements aux boutons
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
            <i class="fas fa-gem"></i> EXCLUSIF
        </div>
        <div class="beat-header">
            <div class="beat-icon diamond-icon">
                <i class="fas fa-crown"></i>
            </div>
            <div class="beat-info">
                <h3 class="beat-title diamond-title">Offre Diamond</h3>
                <p class="beat-artist diamond-artist">Acheter les droits</p>
                <span class="beat-duration diamond-duration">100% Exclusif</span>
            </div>
        </div>
        <div class="beat-description diamond-description">
            <p>Vous voulez une de mes productions ? Contactez-moi pour négocier les droits d'auteur de mes œuvres.</p>
            <ul class="diamond-features">
                <li><i class="fas fa-check"></i> Beat 100% original et exclusif</li>
                <li><i class="fas fa-check"></i> Fichiers .wav et .mp3</li>
                <li><i class="fas fa-check"></i> Tag optionnel</li>
                <li><i class="fas fa-check"></i> Projet FL Studio complet</li>
                <li><i class="fas fa-check"></i> Tous les stems et samples</li>
                <li><i class="fas fa-check"></i> Droits exclusifs et légaux complets du beat</li>
            </ul>
        </div>
        <div class="beat-actions">
            <button class="beat-btn diamond-btn" data-track="diamond">
                <i class="fas fa-gem"></i> Me Contacter
            </button>
        </div>
    `;

    beatsContainer.appendChild(DiamondOption);
}

// Fonction pour ajouter les écouteurs d'événements
function addStoreEventListeners() {
    const listenButtons = document.querySelectorAll('.beat-btn.listen');
    const buyButtons = document.querySelectorAll('.beat-btn.buy');
    const diamondButton = document.querySelector('.beat-btn.diamond-btn');
    const purchaseModal = document.getElementById('purchase-modal');
    const closePurchase = document.getElementById('close-purchase');
    const purchaseTitle = document.getElementById('purchase-track-title');

    let currentTrack = null;
    let paypalSDKLoaded = false;

    // Charger le SDK PayPal une fois au démarrage
    function loadPayPalSDK() {
        if (!paypalSDKLoaded) {
            const script = document.createElement('script');
            script.src = 'https://www.paypal.com/sdk/js?client-id=BAAjLeU3hHuW_jvliJ9enzjx6anVNS6epANv1FI7PGdt-EIyrJopXLF5IeFM9yc3W3gzo2aHe6UJ124bNs&components=hosted-buttons&disable-funding=venmo&currency=EUR';
            script.async = true;
            script.onload = function() {
                paypalSDKLoaded = true;
                console.log('PayPal SDK chargé avec succès');
            };
            script.onerror = function() {
                console.error('Échec du chargement du SDK PayPal');
            };
            document.head.appendChild(script);
        }
    }

    // Charger le SDK lorsque la page est prête
    loadPayPalSDK();

    // Boutons d'écoute
    listenButtons.forEach(button => {
        button.addEventListener('click', function () {
            const trackId = parseInt(this.getAttribute('data-track'));
            if (typeof window.loadAndPlayTrack === 'function') {
                window.loadAndPlayTrack(trackId);
            }
        });
    });

    // Boutons d'achat normaux
    buyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const trackId = parseInt(this.getAttribute('data-track'));
            const track = getTracks().find(t => t.id === trackId);
    
            if (track) {
                currentTrack = track;
                purchaseTitle.textContent = track.title;
                
                // Mettre à jour les prix dynamiquement
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
                
                // Attendre que le modal soit visible avant de rendre PayPal
                setTimeout(() => {
                    renderPayPalButtons(track);
                }, 300);
            }
        });
    });

    // Bouton Diamond
    if (diamondButton) {
        diamondButton.addEventListener('click', function () {
            window.open('https://wa.me/+22650987034?text=Bonjour%20J%20DaProd,%20je%20suis%20intéressé%20par%20votre%20Offre%20Diamond%20pour%20acheter%20les%20droits%20d%27une%20production', '_blank');
        });
    }

    // Fermer le popup
    closePurchase.addEventListener('click', function () {
        purchaseModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Effacer les boutons PayPal à la fermeture
        clearPayPalButtons();
    });

    // Fermer le popup en cliquant à l'extérieur
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

// Fonction pour rendre les boutons PayPal
function renderPayPalButtons(track) {
    // Effacer d'abord les conteneurs
    clearPayPalButtons();
    
    // Vérifier que PayPal est disponible
    if (typeof paypal === 'undefined') {
        console.error('SDK PayPal non chargé');
        showPayPalError();
        return;
    }

    try {
        // Bouton Basique
        paypal.HostedButtons({
            hostedButtonId: "XMMGD24J4K9CA",
            onInit: function(data, actions) {
                console.log('Bouton basique initialisé');
            },
            onClick: function() {
                console.log('Bouton basique cliqué pour le track:', track.title);
            },
            onApprove: function(data, actions) {
                console.log('Paiement basique approuvé:', data);
                // Rediriger vers la page de confirmation
                window.location.href = `confirmacion.html?track=${encodeURIComponent(track.title)}&license=basic&order=${data.orderID}`;
            },
            onError: function(err) {
                console.error('Erreur bouton basique:', err);
                showPayPalError();
            }
        }).render("#paypal-container-basic").catch(error => {
            console.error('Erreur de rendu du bouton basique:', error);
            showPayPalError();
        });

        // Bouton Premium
        paypal.HostedButtons({
            hostedButtonId: "TN2YM52GDBPLS",
            onInit: function(data, actions) {
                console.log('Bouton premium initialisé');
            },
            onClick: function() {
                console.log('Bouton premium cliqué pour le track:', track.title);
            },
            onApprove: function(data, actions) {
                console.log('Paiement premium approuvé:', data);
                // Rediriger vers la page de confirmation
                window.location.href = `confirmacion.html?track=${encodeURIComponent(track.title)}&license=premium&order=${data.orderID}`;
            },
            onError: function(err) {
                console.error('Erreur bouton premium:', err);
                showPayPalError();
            }
        }).render("#paypal-container-premium").catch(error => {
            console.error('Erreur de rendu du bouton premium:', error);
            showPayPalError();
        });

    } catch (error) {
        console.error('Erreur d\'initialisation des boutons PayPal:', error);
        showPayPalError();
    }
}

// Fonction pour effacer les boutons PayPal
function clearPayPalButtons() {
    const basicContainer = document.getElementById('paypal-container-basic');
    const premiumContainer = document.getElementById('paypal-container-premium');
    
    if (basicContainer) basicContainer.innerHTML = '';
    if (premiumContainer) premiumContainer.innerHTML = '';
}

// Fonction pour afficher l'erreur PayPal
function showPayPalError() {
    const basicContainer = document.getElementById('paypal-container-basic');
    const premiumContainer = document.getElementById('paypal-container-premium');
    
    const errorHTML = `
        <div class="paypal-error">
            <p>Erreur lors du chargement des boutons de paiement</p>
            <a href="https://wa.me/+22650987034?text=Bonjour%20J%20DaProd,%20je%20veux%20acheter%20une%20licence%20mais%20il%20y%20a%20des%20problèmes%20avec%20le%20paiement" 
               class="btn btn-primary" style="margin-top: 0.5rem;">
                <i class="fab fa-whatsapp"></i> Acheter via WhatsApp
            </a>
        </div>
    `;
    
    if (basicContainer) basicContainer.innerHTML = errorHTML;
    if (premiumContainer) premiumContainer.innerHTML = errorHTML;
}

// Une fois toute la page chargée, charger les éléments de la boutique
document.addEventListener('DOMContentLoaded', function () {
    generateStoreBeats();
});

// Fonction pour forcer les styles des boutons PayPal
function forcePayPalButtonStyles() {
    // Attendre que les éléments PayPal soient dans le DOM
    setTimeout(() => {
        // Sélectionner tous les boutons de checkout PayPal
        const checkoutButtons = document.querySelectorAll('#checkout-button');
        
        checkoutButtons.forEach(button => {
            // Appliquer des styles inline pour forcer l'apparence
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
            
            // Déterminer si basique ou premium basé sur le conteneur parent
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
        
        // Cacher les éléments PayPal non désirés
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

// Modifier la fonction renderPayPalButtons pour inclure le forçage des styles
function renderPayPalButtons(track) {
    // Effacer d'abord les conteneurs
    clearPayPalButtons();
    
    // Vérifier que PayPal est disponible
    if (typeof paypal === 'undefined') {
        console.error('SDK PayPal non chargé');
        showPayPalError();
        return;
    }

    try {
        // Bouton Basique
        paypal.HostedButtons({
            hostedButtonId: "XMMGD24J4K9CA",
            onInit: function(data, actions) {
                console.log('Bouton basique initialisé');
                const container = document.getElementById('paypal-container-basic');
                if (container) {
                    container.innerHTML = '';
                }
                // Forcer les styles après l'initialisation
                setTimeout(forcePayPalButtonStyles, 300);
            },
            onClick: function() {
                console.log('Bouton basique cliqué pour le track:', track.title);
            },
            onApprove: function(data, actions) {
                console.log('Paiement basique approuvé:', data);
                window.location.href = `confirmacion.html?track=${encodeURIComponent(track.title)}&license=basic&order=${data.orderID}`;
            },
            onError: function(err) {
                console.error('Erreur bouton basique:', err);
                showPayPalError();
            }
        }).render("#paypal-container-basic").catch(error => {
            console.error('Erreur de rendu du bouton basique:', error);
            showPayPalError();
        });

        // Bouton Premium
        paypal.HostedButtons({
            hostedButtonId: "TN2YM52GDBPLS",
            onInit: function(data, actions) {
                console.log('Bouton premium initialisé');
                const container = document.getElementById('paypal-container-premium');
                if (container) {
                    container.innerHTML = '';
                }
                // Forcer les styles après l'initialisation
                setTimeout(forcePayPalButtonStyles, 300);
            },
            onClick: function() {
                console.log('Bouton premium cliqué pour le track:', track.title);
            },
            onApprove: function(data, actions) {
                console.log('Paiement premium approuvé:', data);
                window.location.href = `confirmacion.html?track=${encodeURIComponent(track.title)}&license=premium&order=${data.orderID}`;
            },
            onError: function(err) {
                console.error('Erreur bouton premium:', err);
                showPayPalError();
            }
        }).render("#paypal-container-premium").catch(error => {
            console.error('Erreur de rendu du bouton premium:', error);
            showPayPalError();
        });

    } catch (error) {
        console.error('Erreur d\'initialisation des boutons PayPal:', error);
        showPayPalError();
    }
}