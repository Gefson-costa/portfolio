// ========================================
// PORTFOLIO - MODERN JAVASCRIPT
// ========================================

// ========================================
// EMAILJS INITIALIZATION
// ========================================
// Inicializa EmailJS com sua Public Key
// Isso conecta o código à sua conta EmailJS
(function () {
    emailjs.init("qMxU_vXjtObDhzOUF");
})();

// Cache DOM elements for better performance
const sections = document.querySelectorAll('.section');
const sectBtn = document.querySelectorAll('.control');
const allSections = document.querySelector('.main-content');

// ========================================
// PAGE TRANSITIONS & NAVIGATION
// ========================================

function PageTransitions() {
    // Button click active class - Modern approach using forEach
    sectBtn.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from currently active button
            const currentActiveBtn = document.querySelector('.active-btn');
            if (currentActiveBtn) {
                currentActiveBtn.classList.remove('active-btn');
            }

            // Add active class to clicked button
            this.classList.add('active-btn');
        });
    });

    // Section Active class - Event delegation for better performance
    allSections.addEventListener("click", (e) => {
        const id = e.target.dataset.id;

        if (id) {
            // Remove active class from all buttons
            sectBtn.forEach((btn) => {
                btn.classList.remove('active-btn');
            });

            // Add active class to clicked button
            e.target.classList.add('active-btn');

            // Remove active class from all sections
            sections.forEach((section) => {
                section.classList.remove('active');
            });

            // Add active class to target section
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('active');
            }
        }
    });

    // Theme toggle functionality
    const themeBtn = document.querySelector(".theme-btn");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            allSections.classList.toggle("bright-mode");

            // Save theme preference to localStorage
            const isBrightMode = allSections.classList.contains("bright-mode");
            localStorage.setItem('theme', isBrightMode ? 'bright' : 'dark');
        });
    }

    // Load saved theme preference on page load
    loadThemePreference();
}

// ========================================
// THEME PREFERENCE
// ========================================

function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        allSections.classList.remove('bright-mode');
    } else if (savedTheme === 'bright') {
        allSections.classList.add('bright-mode');
    }
    // If no preference saved, keep default (bright-mode from HTML)
}

// ========================================
// FORM VALIDATION & SUBMISSION
// ========================================

function initFormValidation() {
    const form = document.getElementById('contactForm');

    // Exit if form doesn't exist on the page
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        // Prevent default form submission
        e.preventDefault();

        // Get form values and trim whitespace
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validation: Check if all fields are filled
        if (name === '' || email === '' || subject === '' || message === '') {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        // Validation: Check name length
        if (name.length < 2) {
            showMessage('Please enter a valid name (at least 2 characters)', 'error');
            return;
        }

        // Validation: Check email format using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Validation: Check subject length
        if (subject.length < 3) {
            showMessage('Please enter a subject (at least 3 characters)', 'error');
            return;
        }

        // Validation: Check message length
        if (message.length < 10) {
            showMessage('Please enter a longer message (at least 10 characters)', 'error');
            return;
        }

        // ========================================
        // SEND EMAIL WITH EMAILJS
        // ========================================

        // Get submit button for loading state
        const submitBtn = form.querySelector('.main-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;

        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            btnText.textContent = 'Sending...';

            // Send email via EmailJS
            // emailjs.sendForm automatically captures all form fields with 'name' attribute
            const response = await emailjs.sendForm(
                'service_rldv4wq',    // Your Service ID
                'template_n9kjlml',   // Your Template ID
                form                  // The form element
            );

            console.log('✅ Email sent successfully!', response.status, response.text);

            // Show success message
            showMessage('Message sent successfully! I will get back to you soon.', 'success');

            // Reset form
            form.reset();

        } catch (error) {
            // Log error for debugging
            console.error('❌ Failed to send email:', error);

            // Show error message to user
            showMessage('Failed to send message. Please try again later or contact me directly.', 'error');

        } finally {
            // Always restore button state (whether success or error)
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            btnText.textContent = originalText;
        }
    });
}

// ========================================
// SHOW MESSAGE FEEDBACK
// ========================================

function showMessage(message, type) {
    // Remove any existing message
    const existingMsg = document.querySelector('.form-message');
    if (existingMsg) {
        existingMsg.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    // Add appropriate icon based on message type
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';
    messageDiv.prepend(icon);

    // Insert message after the form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);

    // Animate message in
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 5000);
}

// ========================================
// PORTFOLIO FILTER FUNCTIONALITY
// ========================================

function initPortfolioFilters() {
    // Seleciona todos os botões de filtro e itens do portfolio
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // Exit if no filter buttons exist
    if (filterBtns.length === 0 || portfolioItems.length === 0) return;

    // Adiciona event listener em cada botão de filtro
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // 1. Remove classe 'active' de todos os botões
            filterBtns.forEach(b => b.classList.remove('active'));

            // 2. Adiciona classe 'active' no botão clicado
            this.classList.add('active');

            // 3. Pega o valor do filtro (data-filter attribute)
            const filterValue = this.dataset.filter;

            // 4. Filtra os itens do portfolio
            portfolioItems.forEach(item => {
                // Pega a categoria do item
                const itemCategory = item.dataset.category;

                // Se filtro é "all" OU categoria corresponde ao filtro
                if (filterValue === 'all' || itemCategory === filterValue) {
                    // Mostra o item com animação suave
                    item.style.display = 'block';
                    // Pequeno delay para permitir transição CSS
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    // Esconde o item com animação suave
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    // Espera animação terminar antes de esconder completamente
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ========================================
// INITIALIZE ALL FUNCTIONS
// ========================================

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function () {
    PageTransitions();
    initFormValidation();
    initPortfolioFilters();

    // Optional: Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Only prevent default for hash links that aren't just "#"
            if (href !== '#' && href !== '#contact') {
                e.preventDefault();
            }
        });
    });
});

// ========================================
// EDUCATIONAL NOTES:
// ========================================
/*
IMPROVEMENTS MADE:

1. Modern JavaScript Syntax:
   - Used const/let instead of var
   - Used arrow functions for cleaner syntax
   - Used forEach instead of traditional for loops
   - Used template literals where appropriate

2. Better Code Organization:
   - Clear section comments
   - Functions have single responsibilities
   - Descriptive variable and function names

3. Performance Optimizations:
   - Cached DOM queries
   - Used event delegation
   - Saved theme preference to localStorage

4. Enhanced Validation:
   - Multiple validation checks (length, format)
   - Clear error messages
   - Email regex validation
   - Prevents empty submissions

5. Better UX:
   - Visual feedback for form submission
   - Auto-remove messages after 5 seconds
   - Smooth animations
   - Theme preference persistence

6. Defensive Programming:
   - Check if elements exist before manipulating
   - Proper error handling
   - Graceful degradation

7. Best Practices:
   - DOMContentLoaded event listener
   - Comments explaining code sections
   - Consistent code formatting
   - Educational notes for learning
*/
