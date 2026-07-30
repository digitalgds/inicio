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
    // Formulario: validacao inline + envio AJAX
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
                    // Exibe mensagem de sucesso no lugar do formulario
                    const formContainer = document.querySelector('.form-container');
                    const successDiv    = document.getElementById('form-success');
                    formContainer.style.display = 'none';
                    successDiv.style.display    = 'flex';
                    lucide.createIcons();

                    // Aguarda 5 segundos e recarrega a pagina (limpa tudo e volta ao topo)
                    setTimeout(function() {
                        window.location.href = window.location.pathname;
                    }, 5000);

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

    // =======================================================
    // Seletor de Faturamento Interativo (Toggle Mensal/Anual)
    // =======================================================
    const btnMonthly = document.getElementById('billing-monthly');
    const btnAnnual  = document.getElementById('billing-annual');

    const priceStarter    = document.getElementById('price-starter');
    const pricePro        = document.getElementById('price-pro');
    const priceUltra      = document.getElementById('price-ultra');

    const oldPriceStarter = document.getElementById('old-price-starter');
    const oldPricePro     = document.getElementById('old-price-pro');
    const oldPriceUltra   = document.getElementById('old-price-ultra');

    const termsStarter    = document.getElementById('terms-starter');
    const termsPro        = document.getElementById('terms-pro');
    const termsUltra      = document.getElementById('terms-ultra');

    const periodStarter   = document.getElementById('period-starter');
    const periodPro       = document.getElementById('period-pro');

    const btnStarter      = document.getElementById('btn-starter');
    const btnPro          = document.getElementById('btn-pro');
    const btnUltra        = document.getElementById('btn-ultra');

    const tagPro          = document.getElementById('tag-pro');
    const tagStarter      = document.getElementById('tag-starter');

    const descStarter     = document.getElementById('desc-starter');
    const descPro         = document.getElementById('desc-pro');
    const descUltra       = document.getElementById('desc-ultra');

    if (btnMonthly && btnAnnual) {
        
        function updatePricing(billingMode) {
            // Elementos para aplicar transição suave de fade
            const animateElements = [
                priceStarter, pricePro, priceUltra, 
                oldPriceStarter, oldPricePro, oldPriceUltra, 
                termsStarter, termsPro, termsUltra, 
                periodStarter, periodPro, tagPro, tagStarter,
                descStarter, descPro, descUltra,
                btnStarter, btnPro, btnUltra
            ];
            
            animateElements.forEach(el => {
                if (el) {
                    el.style.opacity = '0';
                    el.style.transform = 'scale(0.99)';
                    el.style.transition = 'all 0.15s ease-in-out';
                }
            });

            setTimeout(() => {
                if (billingMode === 'annual') {
                    // Ativa botão Anual
                    btnAnnual.classList.add('active');
                    btnMonthly.classList.remove('active');

                    // --- STARTER ANUAL ---
                    if (priceStarter) priceStarter.textContent = '850';
                    if (periodStarter) periodStarter.textContent = '/ano';
                    if (oldPriceStarter) {
                        oldPriceStarter.style.visibility = 'visible';
                        oldPriceStarter.style.textDecoration = 'none';
                        oldPriceStarter.textContent = 'Economize R$ 914';
                    }
                    if (termsStarter) termsStarter.textContent = 'Hospedagem inclusa por 12 meses • R$ 850 à vista';
                    if (tagStarter) tagStarter.textContent = 'MELHOR VALOR ANUAL';
                    if (descStarter) descStarter.textContent = 'Ideal para profissionais e pequenos negócios que querem contratar uma landing page profissional por 12 meses com pagamento anual e sem domínio próprio.';
                    if (btnStarter) {
                        btnStarter.textContent = 'QUERO CONTRATAR O STARTER ANUAL';
                        btnStarter.href = "https://wa.me/5562998834515?text=Ol%C3%A1%21%20Tenho%20interesse%20no%20Plano%20Starter%20anual%20da%20Digital%20GDS%2C%20no%20valor%20de%20R%24%20850%20por%2012%20meses%2C%20e%20gostaria%20de%20receber%20mais%20informa%C3%A7%C3%B5es.";
                    }

                    // --- PRO ANUAL ---
                    if (pricePro) pricePro.textContent = '850';
                    if (periodPro) periodPro.textContent = '/ano';
                    if (oldPricePro) {
                        oldPricePro.style.visibility = 'visible';
                        oldPricePro.style.textDecoration = 'none';
                        oldPricePro.textContent = 'R$ 287 de implantação';
                    }
                    if (termsPro) termsPro.textContent = 'Economize R$ 314 • Total do 1º ano: R$ 1.137';
                    if (tagPro) {
                        tagPro.style.display = 'inline-block';
                        tagPro.textContent = 'Economize R$ 314';
                    }
                    if (descPro) descPro.textContent = 'Ideal para empresas que querem uma landing page com domínio próprio, endereço profissional e pagamento anual da hospedagem.';
                    if (btnPro) {
                        btnPro.textContent = 'QUERO O PLANO PRO ANUAL';
                        btnPro.href = "https://wa.me/5562998834515?text=Ol%C3%A1%21%20Tenho%20interesse%20no%20Plano%20Pro%20anual%20da%20Digital%20GDS%2C%20com%20implanta%C3%A7%C3%A3o%20de%20R%24%20287%20e%20anuidade%20de%20R%24%20850%2C%20e%20gostaria%20de%20receber%20mais%20informa%C3%A7%C3%B5es.";
                    }

                    // --- ULTRA ANUAL ---
                    if (priceUltra) priceUltra.textContent = 'ORÇAMENTO PERSONALIZADO';
                    if (termsUltra) termsUltra.textContent = 'Condições anuais definidas após diagnóstico';
                    if (descUltra) descUltra.textContent = 'Ideal para empresas que precisam de uma estrutura digital personalizada, com implantação e serviços recorrentes definidos conforme a necessidade do negócio.';
                    if (btnUltra) {
                        btnUltra.textContent = 'SOLICITAR PROPOSTA PERSONALIZADA';
                        btnUltra.href = "https://wa.me/5562998834515?text=Ol%C3%A1%21%20Tenho%20interesse%20no%20Plano%20Ultra%20da%20Digital%20GDS%20e%20gostaria%20de%20solicitar%20uma%20proposta%20personalizada%20para%20o%20meu%20neg%C3%B3cio.";
                    }

                } else {
                    // Ativa botão Mensal
                    btnMonthly.classList.add('active');
                    btnAnnual.classList.remove('active');

                    // --- STARTER MENSAL ---
                    if (priceStarter) priceStarter.textContent = '147';
                    if (periodStarter) periodStarter.textContent = '/mês';
                    if (oldPriceStarter) {
                        oldPriceStarter.style.visibility = 'hidden';
                        oldPriceStarter.innerHTML = '&nbsp;';
                    }
                    if (termsStarter) termsStarter.textContent = 'Sem taxa de implantação • Durante 12 meses';
                    if (tagStarter) tagStarter.textContent = 'COMECE SEM ENTRADA';
                    if (descStarter) descStarter.textContent = 'Ideal para profissionais e pequenos negócios que querem começar com uma landing page profissional sem pagar taxa inicial.';
                    if (btnStarter) {
                        btnStarter.textContent = 'QUERO COMEÇAR SEM ENTRADA';
                        btnStarter.href = "https://wa.me/5562998834515?text=Ol%C3%A1%21%20Tenho%20interesse%20no%20Plano%20Starter%20mensal%20da%20Digital%20GDS.%20Gostaria%20de%20receber%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20landing%20page%20sem%20taxa%20de%20implanta%C3%A7%C3%A3o.";
                    }

                    // --- PRO MENSAL ---
                    if (pricePro) pricePro.textContent = '97';
                    if (periodPro) periodPro.textContent = '/mês';
                    if (oldPricePro) {
                        oldPricePro.style.visibility = 'visible';
                        oldPricePro.style.textDecoration = 'none';
                        oldPricePro.textContent = 'R$ 287 de implantação';
                    }
                    if (termsPro) termsPro.textContent = 'Primeira mensalidade após 30 dias';
                    if (tagPro) {
                        tagPro.style.display = 'inline-block';
                        tagPro.textContent = 'Popular';
                    }
                    if (descPro) descPro.textContent = 'Ideal para empresas que querem uma landing page com domínio próprio, endereço profissional na internet e uma mensalidade mais acessível.';
                    if (btnPro) {
                        btnPro.textContent = 'QUERO MEU DOMÍNIO PRÓPRIO';
                        btnPro.href = "https://wa.me/5562998834515?text=Ol%C3%A1%21%20Tenho%20interesse%20no%20Plano%20Pro%20mensal%20da%20Digital%20GDS.%20Gostaria%20de%20receber%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20landing%20page%20com%20dom%C3%ADnio%20pr%C3%B3prio.";
                    }

                    // --- ULTRA MENSAL ---
                    if (priceUltra) priceUltra.textContent = 'ORÇAMENTO PERSONALIZADO';
                    if (termsUltra) termsUltra.textContent = 'O investimento será definido após uma análise da necessidade do negócio.';
                    if (descUltra) descUltra.textContent = 'Ideal para empresas que precisam de uma estrutura digital desenvolvida conforme seus objetivos, produtos, serviços e necessidade de crescimento.';
                    if (btnUltra) {
                        btnUltra.textContent = 'SOLICITAR ANÁLISE PERSONALIZADA';
                        btnUltra.href = "https://wa.me/5562998834515?text=Ol%C3%A1%21%20Tenho%20interesse%20no%20Plano%20Ultra%20da%20Digital%20GDS%20e%20gostaria%20de%20solicitar%20uma%20an%C3%A1lise%20personalizada%20para%20o%20meu%20neg%C3%B3cio.";
                    }
                }

                // Finaliza animação com fade-in e retorno ao tamanho original
                animateElements.forEach(el => {
                    if (el) {
                        el.style.opacity = '1';
                        el.style.transform = 'scale(1)';
                    }
                });
            }, 150);
        }

        btnMonthly.addEventListener('click', () => {
            if (!btnMonthly.classList.contains('active')) {
                updatePricing('monthly');
            }
        });

        btnAnnual.addEventListener('click', () => {
            if (!btnAnnual.classList.contains('active')) {
                updatePricing('annual');
            }
        });
    }

    // =======================================================
    // Biblioteca de Modelos por Nicho — Modal dinamico
    // =======================================================
    const TEMPLATES_DATA = [
      {
        "id": "grama-sintetica",
        "title": "Grama Sintética",
        "iconName": "sprout",
        "sites": [
          {
            "name": "Quanta Grama Sintética",
            "url": "https://quantagramasintetica.com/",
            "desc": "Modelo focado em venda direta de revestimentos e gramas decorativas."
          }
        ]
      },
      {
        "id": "advocacia",
        "title": "Advocacia",
        "iconName": "scale",
        "sites": [
          {
            "name": "Rodrigo Parente Advogados",
            "url": "https://rodrigoparenteadvogados.com/",
            "desc": "Modelo tradicional com tom corporativo clássico."
          },
          {
            "name": "Haline Cardoso",
            "url": "https://halinecardoso.github.io/",
            "desc": "Design moderno focado no posicionamento individual."
          },
          {
            "name": "Borges Almeida Advogados",
            "url": "https://baadvs.com.br/",
            "desc": "Modelo moderno com estética premium focado em advocacia empresarial."
          },
          {
            "name": "Weber Fernandes Advocacia",
            "url": "https://weberfernandesadv.github.io/",
            "desc": "Modelo moderno com posicionamento de autoridade e alta conversão jurídica."
          }
        ]
      },
      {
        "id": "vidracaria",
        "title": "Vidraçaria",
        "iconName": "grid",
        "sites": [
          {
            "name": "Vidraçaria JF",
            "url": "https://vidracariajf.com/",
            "desc": "Modelo de showroom comercial com conversão rápida no WhatsApp."
          }
        ]
      },
      {
        "id": "locacoes",
        "title": "Locações",
        "iconName": "hammer",
        "sites": [
          {
            "name": "Ricco Locações",
            "url": "https://riccolocacoes.github.io/",
            "desc": "Modelo estruturado com listagem de catálogo de produtos de locação."
          }
        ]
      },
      {
        "id": "iluminacao",
        "title": "Iluminação",
        "iconName": "lightbulb",
        "sites": [
          {
            "name": "Geometria da Luz",
            "url": "https://geometriadaluz.github.io/",
            "desc": "Modelo voltado a arquitetura e automação de iluminação."
          },
          {
            "name": "La Luz Iluminação",
            "url": "https://laluziluminacao.github.io/",
            "desc": "Showroom de luminárias e pendentes decorativos."
          },
          {
            "name": "Luz de Led",
            "url": "https://luzdeled.github.io/",
            "desc": "Showroom de fitas LED, perfis e iluminação moderna."
          }
        ]
      },
      {
        "id": "eletromoveis",
        "title": "Eletromóveis",
        "iconName": "armchair",
        "sites": [
          {
            "name": "Eletromóveis",
            "url": "https://eletromoveis.github.io/",
            "desc": "Modelo focado no varejo de móveis e eletrodomésticos sob medida."
          }
        ]
      },
      {
        "id": "agencia",
        "title": "Agência",
        "iconName": "briefcase",
        "sites": [
          {
            "name": "Cognição Digital",
            "url": "https://cognicaodigittal.com/",
            "desc": "Site oficial com o portfólio completo de ecossistemas digitais."
          }
        ]
      },
      {
        "id": "consultoria",
        "title": "Consultoria",
        "iconName": "brain",
        "sites": [
          {
            "name": "Midnight Executive Layout",
            "url": "https://cognicaodigittal.com/",
            "desc": "Modelo premium focado em posicionamento executivo de autoridade."
          }
        ]
      },
      {
        "id": "psicologia",
        "title": "Psicologia",
        "iconName": "users",
        "sites": [
          {
            "name": "Mylena Psicóloga",
            "url": "https://mylenapsi.github.io/",
            "desc": "Modelo focado em captação de pacientes para psicologia clínica."
          },
          {
            "name": "Psicologia Clínica",
            "url": "https://psicologiaclinica.github.io/",
            "desc": "Layout suave focado em acolhimento e agendamentos de sessões."
          }
        ]
      }
    ];

    const categoryCards = document.querySelectorAll('.category-card');
    const templateModal  = document.getElementById('template-modal');
    const modalOverlay   = document.getElementById('template-modal-overlay');
    const modalCloseBtn  = document.getElementById('template-modal-close');
    const modalTitle     = document.getElementById('modal-category-title');
    const modalIconContainer = document.getElementById('modal-icon-container');
    const modalLayoutsList   = document.getElementById('modal-layouts-list');

    if (categoryCards.length > 0 && templateModal) {
        
        const openModal = (categoryData) => {
            if (!categoryData) return;

            // Injeta dados no Modal
            modalTitle.textContent = categoryData.title;
            
            // Injeta icone Lucide
            modalIconContainer.innerHTML = `<i data-lucide="${categoryData.iconName}" class="modal-main-icon"></i>`;

            // Renderiza lista de modelos
            modalLayoutsList.innerHTML = '';
            categoryData.sites.forEach(site => {
                const layoutElement = document.createElement('div');
                layoutElement.className = 'modal-layout-item';
                layoutElement.innerHTML = `
                    <div class="layout-item-info">
                        <h4 class="layout-item-title">${site.name}</h4>
                        <p class="layout-item-desc">${site.desc}</p>
                    </div>
                    <div class="layout-item-action">
                        <button class="btn-view-model" data-url="${site.url}" data-name="${site.name}">
                            Visualizar Modelo <i data-lucide="eye"></i>
                        </button>
                    </div>
                `;
                modalLayoutsList.appendChild(layoutElement);
            });

            // Recria os icones Lucide recem-injetados
            lucide.createIcons();

            // Ativa o modal
            templateModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Impede rolagem da pagina de fundo
        };

        const closeModal = () => {
            templateModal.classList.remove('active');
            document.body.style.overflow = ''; // Restaura rolagem da pagina
        };

        // Vincula cliques aos cards de categorias
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const categoryId = card.getAttribute('data-category');
                const categoryData = TEMPLATES_DATA.find(item => item.id === categoryId);
                openModal(categoryData);
            });
        });

        // Fechar ao clicar no botao Fechar [X]
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }

        // Fechar ao clicar fora (no overlay)
        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }

        // Fechar ao pressionar ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && templateModal.classList.contains('active')) {
                closeModal();
            }
        });
    }


    // =======================================================
    // Menu Hamburguer Responsivo Premium
    // =======================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks   = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        const toggleMenu = () => {
            const isActive = menuToggle.classList.contains('active');
            
            if (isActive) {
                // Fechar menu
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = ''; // Restaura rolagem
            } else {
                // Abrir menu
                menuToggle.classList.add('active');
                navLinks.classList.add('active');
                menuToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden'; // Impede rolagem
            }
        };

        const closeMenu = () => {
            if (menuToggle.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        };

        menuToggle.addEventListener('click', toggleMenu);

        // Fecha o menu automaticamente quando um link e clicado
        const navAnchorLinks = navLinks.querySelectorAll('a');
        navAnchorLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Fecha o menu se a tela for redimensionada para desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }


    // =======================================================
    // Modal Simulador em Tela Cheia (Iframe Mask)
    // =======================================================
    const simulatorModal = document.getElementById('simulator-modal');
    const simulatorIframe = document.getElementById('simulator-iframe');
    const simulatorLoader = document.getElementById('simulator-loader');
    const simulatorTitle = document.getElementById('simulator-title');
    const simulatorBtnClose = document.getElementById('simulator-btn-close');
    const simulatorBtnCta = document.getElementById('simulator-btn-cta');

    if (simulatorModal && simulatorIframe && simulatorLoader) {
        
        const openSimulator = (url, name) => {
            // Define o titulo no topo
            if (simulatorTitle) {
                simulatorTitle.textContent = `Modelo: ${name}`;
            }

            // Define o link personalizado no CTA do WhatsApp
            if (simulatorBtnCta) {
                const messageText = `Olá, Leonardo! Gostei muito do modelo "${name}" e gostaria de solicitar um orçamento para o meu negócio.`;
                const encodedMsg = encodeURIComponent(messageText);
                simulatorBtnCta.href = `https://wa.me/5562998834515?text=${encodedMsg}`;
            }

            // Reseta loader e carrega iframe
            simulatorLoader.classList.remove('hidden');
            simulatorIframe.src = url;

            // Abre o modal simulador (fica por cima de tudo)
            simulatorModal.classList.add('active');
            
            // Impede rolagem do body se ja nao estiver impedido
            document.body.style.overflow = 'hidden';
        };

        const closeSimulator = () => {
            // Oculta o modal
            simulatorModal.classList.remove('active');
            
            // Se o modal de categorias nao estiver aberto, restaura o scroll do body
            const categoryModal = document.getElementById('template-modal');
            if (categoryModal && !categoryModal.classList.contains('active')) {
                document.body.style.overflow = '';
            }

            // Limpa o iframe para parar carregamentos e scripts em segundo plano
            setTimeout(() => {
                simulatorIframe.src = '';
            }, 300);
        };

        // Evento onload do iframe para ocultar o spinner de carregamento
        simulatorIframe.addEventListener('load', () => {
            if (simulatorIframe.src && simulatorIframe.src !== 'about:blank') {
                simulatorLoader.classList.add('hidden');
            }
        });

        // Evento do botao fechar / voltar
        if (simulatorBtnClose) {
            simulatorBtnClose.addEventListener('click', closeSimulator);
        }

        // Intercepta cliques nos botoes de visualizar modelo no modal de categorias (Event Delegation)
        const layoutsList = document.getElementById('modal-layouts-list');
        if (layoutsList) {
            layoutsList.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-view-model');
                if (btn) {
                    e.preventDefault();
                    const url = btn.getAttribute('data-url');
                    const name = btn.getAttribute('data-name');
                    openSimulator(url, name);
                }
            });
        }
    }

});