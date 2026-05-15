document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Initialize AOS Animations
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Smooth Scroll for Internal Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header Blur on Scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5, 5, 5, 0.95)';
        } else {
            header.style.background = 'rgba(5, 5, 5, 0.8)';
        }
    });

    // WhatsApp Float Visibility (Only show when reaching footer)
    const whatsappFloat = document.querySelector('.whatsapp-float');
    const footer = document.querySelector('footer');

    if (whatsappFloat && footer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    whatsappFloat.classList.add('at-footer');
                } else {
                    whatsappFloat.classList.remove('at-footer');
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(footer);
    }
    // WhatsApp Conversion Tracking
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (anchor && anchor.href.includes('wa.me')) {
            // Push event to GTM DataLayer
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'whatsapp_click',
                'button_location': anchor.className || 'floating_button',
                'link_text': anchor.innerText.trim() || 'Icon Click'
            });
            console.log('WhatsApp Click Tracked:', anchor.href);
        }
    });
});
