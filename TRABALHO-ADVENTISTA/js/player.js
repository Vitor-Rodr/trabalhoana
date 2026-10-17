/* =====================================================
   player.js

   Tudo relacionado a tocar e exibir músicas:
   - Mini player fixo no rodapé
   - Montagem do card de cada música (capa, nome,
     botões de tocar/favoritar)
   - Busca de músicas na iTunes Search API
   - Renderização dos estados de carregando/erro/grid

   Depende de: config.js, storage.js
===================================================== */


        /* =====================================================
           MINI PLAYER FIXO
        ===================================================== */

        const miniPlayer =
            document.getElementById(
                "mini-player"
            );

        const miniPlayerCover =
            document.getElementById(
                "mini-player-cover"
            );

        const miniPlayerName =
            document.getElementById(
                "mini-player-name"
            );

        const miniPlayerArtist =
            document.getElementById(
                "mini-player-artist"
            );

        const miniPlayerToggle =
            document.getElementById(
                "mini-player-toggle"
            );

        const miniPlayerClose =
            document.getElementById(
                "mini-player-close"
            );

        const globalAudio =
            document.getElementById(
                "global-audio"
            );


        let trackAtualId = null;


        function atualizarBotoesPlay() {

            document
                .querySelectorAll(
                    ".play-button"
                )
                .forEach(
                    botao => {

                        const ehEssaFaixa =
                            botao.dataset.trackId ===
                            String(trackAtualId);

                        const tocando =
                            ehEssaFaixa &&
                            !globalAudio.paused;

                        botao.textContent =
                            tocando ? "⏸" : "▶";

                        botao.classList.toggle(
                            "playing",
                            tocando
                        );

                    }
                );
        }


        function tocarPreview(track) {

            const mesmaFaixa =
                trackAtualId === track.trackId;

            if (
                mesmaFaixa &&
                !globalAudio.paused
            ) {

                globalAudio.pause();

                atualizarBotoesPlay();

                return;
            }

            if (
                mesmaFaixa &&
                globalAudio.paused
            ) {

                globalAudio.play();

                atualizarBotoesPlay();

                return;
            }


            trackAtualId = track.trackId;

            globalAudio.src =
                track.previewUrl || "";

            globalAudio.play();


            miniPlayerCover.src =
                track.artworkUrl100 || "";

            miniPlayerName.textContent =
                track.trackName || "";

            miniPlayerArtist.textContent =
                track.artistName || "";

            miniPlayer.classList.add(
                "active"
            );

            atualizarBotoesPlay();
        }


        globalAudio.addEventListener(
            "play",
            atualizarBotoesPlay
        );

        globalAudio.addEventListener(
            "pause",
            atualizarBotoesPlay
        );

        globalAudio.addEventListener(
            "ended",
            atualizarBotoesPlay
        );


        miniPlayerToggle.addEventListener(
            "click",
            () => {

                if (globalAudio.paused) {

                    globalAudio.play();

                }

                else {

                    globalAudio.pause();
                }

            }
        );


        miniPlayerClose.addEventListener(
            "click",
            () => {

                globalAudio.pause();

                globalAudio.src = "";

                trackAtualId = null;

                miniPlayer.classList.remove(
                    "active"
                );

                atualizarBotoesPlay();

            }
        );



        /* =====================================================
           MONTAR O HTML DE UM CARD DE MÚSICA
        ===================================================== */

        function montarCardMusica(track) {

            const capa =
                track.artworkUrl100
                    ? track.artworkUrl100.replace(
                        "100x100",
                        "400x400"
                    )
                    : "";

            const favoritado =
                ehFavorito(
                    track.trackId
                );

            const link =
                track.trackViewUrl
                    ? `<a class="track-link" href="${track.trackViewUrl}" target="_blank" rel="noopener">Abrir</a>`
                    : "";

            return `
                <div class="track-card">
                    ${
                        capa
                            ? `<img class="track-cover" src="${capa}" alt="${track.trackName}">`
                            : `<div class="track-cover"></div>`
                    }
                    <span class="track-name">${track.trackName || "—"}</span>
                    <span class="track-artist">${track.artistName || ""}</span>
                    <div class="track-actions">
                        <button
                            class="play-button"
                            data-track-id="${track.trackId}"
                            data-action="tocar"
                            ${track.previewUrl ? "" : "disabled"}
                        >▶</button>
                        <button
                            class="heart-button ${favoritado ? "favorited" : ""}"
                            data-track-id="${track.trackId}"
                            data-action="favoritar"
                        >${favoritado ? "♥" : "♡"}</button>
                        ${link}
                    </div>
                </div>
            `;
        }


        /*
            Guarda em memória os últimos resultados
            buscados, para os botões de play/favoritar
            conseguirem achar os dados completos da faixa
            a partir só do trackId (que vem no data-attribute).
        */

        let ultimosResultados = [];


        function encontrarTrackPorId(trackId) {

            const numerico = Number(trackId);

            return (
                ultimosResultados.find(
                    t => t.trackId === numerico
                ) ||
                lerFavoritos().find(
                    t => t.trackId === numerico
                )
            );
        }


        /*
            Delegação de eventos: um único listener
            cuida de todos os botões de play/favoritar,
            mesmo depois do innerHTML ser trocado.
        */

        document.addEventListener(
            "click",
            evento => {

                const botao =
                    evento.target.closest(
                        "[data-action]"
                    );

                if (!botao) {
                    return;
                }

                const track =
                    encontrarTrackPorId(
                        botao.dataset.trackId
                    );

                if (!track) {
                    return;
                }

                if (
                    botao.dataset.action ===
                    "tocar"
                ) {

                    tocarPreview(track);

                }

                else if (
                    botao.dataset.action ===
                    "favoritar"
                ) {

                    const agoraFavoritado =
                        alternarFavorito(track);

                    botao.classList.toggle(
                        "favorited",
                        agoraFavoritado
                    );

                    botao.textContent =
                        agoraFavoritado ? "♥" : "♡";


                    /*
                        Se estivermos na tela de
                        favoritas e o item foi
                        removido, atualiza a lista.
                    */

                    if (
                        !agoraFavoritado &&
                        !favoritesScreen.classList.contains(
                            "hidden"
                        )
                    ) {

                        renderizarFavoritos();
                    }

                }

            }
        );



        /* =====================================================

           BUSCAR MÚSICAS NA ITUNES SEARCH API
        ===================================================== */

        async function buscarMusicas(sentimentos) {

            const termo =
                sentimentos
                    .map(
                        s => feelingToQuery[s] || s
                    )
                    .join(" ");


            const url =
                "https://itunes.apple.com/search" +
                "?term=" + encodeURIComponent(termo) +
                "&media=music" +
                "&entity=song" +
                "&limit=" + QUANTIDADE_DE_MUSICAS;


            const response =
                await fetch(url);

            if (!response.ok) {

                throw new Error(
                    "Falha na requisição"
                );
            }


            const data =
                await response.json();


            return data.results || [];
        }



        /* =====================================================

           RENDERIZAR RESULTADOS NA TELA
        ===================================================== */

        const resultsTitle =
            document.getElementById(
                "results-title"
            );

        const resultsContent =
            document.getElementById(
                "results-content"
            );

        const backButton =
            document.getElementById(
                "back-button"
            );


        function renderizarCarregando(container) {

            container.innerHTML = `
                <div class="results-status">
                    <div class="spinner"></div>
                    <span>Procurando músicas para você...</span>
                </div>
            `;
        }


        function renderizarErro(container) {

            container.innerHTML = `
                <div class="results-status">
                    <span>
                        Não foi possível carregar as músicas agora.
                        Verifique sua conexão e tente novamente.
                    </span>
                </div>
            `;
        }


        function renderizarGridDeMusicas(container, musicas, mensagemVazio) {

            if (
                !musicas ||
                musicas.length === 0
            ) {

                container.innerHTML = `
                    <div class="results-status">
                        <span>${mensagemVazio}</span>
                    </div>
                `;

                return;
            }


            const cards =
                musicas
                    .map(montarCardMusica)
                    .join("");


            container.innerHTML = `
                <div class="tracks-grid">
                    ${cards}
                </div>
            `;
        }



