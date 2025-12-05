// Animar el header cuando tope con la parte de arriba
// si la pagina se scrollea hasta arriba, el header va a realizar una animacion sutil
window.addEventListener("scroll", function() {
    const header = document.getElementById("main-header");
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// Spawnear los elementos cuando son vistos por primera vez
// cuando un elemento aparece en pantalla por primera vez, lo hace con una animacion sutil
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

// con cada scroll se verifica si hay elementos para revelar
window.addEventListener("scroll", reveal);
reveal();



// ------------------------------------------------------------------------------------
// para abrir y cerrar el menu lateral --------------  --  ------- ---- ----- --- -----
// ------------------------------------------------------------------------------------

function toggleBurgerMenu() {
    const burgerMenu = document.getElementById('burger-menu');
    const overlay = document.getElementById('burger-menu-overlay');
    
    burgerMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = burgerMenu.classList.contains('active') ? 'hidden' : 'auto';
}

function closeBurgerMenu() {
    const burgerMenu = document.getElementById('burger-menu');
    const overlay = document.getElementById('burger-menu-overlay');
    
    burgerMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const burgerToggler = document.getElementById('burger-menu-toggler');
    const closeBtn = document.getElementById('close-burger-menu');
    const overlay = document.getElementById('burger-menu-overlay');
    
    if (burgerToggler) {
        burgerToggler.addEventListener('click', toggleBurgerMenu);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeBurgerMenu);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeBurgerMenu);
    }
    
    // Cerrar menú al presionar Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeBurgerMenu();
        }
    });
});


// Despues de un tiempo, al volver aqui me di cuenta de que el burguer menu es solo en el celular
// y agregue que pudiera cerrarse con escape XD