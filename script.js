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
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
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
        }, { threshold: 0.1 });
        observer.observe(footer);
    }

    // WhatsApp Conversion Tracking
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (anchor && anchor.href.includes('wa.me')) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'whatsapp_click',
                'button_location': anchor.className || 'floating_button',
                'link_text': anchor.innerText.trim() || 'Icon Click'
            });
        }
    });

    // -------------------------------------------------------
    // Mascara de telefone: (99) 9 9999-9999
    // -------------------------------------------------------
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let digits = e.target.value.replace(/\D/g, '').substring(0, 11);
            let formatted = '';
            if (digits.length > 0) formatted = '(' + digits.substring(0, 2);
            if (digits.length >= 3) formatted += ') ' + digits.substring(2, 3);
            if (digits.length >= 4) formatted += ' ' + digits.substring(3, 7);
            if (digits.length >= 8) formatted += '-' + digits.substring(7, 11);
            e.target.value = formatted;
        });

        phoneInput.addEventListener('keydown', function(e) {
            const allowedKeys = [8, 46, 9, 27, 13, 35, 36, 37, 38, 39, 40];
            const isCtrl = e.ctrlKey || e.metaKey;
            if (allowedKeys.includes(e.keyCode) || isCtrl) return;
            if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    }

    // -------------------------------------------------------
    // Formulario: validacao inline + envio AJAX (sem redirecionar)
    // -------------------------------------------------------
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {

        function showError(input, message) {
            const group = input.closest('.form-group');
            let errorSpan = group.querySelector('.field-error');
            if (!errorSpan) {
                errorSpan = document.createElement('span');
                errorSpan.className = 'field-error';
                group.appendChild(errorSpan);
            }
            errorSpan.textContent = message;
            input.style.borderColor = '#ef4444';
        }

        function clearError(input) {
            const group = input.closest('.form-group');
            const errorSpan = group.querySelector('.field-error');
            if (errorSpan) errorSpan.remove();
            input.style.borderColor = '';
        }

        // Limpa erro conforme o usuario digita
        contactForm.querySelectorAll('input, textarea').forEach(function(input) {
            input.addEventListener('input', function() {
                if (this.value.trim()) clearError(this);
            });
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name    = document.getElementById('name');
            const email   = document.getElementById('email');
            const phone   = document.getElementById('phone');
            const message = document.getElementById('message');
            let isValid   = true;

            if (!name.value.trim()) {
                showError(name, 'Por favor, preencha o seu nome completo.');
                isValid = false;
            } else { clearError(name); }

            if (!email.value.trim()) {
                showError(email, 'Por favor, informe o seu e-mail.');
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                showError(email, 'Por favor, informe um e-mail valido.');
                isValid = false;
            } else { clearError(email); }

            if (!phone.value.trim()) {
                showError(phone, 'Por favor, informe o seu numero de WhatsApp.');
                isValid = false;
            } else if (phone.value.replace(/\D/g, '').length < 11) {
                showError(phone, 'Numero incompleto. Ex: (62) 9 9999-9999');
                isValid = false;
            } else { clearError(phone); }

            if (!message.value.trim()) {
                showError(message, 'Por favor, descreva a sua duvida ou mensagem.');
                isValid = false;
            } else { clearError(message); }

            if (!isValid) return;

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const textoOriginal = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            fetch(contactForm.action, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(contactForm)
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.success) {
                    const formContainer = document.querySelector('.form-container');
                    const successDiv = document.getElementById('form-success');
                    formContainer.style.display = 'none';
                    successDiv.style.display = 'flex';
                    lucide.createIcons();
                    contactForm.reset();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    submitBtn.textContent = textoOriginal;
                    submitBtn.disabled = false;
                    alert('Ocorreu um erro ao enviar. Tente novamente.');
                }
            })
            .catch(function() {
                submitBtn.textContent = textoOriginal;
                submitBtn.disabled = false;
                alert('Ocorreu um erro ao enviar. Tente novamente.');
            });
        });
    }
});