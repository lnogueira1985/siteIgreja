document.addEventListener('DOMContentLoaded', function() {
    // --- Carrossel de Notícias ---
    const newsCarousel = document.getElementById('newsCarousel');
    const carouselDotsContainer = document.getElementById('carouselDots');

    if (newsCarousel && carouselDotsContainer) {
        const newsCards = newsCarousel.querySelectorAll('.news-card');
        const totalCards = newsCards.length;
        let currentIndex = 0;
        const slideInterval = 2000; // Tempo em milissegundos (5 segundos)

        // Calcula quantos cards serão exibidos por vez na tela atual
        function getCardsVisible() {
            if (window.innerWidth <= 576) {
                return 1; // Para celulares (1 card por vez)
            } else if (window.innerWidth <= 768) {
                return 2; // Para tablets (2 cards por vez)
            } else {
                return 3; // Padrão para desktop (3 cards por vez)
            }
        }

        let numPages; // Declarar numPages fora da função para ser acessível globalmente no escopo

        // --- Funções para Bolinhas de Paginação ---

        // Cria as bolinhas dinamicamente
        function createDots() {
            carouselDotsContainer.innerHTML = ''; // Limpa bolinhas existentes antes de recriar (útil no resize)
            numPages = Math.ceil(totalCards / getCardsVisible()); // Recalcula o número de páginas

            for (let i = 0; i < numPages; i++) {
                const dot = document.createElement('span');
                dot.classList.add('carousel-dot');
                dot.dataset.pageIndex = i; // Armazena o índice da página
                dot.addEventListener('click', () => {
                    // Ao clicar em uma bolinha, o currentIndex vai para o início da página correspondente
                    currentIndex = i * getCardsVisible();
                    updateCarousel();
                    resetAutoSlideInterval(); // Reseta o intervalo automático após clique do usuário
                });
                carouselDotsContainer.appendChild(dot);
            }
            updateDots(); // Atualiza o estado ativo das bolinhas
        }

        // Atualiza a bolinha ativa
        function updateDots() {
            const dots = carouselDotsContainer.querySelectorAll('.carousel-dot');
            // Calcula qual página o currentIndex atual representa
            const activePageIndex = Math.floor(currentIndex / getCardsVisible());

            dots.forEach((dot, index) => {
                if (index === activePageIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // --- Funções do Carrossel Principal ---

        // Função para atualizar a posição do carrossel
        function updateCarousel() {
            const firstCard = newsCards[0];
            if (!firstCard) return;

            // A margem direita do CSS é 30px, então a largura efetiva de um "passo" é a largura do card + 30px
            const cardWidthWithGap = firstCard.offsetWidth + 30;

            // Calcula o deslocamento total para o slide atual
            const offset = currentIndex * cardWidthWithGap;
            newsCarousel.style.transform = `translateX(${-offset}px)`;

            // Atualiza as bolinhas ativas
            updateDots();

            // Lógica de loop: se chegarmos ao final dos cards visíveis, reiniciamos para o começo
            const cardsVisible = getCardsVisible();
            // O último índice possível para o currentIndex antes de precisar resetar
            const lastPossibleIndex = totalCards - cardsVisible;

            if (currentIndex > lastPossibleIndex) {
                // Espera a transição atual terminar (0.5s do CSS) para fazer o "reset" invisível
                setTimeout(() => {
                    newsCarousel.style.transition = 'none'; // Desativa a transição
                    currentIndex = 0; // Reinicia o índice
                    newsCarousel.style.transform = `translateX(0px)`; // Volta para o início

                    // Pequeno atraso para garantir que a transição foi desativada antes de reativar
                    setTimeout(() => {
                        newsCarousel.style.transition = 'transform 0.5s ease-in-out'; // Reativa a transição
                        updateDots(); // Atualiza as bolinhas após o reset
                    }, 50);
                }, 500);
            }
        }

        // Função para ir para o próximo slide
        function goToNextSlide() {
            currentIndex++;
            updateCarousel();
        }

        // --- Controle do Intervalo Automático ---
        let autoSlideIntervalId;

        function startAutoSlide() {
            stopAutoSlide(); // Garante que não há múltiplos intervalos rodando
            autoSlideIntervalId = setInterval(goToNextSlide, slideInterval);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideIntervalId);
        }

        function resetAutoSlideInterval() {
            stopAutoSlide();
            startAutoSlide();
        }

        // --- Inicialização do Carrossel ---
        createDots();
        updateCarousel(); // Posição inicial
        startAutoSlide(); // Inicia o slide automático

        // Pausar/Retomar no hover
        newsCarousel.addEventListener('mouseenter', stopAutoSlide);
        newsCarousel.addEventListener('mouseleave', startAutoSlide);

        // Ajuste responsivo ao redimensionar a janela
        window.addEventListener('resize', () => {
            // Resetar o currentIndex para 0 e recriar dots ao redimensionar para evitar posições quebradas
            currentIndex = 0;
            createDots(); // Recria as bolinhas com base no novo número de cards visíveis
            updateCarousel(); // Atualiza a posição
            resetAutoSlideInterval(); // Reseta o slide automático
        });
    } else {
        console.warn("Elementos do carrossel de notícias não encontrados. O carrossel não será inicializado.");
    }


    // --- Modal de Comunidades (ATUALIZADO) ---
    // ATENÇÃO: communityModal agora é 'community-modal' conforme seu HTML
    const communityModal = document.getElementById('community-modal');
    const closeButton = document.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-community-title');
    const modalImage = document.getElementById('modal-community-image');
    const modalDescription = document.getElementById('modal-community-description');

    // ATENÇÃO: IDs das variáveis agora correspondem aos IDs do seu HTML
    const modalAddress = document.getElementById('modal-community-address');
    const modalMassTimes = document.getElementById('modal-community-mass-times');
    const modalContact = document.getElementById('modal-community-contact'); // Este ID já batia
    const modalPastorals = document.getElementById('modal-community-pastorals');
    const modalBtnMoreInfo = document.querySelector('.modal-btn-more-info'); // Para o botão "Saiba Mais"

    const communityCards = document.querySelectorAll('.communities-grid .common-card');

    // Dados de exemplo para as comunidades. Em um projeto real, isso viria de uma API ou JSON.
    const communityData = {
        "jovens-adultos": {
            title: "Comunidade de Jovens Adultos",
            image: "assets/img/community-jovens-adultos.jpg",
            description: "Esta comunidade vibrante reúne jovens adultos para discutir temas relevantes à fé e vida, promover a conexão entre seus membros e engajar-se em serviço à comunidade. Oferecemos um ambiente acolhedor para crescimento espiritual e pessoal, com eventos sociais, estudos bíblicos aprofundados e oportunidades de voluntariado.",
            address: "Rua Exemplo, 123 - Centro",
            massTimes: "Sextas-feiras, 19:30h",
            contact: "email@exemplo.com.br",
            pastorals: "Juventude, Eventos, Ação Social",
            moreInfoLink: "#" // Link para a página específica da comunidade
        },
        "familias": {
            title: "Comunidade de Famílias",
            image: "assets/img/community-familias.jpg",
            description: "Nossa comunidade de famílias oferece suporte e recursos para pais e filhos de todas as idades. Focamos no fortalecimento dos laços familiares através de atividades conjuntas, workshops sobre criação de filhos, aconselhamento e momentos de oração. Um espaço seguro para compartilhar desafios e celebrar as alegrias da vida familiar.",
            address: "Av. Principal, 456 - Bairro Feliz",
            massTimes: "Domingos, 10:00h (Culto Infantil e de Famílias)",
            contact: "(92) 98765-4321",
            pastorals: "Casais, Crianças, Educação Familiar",
            moreInfoLink: "#"
        },
        "senhoras": {
            title: "Comunidade de Senhoras",
            image: "assets/img/community-senhoras.jpg",
            description: "Um espaço dedicado às mulheres de todas as gerações para crescimento espiritual, encorajamento e comunhão. Realizamos encontros para estudos da palavra, oração, compartilhamento de experiências de vida e apoio mútuo. Eventos especiais e retiros são organizados regularmente para fortalecer a fé e a amizade.",
            address: "Igreja Matriz - Sala das Rosas",
            massTimes: "Quartas-feiras, 15:00h (Grupo de Oração)",
            contact: "secretaria@igreja.org",
            pastorals: "Oração, Missões, Apoio Feminino",
            moreInfoLink: "#"
        },
        "homens": {
            title: "Comunidade de Homens",
            image: "assets/img/community-homens.jpg",
            description: "A Comunidade de Homens busca inspirar e equipar os homens a viverem com propósito e integridade. Através de grupos de estudo, eventos de confraternização e projetos de serviço, incentivamos a liderança servidora, a responsabilidade familiar e o desenvolvimento de um caráter cristão sólido.",
            address: "Centro Comunitário - Sala Azul",
            massTimes: "Sábados, 09:00h (Café da Manhã e Estudo)",
            contact: "contato.homens@igreja.com",
            pastorals: "Liderança, Mentoria, Esportes",
            moreInfoLink: "#"
        },
        "adolescentes": {
            title: "Comunidade de Adolescentes",
            image: "assets/img/community-adolescentes.jpg",
            description: "Um lugar dinâmico e divertido para adolescentes explorarem sua fé, construírem amizades duradouras e descobrirem seu potencial. Com atividades interativas, discussões relevantes e eventos sociais, ajudamos os jovens a navegar pelos desafios da adolescência com uma base sólida de valores e fé.",
            address: "Salão Jovem - Anexo da Igreja",
            massTimes: "Sextas-feiras, 18:00h (Encontro de Jovens)",
            contact: "adolescentes@igreja.org",
            pastorals: "Louvor Jovem, Gincanas, Estudo Bíblico",
            moreInfoLink: "#"
        },
        "criancas": {
            title: "Comunidade de Crianças",
            image: "assets/img/community-criancas.jpg",
            description: "Nossa Comunidade de Crianças oferece um ambiente seguro e divertido onde os pequenos podem aprender sobre a fé de forma criativa e interativa. Com histórias bíblicas, jogos, músicas e atividades lúdicas, cultivamos valores cristãos e plantamos sementes de fé desde cedo.",
            address: "Salas de Educação Cristã",
            massTimes: "Domingos, durante o culto principal",
            contact: "pastoralinfantil@igreja.com",
            pastorals: "Ministério Infantil, Contação de Histórias, Artesanato",
            moreInfoLink: "#"
        },
        "musica": {
            title: "Comunidade de Música e Adoração",
            image: "assets/img/community-musica.jpg",
            description: "Para todos os amantes da música e adoradores, esta comunidade se dedica a aprimorar talentos e servir através da arte. Realizamos ensaios, workshops de louvor e adoração, e nos preparamos para liderar os momentos musicais nos cultos e eventos da igreja. Seja você músico, cantor ou simplesmente um entusiasta, venha fazer parte!",
            address: "Auditório Principal",
            massTimes: "Terças-feiras, 19:00h (Ensaio Aberto)",
            contact: "louvor@igreja.com",
            pastorals: "Louvor e Adoração, Instrumentistas, Coral",
            moreInfoLink: "#"
        },
        "social": {
            title: "Comunidade de Ação Social",
            image: "assets/img/community-social.jpg",
            description: "Focada em fazer a diferença na comunidade, este grupo se engaja em projetos sociais, voluntariado e iniciativas de apoio a quem precisa. Organizamos campanhas de arrecadação, visitas a hospitais e asilos, e participamos ativamente de causas que promovem a justiça e a compaixão. Junte-se a nós para ser as mãos e os pés do amor na prática.",
            address: "Sede do Projeto Social",
            massTimes: "Variável (anunciado previamente em reuniões)",
            contact: "acao.social@igreja.com",
            pastorals: "Voluntariado, Campanhas, Visitas",
            moreInfoLink: "#"
        },
        "sagrada-familia": {
            title: "Comunidade Sagrada Família",
            image: "assets/img/community-sagrada-familia.jpg", // Certifique-se de que esta imagem existe
            description: "Esta comunidade se dedica ao estudo e aplicação dos princípios bíblicos para fortalecer os laços familiares, oferecendo apoio mútuo, aconselhamento e atividades para todas as gerações. Um porto seguro para famílias crescerem na fé e no amor, construindo um ambiente de harmonia e fé.",
            address: "Sala de Múltiplos Usos, Anexo B",
            massTimes: "Quintas-feiras, 19:00h (Encontro de Famílias)",
            contact: "familia.sagrada@igreja.com",
            pastorals: "Catequese Familiar, Preparação para o Matrimônio, Dízimo",
            moreInfoLink: "#" // O link específico para a página da comunidade
        },
        "jesus-luz-dos-povos": {
            title: "Comunidade Jesus Luz dos Povos",
            image: "assets/img/community-jesus-luz-dos-povos.jpg", // Certifique-se de que esta imagem existe
            description: "Esta comunidade se dedica ao estudo e aplicação dos princípios bíblicos para fortalecer os laços familiares, oferecendo apoio mútuo, aconselhamento e atividades para todas as gerações. Um porto seguro para famílias crescerem na fé e no amor, construindo um ambiente de harmonia e fé.",
            address: "Sala de Múltiplos Usos, Anexo B",
            massTimes: "Quintas-feiras, 19:00h (Encontro de Famílias)",
            contact: "familia.sagrada@igreja.com",
            pastorals: "Catequese Familiar, Preparação para o Matrimônio, Dízimo",
            moreInfoLink: "#" // O link específico para a página da comunidade
        },
        "virgem-da-piedade": {
            title: "Comunidade Virgem da Piedade",
            image: "assets/img/community-virgem-da-piedade.jpg", // Certifique-se de que esta imagem existe
            description: "Esta comunidade se dedica ao estudo e aplicação dos princípios bíblicos para fortalecer os laços familiares, oferecendo apoio mútuo, aconselhamento e atividades para todas as gerações. Um porto seguro para famílias crescerem na fé e no amor, construindo um ambiente de harmonia e fé.",
            address: "Sala de Múltiplos Usos, Anexo B",
            massTimes: "Quintas-feiras, 19:00h (Encontro de Famílias)",
            contact: "familia.sagrada@igreja.com",
            pastorals: "Catequese Familiar, Preparação para o Matrimônio, Dízimo",
            moreInfoLink: "#" // O link específico para a página da comunidade
        },
        "joao-paulo2": {
            title: "Comunidade São João Paulo II",
            image: "assets/img/community-joao-paulo2.jpg", // Certifique-se de que esta imagem existe
            description: "Esta comunidade se dedica ao estudo e aplicação dos princípios bíblicos para fortalecer os laços familiares, oferecendo apoio mútuo, aconselhamento e atividades para todas as gerações. Um porto seguro para famílias crescerem na fé e no amor, construindo um ambiente de harmonia e fé.",
            address: "Sala de Múltiplos Usos, Anexo B",
            massTimes: "Quintas-feiras, 19:00h (Encontro de Famílias)",
            contact: "familia.sagrada@igreja.com",
            pastorals: "Catequese Familiar, Preparação para o Matrimônio, Dízimo",
            moreInfoLink: "#" // O link específico para a página da comunidade
        }
    };

    // Abre o modal com os dados da comunidade clicada
    communityCards.forEach(card => {
        card.addEventListener('click', function() {
            const communityId = this.dataset.communityId;
            const data = communityData[communityId];

            if (data) {
                modalTitle.textContent = data.title;
                modalImage.src = data.image;
                modalImage.alt = data.title;
                modalDescription.textContent = data.description;

                // ATENÇÃO: Uso dos novos IDs do HTML
                if (modalAddress) modalAddress.textContent = data.address;
                if (modalMassTimes) modalMassTimes.textContent = data.massTimes;
                if (modalContact) modalContact.textContent = data.contact;
                if (modalPastorals) modalPastorals.textContent = data.pastorals;
                if (modalBtnMoreInfo) modalBtnMoreInfo.href = data.moreInfoLink;

                communityModal.classList.add('open');
            } else {
                console.error("Dados da comunidade não encontrados para o ID:", communityId);
            }
        });
    });

    // Fecha o modal ao clicar no botão de fechar
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            communityModal.classList.remove('open');
        });
    }

    // Fecha o modal ao clicar fora do conteúdo do modal
    if (communityModal) {
        communityModal.addEventListener('click', function(event) {
            if (event.target === communityModal) {
                communityModal.classList.remove('open');
            }
        });
    }

    // Fecha o modal ao pressionar a tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && communityModal.classList.contains('open')) {
            communityModal.classList.remove('open');
        }
    });
});