/* =====================================================
   storage.js

   Tudo que é salvo no navegador do usuário
   (localStorage): músicas favoritas e histórico de
   sentimentos pesquisados. Não depende de servidor,
   então sobrevive a fechar a página, mas fica preso
   ao navegador em que foi usado.
===================================================== */


        const CHAVE_FAVORITOS = "moodmusic_favoritos";
        const CHAVE_HISTORICO = "moodmusic_historico";


        function lerFavoritos() {

            try {

                const dados =
                    localStorage.getItem(
                        CHAVE_FAVORITOS
                    );

                return dados
                    ? JSON.parse(dados)
                    : [];

            }

            catch (erro) {

                return [];
            }
        }


        function salvarFavoritos(lista) {

            localStorage.setItem(
                CHAVE_FAVORITOS,
                JSON.stringify(lista)
            );
        }


        function ehFavorito(trackId) {

            return lerFavoritos().some(
                item => item.trackId === trackId
            );
        }


        function alternarFavorito(track) {

            const lista =
                lerFavoritos();

            const indice =
                lista.findIndex(
                    item => item.trackId === track.trackId
                );

            if (indice === -1) {

                lista.unshift(track);

            }

            else {

                lista.splice(indice, 1);
            }

            salvarFavoritos(lista);

            return indice === -1;
        }


        function lerHistorico() {

            try {

                const dados =
                    localStorage.getItem(
                        CHAVE_HISTORICO
                    );

                return dados
                    ? JSON.parse(dados)
                    : [];

            }

            catch (erro) {

                return [];
            }
        }


        function registrarHistorico(sentimentos) {

            const lista =
                lerHistorico();

            lista.unshift({

                sentimentos,

                data: new Date().toISOString()

            });


            /*
                Guardamos só as últimas 50
                buscas para não pesar o navegador.
            */

            salvarHistorico(
                lista.slice(0, 50)
            );
        }


        function salvarHistorico(lista) {

            localStorage.setItem(
                CHAVE_HISTORICO,
                JSON.stringify(lista)
            );
        }
