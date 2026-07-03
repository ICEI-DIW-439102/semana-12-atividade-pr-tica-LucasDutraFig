// ============================================================
//  Catálogo de Filmes — script.js
//  Consome a API do The Movie DB (TMDB) com Fetch API
// ============================================================

// ⚠️ Troque pela sua própria chave gerada em https://www.themoviedb.org/settings/api
const API_KEY = "0732afef1f7ea8ddd13b864b5c97d696";

const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// Elementos da página
const listaEl = document.getElementById("movie-list");
const mensagemEl = document.getElementById("message");
const inputBusca = document.getElementById("search");
const botaoBusca = document.getElementById("btnSearch");

// ============================================================
//  1) Busca os filmes na API (populares ou por pesquisa)
// ============================================================
async function fetchMovies(query = "") {
  let url = "";

  if (query.trim() === "") {
    // Sem termo de busca -> lista os filmes populares
    url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;
  } else {
    // Com termo de busca -> usa o endpoint de pesquisa
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`;
  }

  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error("Erro ao buscar os filmes na API");
  }

  const dados = await resposta.json();
  return dados.results;
}

// ============================================================
//  2) Cria o card de um filme
// ============================================================
function createMovieCard(movie) {
  const card = document.createElement("div");
  card.classList.add("card-tmdb");

  const poster = document.createElement("img");
  poster.classList.add("poster-tmdb");
  if (movie.poster_path) {
    poster.src = IMG_URL + movie.poster_path;
  } else {
    poster.src = "https://via.placeholder.com/300x445?text=Sem+imagem";
  }
  poster.alt = movie.title;

  const info = document.createElement("div");
  info.classList.add("info-tmdb");

  const titulo = document.createElement("h3");
  titulo.textContent = movie.title;

  const ano = document.createElement("span");
  ano.classList.add("ano-tmdb");
  const anoLancamento = movie.release_date ? movie.release_date.substring(0, 4) : "—";
  ano.textContent = anoLancamento;

  const nota = document.createElement("span");
  nota.classList.add("nota-tmdb");
  nota.innerHTML = `<i class="bi bi-star-fill"></i> ${movie.vote_average.toFixed(1)}`;

  const sinopse = document.createElement("p");
  sinopse.classList.add("sinopse-tmdb");
  if (movie.overview) {
    sinopse.textContent = movie.overview.length > 140
      ? movie.overview.substring(0, 140) + "..."
      : movie.overview;
  } else {
    sinopse.textContent = "Sinopse não disponível.";
  }

  info.appendChild(titulo);
  info.appendChild(ano);
  info.appendChild(nota);
  info.appendChild(sinopse);

  card.appendChild(poster);
  card.appendChild(info);

  return card;
}

// ============================================================
//  3) Renderiza a lista de filmes na tela
// ============================================================
function renderMovies(movies) {
  listaEl.innerHTML = "";

  if (!movies || movies.length === 0) {
    showMessage("Nenhum filme encontrado.");
    return;
  }

  showMessage("");

  movies.forEach(function (movie) {
    const card = createMovieCard(movie);
    listaEl.appendChild(card);
  });
}

// ============================================================
//  4) Mostra mensagens de status (carregando, erro, vazio)
// ============================================================
function showMessage(text) {
  mensagemEl.textContent = text;
}

// ============================================================
//  5) Executa uma busca (populares ou por termo)
// ============================================================
async function buscarFilmes(query = "") {
  try {
    showMessage("Carregando filmes...");
    const filmes = await fetchMovies(query);
    renderMovies(filmes);
  } catch (erro) {
    console.error(erro);
    showMessage("Ocorreu um erro ao buscar os filmes. Tente novamente.");
  }
}

// ============================================================
//  6) Inicialização
// ============================================================
function init() {
  buscarFilmes(); // carrega os filmes populares ao abrir a página
}

// Botão "Buscar"
botaoBusca.addEventListener("click", function () {
  buscarFilmes(inputBusca.value);
});

// Também permite buscar apertando Enter no campo de texto
inputBusca.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    buscarFilmes(inputBusca.value);
  }
});

document.addEventListener("DOMContentLoaded", init);
