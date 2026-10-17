# MoodMusic 🎵

Site que recomenda músicas com base no sentimento escolhido pelo usuário.


## Estrutura do projeto

```
TRABALHO-ADVENTISTA/
├── index.html              → estrutura da página (HTML puro)
├── css/
│   └── style.css           → todo o visual do site
├── js/
│   ├── config.js           → constantes: imagens do fundo, cor de cada
│   │                          sentimento, termo de busca e quantidade
│   │                          de músicas retornadas
│   ├── storage.js          → favoritos e histórico (localStorage)
│   ├── background.js       → fundo animado de capas de álbum
│   ├── player.js           → mini player, cards de música, busca na
│   │                          iTunes Search API
│   └── screens.js          → navegação entre telas e lógica de cada uma
└── images/
    ├── logo/
    │   └── logo-adventista.webp
    └── albuns/
        └── capa-01.jpg ... capa-10.jpg   (fundo animado da tela inicial)
```


## Como rodar

Abra `index.html` com o Live Server do VS Code (ou qualquer servidor
local). Não precisa de instalação nem de chave de API — a busca de
músicas usa a iTunes Search API, que é pública e gratuita.


## O que mexer em cada arquivo

- **Trocar/adicionar imagens do fundo** → `js/config.js`, array `imagens`
  (coloque o arquivo em `images/albuns/` e adicione o caminho na lista)
- **Mudar quantas músicas aparecem por busca** → `js/config.js`,
  constante `QUANTIDADE_DE_MUSICAS`
- **Mudar a cor ou o estilo musical de um sentimento** → `js/config.js`,
  objetos `feelingColors` e `feelingToQuery`
- **Mudar cores, fontes, espaçamentos** → `css/style.css`
- **Mudar textos da página, adicionar sentimentos novos** → `index.html`
