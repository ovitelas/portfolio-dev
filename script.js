

document.addEventListener('DOMContentLoaded', function () {
    // --- Lógica de Alternância de Tema ---
    const htmlElement = document.firstElementChild; // Referência à tag <html>
    const themeToggleButton = document.getElementById('theme-toggle'); // Referência ao botão de alternância
    const storageKey = 'theme-preference'; // Chave para armazenar a preferência de tema no localStorage

    // Função para determinar a preferência de cor inicial
    const getColorPreference = () => {
        const storedTheme = localStorage.getItem(storageKey);
        if (storedTheme) {
            return storedTheme; // Preferência do usuário armazenada (maior prioridade)
        }
        // Se não houver preferência armazenada, verificar a preferência do sistema.
        // Se o sistema for escuro, usar escuro. Caso contrário, usar o padrão do site (escuro).
        // Isso garante que o tema escuro seja o padrão se nenhuma preferência for encontrada.
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark';
    };

    let currentThemeSetting = getColorPreference(); // Inicializa o tema atual com base na cascata

    // Função para aplicar o tema ao DOM e atualizar o aria-label do botão
    const reflectPreference = () => {
        htmlElement.setAttribute('data-theme', currentThemeSetting);
        if (themeToggleButton) { // Verifica se o botão existe para evitar erros
            themeToggleButton.setAttribute('aria-label',
                currentThemeSetting === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'
            );
        }
    };

    // Função para salvar a preferência no localStorage e refletir no DOM
    const setPreference = () => {
        localStorage.setItem(storageKey, currentThemeSetting);
        reflectPreference();
    };

    // Lógica para alternar o tema ao clicar no botão
    const onClickThemeToggle = () => {
        currentThemeSetting = currentThemeSetting === 'light' ? 'dark' : 'light';
        setPreference();
    };

    // Aplica o tema o mais cedo possível para evitar FOUC (Flash de Conteúdo Não Estilizado)
    // Garante que o tema correto seja aplicado antes que o restante do DOM seja renderizado.
    reflectPreference();

    // Sincroniza com as mudanças nas preferências de tema do sistema operacional
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches: isDark }) => {
        currentThemeSetting = isDark ? 'dark' : 'light';
        setPreference();
    });
    // --- Fim da Lógica de Alternância de Tema ---


    // Debounce para eventos de scroll/resize
    function debounce(func, wait = 100) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Navbar Shrink on Scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.onscroll = debounce(function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Menu Mobile (Burger)
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');

    if (burger && navMenu) {
        burger.addEventListener('click', () => {
            const isActive = !burger.classList.contains('active');
            burger.classList.toggle('active');
            navMenu.classList.toggle('active');
            burger.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (navMenu.classList.contains('active')) {
                    burger.classList.remove('active');
                    navMenu.classList.remove('active');
                    burger.setAttribute('aria-expanded', false);
                    document.body.style.overflow = '';
                }
                
                // Scroll suave
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Animação Números Binários (Hero)
    const floatingNumbersContainer = document.querySelector('.floating-numbers');
    if (floatingNumbersContainer) {
        const numberOfDigits = 50;
        // animationActive não é mais usado diretamente para pausar/retomar,
        // mas pode ser útil para outras lógicas se necessário.
        // let animationActive = true; 

        function createBinaryDigit() {
            const digit = document.createElement('span');
            digit.classList.add('binary-digit');
            digit.textContent = Math.random() > 0.5 ? '1' : '0';
            digit.style.left = `${Math.random() * 100}%`;
            
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            digit.style.animationDuration = `${duration}s`;
            digit.style.animationDelay = `-${delay}s`;
            
            floatingNumbersContainer.appendChild(digit);
            
            // Remove o dígito após a animação
            setTimeout(() => {
                if (digit.parentNode) {
                    digit.remove();
                }
            }, (duration + delay + 1) * 1000); // Garante a remoção após o ciclo completo da animação
        }

        // Inicializar dígitos
        for (let i = 0; i < numberOfDigits; i++) {
            createBinaryDigit();
        }
        
        // Otimizar performance: (comentado, pois as animações CSS já são pausadas por visibilidade)
        // document.addEventListener('visibilitychange', () => {
        //     animationActive = !document.hidden;
        // });
    }

    // Filtro de Projetos
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || filter === category) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // EmailJS com validação

    
    const contactForm = document.getElementById("contact-form");
    
    // Sanitização de inputs
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            // Validação de email
            const emailInput = document.getElementById('email');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                console.warn("Por favor, insira um email válido."); // Usando console.warn no lugar de alert
                // Pode adicionar feedback visual para o usuário aqui, como um span de erro
                return;
            }
            
            // Sanitizar inputs (Embora os valores não sejam usados diretamente no emailjs.sendForm(this),
            // a sanitização ainda é uma boa prática para outros usos ou validações futuras)
            const name = sanitizeInput(document.getElementById('name').value);
            const message = sanitizeInput(document.getElementById('message').value);
            const subject = sanitizeInput(document.getElementById('subject').value);
            
            // Feedback visual
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = "Enviando...";
            submitButton.disabled = true;
            
            // Enviar formulário
            // *** AQUI É ONDE AS ALTERAÇÕES SÃO FEITAS ***
            // Substitua "YOUR_SERVICE_ID" e "YOUR_TEMPLATE_ID" pelos seus IDs reais do EmailJS.
            // O User ID já é inicializado no seu HTML (<script> emailjs.init("nZywUTOzS3N8nGaZQ"); </script>)
            emailjs.sendForm("service_k6gzw9p", "template_qhdevdm", this) // Use seus IDs reais aqui
                .then(() => {
                    console.log("Mensagem enviada com sucesso!"); // Usando console.log no lugar de alert
                    // Adicione uma mensagem de sucesso mais amigável ao usuário, se desejar
                    alert("Sua mensagem foi enviada com sucesso!");
                    contactForm.reset(); // Limpa o formulário após o envio
                }, (error) => {
                    console.error("Erro ao enviar: " + error.text); // Usando console.error no lugar de alert
                    // Adicione uma mensagem de erro mais amigável ao usuário
                    alert("Ops! Ocorreu um erro ao enviar a mensagem. Tente novamente mais tarde.");
                })
                .finally(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
        });
    }
    
    // Prefetch de imagens
    if (window.innerWidth > 768) {
        const links = ['#about', '#projects', '#contact'];
        links.forEach(link => {
            const section = document.querySelector(link);
            if (section) {
                const img = section.querySelector('img');
                if (img) {
                    const linkElement = document.createElement('link'); // Renomeado para evitar conflito
                    linkElement.rel = 'prefetch';
                    linkElement.href = img.src;
                    document.head.appendChild(linkElement);
                }
            }
        });
    }
    
    // Remover skeleton após carregamento
    window.addEventListener('load', () => {
        document.querySelectorAll('.project-image').forEach(img => {
            img.classList.remove('loading');
        });
        // Garante que o listener do botão de tema seja anexado após o DOM estar pronto
        if (themeToggleButton) {
            themeToggleButton.addEventListener('click', onClickThemeToggle);
        }
    });

    // Atualizar ano no Copyright
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Destaque de link ativo
    const sections = document.querySelectorAll('section[id]');
    const navLi = document.querySelectorAll('nav .nav-menu li a');

    if (sections.length > 0 && navLi.length > 0) {
        window.addEventListener('scroll', debounce(() => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                // Ajusta o offset para considerar a altura da navbar fixa
                if (window.scrollY >= (sectionTop - navbar.offsetHeight - 20)) { // Adicionado offset extra
                    current = section.getAttribute('id');
                }
            });
            
            navLi.forEach(a => {
                a.classList.remove('active-link');
                if (a.getAttribute('href').includes(current)) {
                    a.classList.add('active-link');
                }
            });
            
            // Lógica para destacar "Home" quando no topo da página
            if (window.scrollY < sections[0].offsetTop - (navbar.offsetHeight + 20)) {
                navLi.forEach(a => a.classList.remove('active-link'));
                const homeLink = document.querySelector('nav .nav-menu a[href="#home"]');
                if (homeLink) homeLink.classList.add('active-link');
            }
        }));
        
        // Ativa o link "Home" por padrão ao carregar a página
        const homeLink = document.querySelector('nav .nav-menu a[href="#home"]');
        if (homeLink) homeLink.classList.add('active-link');
    }
});