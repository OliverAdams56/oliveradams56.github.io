document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Smooth Scrolling for Internal Links ---
    const initSmoothScroll = () => {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // --- 2. AJAX Formspree Contact Form Handling ---
    const initContactForm = () => {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        const statusMessage = document.createElement('div');
        statusMessage.className = 'form-status';
        statusMessage.style.marginTop = '1rem';
        statusMessage.style.padding = '0.75rem 1rem';
        statusMessage.style.borderRadius = '4px';
        statusMessage.style.fontSize = '0.95rem';
        statusMessage.style.fontWeight = '500';
        statusMessage.style.display = 'none';
        form.appendChild(statusMessage);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            statusMessage.style.display = 'none';

            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    statusMessage.style.display = 'block';
                    statusMessage.style.backgroundColor = '#E8F5E9';
                    statusMessage.style.color = '#2E7D32';
                    statusMessage.style.border = '1px solid #A5D6A7';
                    statusMessage.textContent = '✓ Thank you! Your message has been sent successfully.';
                    form.reset();
                } else {
                    const data = await response.json();
                    throw new Error(data.error || 'Form submission failed.');
                }
            } catch (error) {
                statusMessage.style.display = 'block';
                statusMessage.style.backgroundColor = '#FFEBEE';
                statusMessage.style.color = '#C62828';
                statusMessage.style.border = '1px solid #EF9A9A';
                statusMessage.textContent = '✕ Oops! Something went wrong. Please try again later.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    };

    // --- 3. Scroll Entrance Animations for Cards ---
    const initCardAnimations = () => {
        const cards = document.querySelectorAll('.card');
        if (!('IntersectionObserver' in window)) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
            observer.observe(card);
        });
    };

    // Initialize all components
    initSmoothScroll();
    initContactForm();
    initCardAnimations();
});