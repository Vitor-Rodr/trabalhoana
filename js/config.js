/* =====================================================
   config.js

   Todas as constantes do site ficam neste arquivo:
   imagens do fundo animado, cor de cada sentimento,
   termo de busca de cada sentimento e a quantidade de
   músicas retornadas pela API.

   É AQUI que você mexe para:
   - Trocar/adicionar imagens do fundo (array "imagens")
   - Mudar a cor associada a um sentimento
   - Mudar o estilo musical buscado por sentimento
   - Mudar quantas músicas aparecem por busca
===================================================== */


/* -----------------------------------------------------
   IMAGENS DO FUNDO ANIMADO

   Nome do arquivo, relativo à pasta "images/albuns/".
   Adicione, remova ou troque quantas linhas quiser.
----------------------------------------------------- */

const imagens = [

    "images/albuns/capa-01.jpg",
    "images/albuns/capa-02.jpg",
    "images/albuns/capa-03.jpg",
    "images/albuns/capa-04.jpg",
    "images/albuns/capa-05.jpg",
    "images/albuns/capa-06.jpg",
    "images/albuns/capa-07.jpg",
    "images/albuns/capa-08.jpg",
    "images/albuns/capa-09.jpg",
    "images/albuns/capa-10.jpg"

];


/* -----------------------------------------------------
   QUANTIDADE DE MÚSICAS POR BUSCA

   Quantas faixas a iTunes Search API deve devolver
   quando o usuário escolhe um sentimento.
----------------------------------------------------- */

const QUANTIDADE_DE_MUSICAS = 20;


/* -----------------------------------------------------
   COR DE CADA SENTIMENTO

   Usada para tingir o fundo (mood-glow) das telas
   de resultado/favoritas/histórico conforme o
   sentimento escolhido.
----------------------------------------------------- */

const feelingColors = {

    "Alegria": "#FFC93C",
    "Tristeza": "#3B82F6",
    "Raiva": "#E5383B",
    "Medo": "#6C5B7B",
    "Amor": "#FF4D6D",
    "Nojo": "#6A8532",
    "Empatia": "#4CC9F0",
    "Gratidão": "#F4A261",
    "Orgulho": "#9D4EDD",
    "Vergonha": "#C77DFF",
    "Culpa": "#5C677D",
    "Esperança": "#2EC4B6",
    "Ansiedade": "#EF476F",
    "Frustração": "#D62828",
    "Ciúme": "#7B2D26",
    "Inveja": "#588157",
    "Saudade": "#457B9D",
    "Solidão": "#495057",
    "Compaixão": "#F28482",
    "Alívio": "#80ED99"

};


/* -----------------------------------------------------
   MAPA: SENTIMENTO -> BUSCA DE MÚSICA

   Cada sentimento é ligado a um termo de busca usado
   na iTunes Search API (gratuita, sem chave/login).
----------------------------------------------------- */

const feelingToQuery = {

    "Alegria": "happy pop hits",
    "Tristeza": "sad acoustic songs",
    "Raiva": "angry rock",
    "Medo": "dark ambient",
    "Amor": "love songs romantic",
    "Nojo": "industrial metal",
    "Empatia": "emotional piano",
    "Gratidão": "gospel gratitude",
    "Orgulho": "triumphant anthem",
    "Vergonha": "melancholic indie",
    "Culpa": "regret ballad",
    "Esperança": "hopeful uplifting",
    "Ansiedade": "anxious alternative",
    "Frustração": "frustration rock",
    "Ciúme": "jealousy rnb",
    "Inveja": "envy hip hop",
    "Saudade": "bossa nova saudade",
    "Solidão": "lonely acoustic",
    "Compaixão": "soulful compassion",
    "Alívio": "relief chill"

};
