document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Smooth Scrolling ---
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link) {
            const targetId = link.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    });

    // --- 2. AJAX Formspree Contact Form Handling ---
    const form = document.querySelector('.contact-form');
    if (form) {
        const statusMessage = document.createElement('div');
        statusMessage.className = 'form-status';
        
        Object.assign(statusMessage.style, {
            marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '4px',
            fontSize: '0.95rem', fontWeight: '500', display: 'none'
        });
        form.appendChild(statusMessage);

        const updateStatus = (msg, isSuccess) => {
            statusMessage.style.display = 'block';
            statusMessage.style.backgroundColor = isSuccess ? '#E8F5E9' : '#FFEBEE';
            statusMessage.style.color = isSuccess ? '#2E7D32' : '#C62828';
            statusMessage.style.border = `1px solid ${isSuccess ? '#A5D6A7' : '#EF9A9A'}`;
            statusMessage.textContent = msg;
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            statusMessage.style.display = 'none';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    updateStatus('✓ Thank you! Your message has been sent successfully.', true);
                    form.reset();
                } else {
                    const data = await response.json();
                    throw new Error(data.error || 'Form submission failed.');
                }
            } catch (error) {
                updateStatus('✕ Oops! Something went wrong. Please try again later.', false);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    // --- 3. Scroll Entrance Animations ---
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
            observer.observe(card);
        });
    }

    // --- 4. Image Lightbox (Modal) ---
    const modal = document.getElementById('imageModal');
    const expandedImg = document.getElementById('expandedImg');

    if (modal && expandedImg) {
        const toggleModal = (show, src = '') => {
            modal.style.display = show ? "block" : "none";
            document.body.style.overflow = show ? "hidden" : "auto";
            if (show) expandedImg.src = src;
        };

        document.body.addEventListener('click', (e) => {
            if (e.target.matches('.clickable-img')) {
                toggleModal(true, e.target.src);
            } else if (e.target.matches('.close-modal') || e.target === modal) {
                toggleModal(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && modal.style.display === "block") {
                toggleModal(false);
            }
        });
    }

    // --- 5. ScrollSpy Sidebar Logic ---
    if ('IntersectionObserver' in window) {
        const sections = document.querySelectorAll('section');
        const sideLinks = document.querySelectorAll('.side-link');

        if (sections.length > 0 && sideLinks.length > 0) {
            const spyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Remove 'active' class from all links
                        sideLinks.forEach(link => link.classList.remove('active'));
                        
                        // Add 'active' class to the link matching the current section on screen
                        const activeLink = document.querySelector(`.side-link[href="#${entry.target.id}"]`);
                        if (activeLink) activeLink.classList.add('active');
                    }
                });
            }, { 
                // Triggers when the section crosses the vertical center of the viewport
                rootMargin: '-40% 0px -40% 0px' 
            });

            sections.forEach(section => spyObserver.observe(section));
        }
    }

});

// --- 6. Tabbed Interface Logic ---
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('.tab-btn')) {
            const btn = e.target;
            const targetId = btn.getAttribute('data-target');
            const targetPane = document.getElementById(targetId);

            if (targetPane) {
                // Scope the change to the architecture section
                const tabContainer = btn.closest('#architecture');
                
                // Remove 'active' class from all buttons and panes
                tabContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                tabContainer.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

                // Add 'active' class to the clicked button and its corresponding pane
                btn.classList.add('active');
                targetPane.classList.add('active');
            }
        }
    });