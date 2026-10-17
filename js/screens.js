/* =====================================================
   screens.js

   Controla a navegação entre as 5 telas do site,
   a seleção de sentimentos (até 2 ao mesmo tempo),
   o botão de sentimento surpresa, e a exibição das
   telas de resultados, favoritas e histórico.

   Depende de: config.js, storage.js, player.js
===================================================== */


        /* =====================================================
           REFERÊNCIAS DAS TELAS
        ===================================================== */

        const welcomeScreen =
            document.getElementById(
                "welcome-screen"
            );

        const feelingScreen =
            document.getElementById(
                "feeling-screen"
            );

        const resultsScreen =
            document.getElementById(
                "results-screen"
            );

        const favoritesScreen =
            document.getElementById(
                "favorites-screen"
            );

        const historyScreen =
            document.getElementById(
                "history-screen"
            );

        const todasAsTelas = [

            welcomeScreen,
            feelingScreen,
            resultsScreen,
            favoritesScreen,
            historyScreen

        ];


        let started = false;


        /* =====================================================
           TROCAR DE TELA (usado por todas as navegações)
        ===================================================== */

        function irParaTela(tela) {

            started = true;

            todasAsTelas.forEach(
                item => {

                    item.classList.add(
                        "hidden"
                    );

                }
            );

            tela.classList.remove(
                "hidden"
            );
        }


        function startApplication() {

            if (started) {
                return;
            }

            irParaTela(feelingScreen);
        }


        welcomeScreen.addEventListener(
            "click",
            startApplication
        );


        document.addEventListener(
            "keydown",
            () => {

                if (!started) {
                    startApplication();
                }

            }
        );




        /*
            "feelingColors" e "feelingToQuery" vêm
            de config.js (carregado antes deste arquivo).
        */

        function definirCorDoMood(sentimentos) {

            const cores =
                sentimentos.map(
                    s => feelingColors[s] || "#1DB954"
                );

            document.documentElement
                .style.setProperty(
                    "--mood-color",
                    cores[0]
                );
        }


        /* =====================================================
           MOSTRAR A TELA DE RESULTADOS
        ===================================================== */

        async function mostrarResultados(sentimentos) {

            irParaTela(resultsScreen);

            definirCorDoMood(sentimentos);

            resultsTitle.textContent =
                "Músicas para " +
                sentimentos
                    .map(s => s.toLowerCase())
                    .join(" + ");

            renderizarCarregando(
                resultsContent
            );

            registrarHistorico(
                sentimentos
            );


            try {

                const musicas =
                    await buscarMusicas(
                        sentimentos
                    );

                ultimosResultados =
                    musicas;

                renderizarGridDeMusicas(
                    resultsContent,
                    musicas,
                    "Nenhuma música encontrada para esse sentimento."
                );

            }

            catch (erro) {

                console.log(
                    "Erro ao buscar músicas:",
                    erro
                );

                renderizarErro(
                    resultsContent
                );

            }

        }


        backButton.addEventListener(
            "click",
            () => {

                irParaTela(feelingScreen);
            }
        );



        /* =====================================================

           SELEÇÃO DE SENTIMENTOS (ATÉ 2 AO MESMO TEMPO)
        ===================================================== */

        const feelingOptions =
            document.querySelectorAll(
                ".feeling-option"
            );

        const continueButton =
            document.getElementById(
                "continue-button"
            );

        const selectedText =
            document.getElementById(
                "selected-text"
            );

        const surpriseButton =
            document.getElementById(
                "surprise-button"
            );


        let selectedFeelings = [];


        function atualizarSelecaoUI() {

            feelingOptions.forEach(
                option => {

                    option.classList.toggle(
                        "selected",
                        selectedFeelings.includes(
                            option.textContent.trim()
                        )
                    );

                }
            );


            if (selectedFeelings.length === 0) {

                selectedText.textContent = "";

                continueButton.classList.remove(
                    "active"
                );

                return;
            }


            selectedText.textContent =
                "Você selecionou: " +
                selectedFeelings.join(" + ");

            continueButton.classList.add(
                "active"
            );

            definirCorDoMood(
                selectedFeelings
            );
        }


        function alternarSelecaoDeSentimento(nome) {

            const jaEstaSelecionado =
                selectedFeelings.includes(nome);

            if (jaEstaSelecionado) {

                selectedFeelings =
                    selectedFeelings.filter(
                        item => item !== nome
                    );

            }

            else if (selectedFeelings.length < 2) {

                selectedFeelings.push(nome);

            }

            else {

                /*
                    Já tem 2 selecionados:
                    troca o mais antigo pelo novo.
                */

                selectedFeelings.shift();

                selectedFeelings.push(nome);
            }

            atualizarSelecaoUI();
        }


        feelingOptions.forEach(
            option => {

                option.addEventListener(
                    "click",
                    () => {

                        alternarSelecaoDeSentimento(
                            option.textContent.trim()
                        );

                    }
                );

            }
        );



        /* =====================================================
           BOTÃO "ENCONTRAR MINHA TRILHA"
        ===================================================== */

        continueButton.addEventListener(
            "click",
            () => {

                if (selectedFeelings.length === 0) {
                    return;
                }

                mostrarResultados(
                    selectedFeelings
                );

            }
        );



        /* =====================================================
           BOTÃO "SENTIMENTO SURPRESA"
        ===================================================== */

        surpriseButton.addEventListener(
            "click",
            () => {

                const nomes =
                    Object.keys(
                        feelingColors
                    );

                const sorteado =
                    nomes[
                        Math.floor(
                            Math.random() *
                            nomes.length
                        )
                    ];

                selectedFeelings = [sorteado];

                atualizarSelecaoUI();

                mostrarResultados(
                    selectedFeelings
                );

            }
        );



        /* =====================================================

           TELA DE FAVORITAS
        ===================================================== */

        function renderizarFavoritos() {

            const favoritos =
                lerFavoritos();

            renderizarGridDeMusicas(
                document.getElementById(
                    "favorites-content"
                ),
                favoritos,
                "Você ainda não curtiu nenhuma música. Clique no ♡ de uma faixa para salvá-la aqui."
            );
        }


        document
            .getElementById(
                "favorites-nav-button"
            )
            .addEventListener(
                "click",
                () => {

                    irParaTela(
                        favoritesScreen
                    );

                    renderizarFavoritos();

                }
            );


        document
            .getElementById(
                "favorites-back-button"
            )
            .addEventListener(
                "click",
                () => {

                    irParaTela(
                        started
                            ? feelingScreen
                            : welcomeScreen
                    );

                }
            );



        /* =====================================================

           TELA DE HISTÓRICO
        ===================================================== */

        function formatarData(isoString) {

            const data =
                new Date(isoString);

            return data.toLocaleString(
                "pt-BR",
                {

                    day: "2-digit",
                    month: "2-digit",

                    hour: "2-digit",
                    minute: "2-digit"

                }
            );
        }


        function renderizarHistorico() {

            const historico =
                lerHistorico();

            const container =
                document.getElementById(
                    "history-content"
                );

            if (historico.length === 0) {

                container.innerHTML = `
                    <div class="results-status">
                        <span>
                            Seu histórico está vazio.
                            Escolha um sentimento na tela
                            anterior para começar.
                        </span>
                    </div>
                `;

                return;
            }


            /*
                Conta quantas vezes cada
                sentimento apareceu no histórico.
            */

            const contagem = {};

            historico.forEach(
                entrada => {

                    entrada.sentimentos.forEach(
                        sentimento => {

                            contagem[sentimento] =
                                (contagem[sentimento] || 0) + 1;

                        }
                    );

                }
            );

            const maiorContagem =
                Math.max(
                    ...Object.values(contagem)
                );

            const barras =
                Object.entries(contagem)
                    .sort(
                        (a, b) => b[1] - a[1]
                    )
                    .map(
                        ([sentimento, total]) => `
                            <div class="history-bar-row">
                                <span class="history-bar-label">${sentimento}</span>
                                <div class="history-bar-track">
                                    <div
                                        class="history-bar-fill"
                                        style="width: ${(total / maiorContagem) * 100}%"
                                    ></div>
                                </div>
                                <span class="history-bar-count">${total}x</span>
                            </div>
                        `
                    )
                    .join("");


            const entradas =
                historico
                    .slice(0, 20)
                    .map(
                        entrada => `
                            <div class="history-entry">
                                <div class="history-entry-tags">
                                    ${
                                        entrada.sentimentos
                                            .map(
                                                s => `<span class="history-tag">${s}</span>`
                                            )
                                            .join("")
                                    }
                                </div>
                                <span class="history-entry-date">${formatarData(entrada.data)}</span>
                            </div>
                        `
                    )
                    .join("");


            container.innerHTML = `
                <span class="section-subtitle">Sentimentos mais comuns</span>
                <div class="history-chart">
                    ${barras}
                </div>
                <span class="section-subtitle">Últimas buscas</span>
                <div class="history-list">
                    ${entradas}
                </div>
            `;
        }


        document
            .getElementById(
                "history-nav-button"
            )
            .addEventListener(
                "click",
                () => {

                    irParaTela(
                        historyScreen
                    );

                    renderizarHistorico();

                }
            );


        document
            .getElementById(
                "history-back-button"
            )
            .addEventListener(
                "click",
                () => {

                    irParaTela(
                        started
                            ? feelingScreen
                            : welcomeScreen
                    );

                }
            );

