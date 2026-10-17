/* =====================================================
   background.js

   Monta o fundo animado de capas de álbum na tela
   inicial, usando os nomes de arquivo definidos em
   config.js (array "imagens").
===================================================== */


        function createAlbumImage(nomeArquivo) {

            const img =
                document.createElement("img");

            img.className = "album";

            img.src = nomeArquivo;

            img.alt = nomeArquivo;


            img.onerror = () => {

                console.log(
                    "Imagem não encontrada:",
                    nomeArquivo
                );

                img.remove();
            };


            return img;
        }



        /* =====================================================
           DISTRIBUIR ÁLBUNS NAS FILEIRAS
        ===================================================== */

        function createAlbumBackground() {

            const rows = [

                document.getElementById("row1"),
                document.getElementById("row2"),
                document.getElementById("row3"),
                document.getElementById("row4"),
                document.getElementById("row5"),
                document.getElementById("row6")

            ];


            /*
                Cada fileira recebe
                uma combinação diferente
                dos álbuns.
            */

            rows.forEach(
                (row) => {

                    const shuffled =
                        [...imagens]
                        .sort(
                            () =>
                                Math.random() - 0.5
                        );


                    /*
                        Repetimos as imagens
                        para a animação
                        não ficar vazia.
                    */

                    const repeated = [
                        ...shuffled,
                        ...shuffled,
                        ...shuffled
                    ];


                    repeated.forEach(
                        nomeArquivo => {

                            const image =
                                createAlbumImage(
                                    nomeArquivo
                                );


                            row.appendChild(
                                image
                            );

                        }
                    );

                }
            );

        }


        /*
            Inicia o fundo
        */

        createAlbumBackground();



