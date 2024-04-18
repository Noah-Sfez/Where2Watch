<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { watchEffect } from 'vue';
const searchQuery = ref('');
const movies = ref([]); // Assure-toi que ceci est initialisé à un tableau vide.
const searchResults = ref([]);
const selectedGenre = ref('');
const upcomingMovies = ref([]);
const genres = ref([]);
const topRatedShows = ref([]);
const recommendedMovies = ref([]);
const router = useRouter();
const apiKey = 'a446566ae142c41aa0fcfd2febbee065';
const baseUrl = 'https://api.themoviedb.org/3';
const displayMovies = computed(() => {
  return searchResults.value.length > 0 ? searchResults.value : movies.value;
});
async function loadMovies() {
  let allMovies = [];
  try {
    for (let page = 1; page <= 2; page++) {
      const response = await axios.get(`${baseUrl}/discover/movie?api_key=${apiKey}&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`);
      allMovies = allMovies.concat(response.data.results);
    }
    const responsePage3 = await axios.get(`${baseUrl}/discover/movie?api_key=${apiKey}&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=3`);
    allMovies = allMovies.concat(responsePage3.data.results.slice(0, 20));
    movies.value = allMovies.map(movie => ({ ...movie, media_type: 'movie' }));
  } catch (error) {
    console.error(error);
  }
}


function navigateToSearchPage() {
  router.push({ name: 'SearchPage' });
}

function getImageUrl(result) {
  return result.poster_path || result.profile_path
    ? `https://image.tmdb.org/t/p/w500${result.poster_path || result.profile_path}`
    : ''; // You may want to return a placeholder image URL here
}
//vider le localStorage
function clearHistory() {
  localStorage.removeItem('movieClickHistory');
}

function storeMovieClick(movieId) {
  let history = JSON.parse(localStorage.getItem('movieClickHistory')) || [];
  if (history.length >= 20) {
    clearHistory();
  }
  history.push(movieId);
  localStorage.setItem('movieClickHistory', JSON.stringify(history));
}
function goToMovie(result) {
  console.log(result);
  const mediaType = result.media_type || 'movie'; // Assume 'movie' if media_type is not provided
  if (mediaType === 'movie') {
    storeMovieClick(result.id);
    router.push({ name: 'MovieDetails', params: { id: result.id } });
  } else if (mediaType === 'tv') {
    storeMovieClick(result.id);
    router.push({ name: 'TvShowDetails', params: { id: result.id } });
  } else if (mediaType === 'person') {
    router.push({ name: 'ActorDetails', params: { id: result.id } });
  }
}
function goToShow(show) {
  router.push({ name: 'TvShowDetails', params: { id: show.id } });
}

async function fetchGenreCounts(movieIds) {
  let genreCounts = {};
  for (let id of movieIds) {
    try {
      const response = await axios.get(`${baseUrl}/movie/${id}?api_key=${apiKey}&language=fr-FR`);
      response.data.genres.forEach(genre => {
        genreCounts[genre.id] = (genreCounts[genre.id] || 0) + 1;
      });
    } catch (error) {
      // Gère spécifiquement l'erreur 404 ou d'autres erreurs ici
      if (error.response && error.response.status === 404) {
        console.error(`Le film avec l'ID ${id} n'a pas été trouvé.`);
      } else {
        console.error(`Erreur lors de la récupération des genres pour le film ${id}:`, error);
      }
    }
  }
  return genreCounts;
}

async function loadUpcomingMovies() {
  try {
    const response = await axios.get(`${baseUrl}/movie/upcoming?api_key=${apiKey}&language=fr-FR`);
    upcomingMovies.value = response.data.results;
  } catch (error) {
    console.error('Erreur lors du chargement des films à venir:', error);
  }
}

onMounted(loadUpcomingMovies);
async function loadTopRatedShows() {
  try {
    const response = await axios.get(`${baseUrl}/tv/top_rated?api_key=${apiKey}&language=fr-FR`);
    topRatedShows.value = response.data.results;
  } catch (error) {
    console.error('Erreur lors du chargement des meilleures séries:', error);
  }
}

onMounted(loadTopRatedShows);
// Modification de la fonction pour qu'elle trie les genres et fasse des recommandations basées sur les deux genres les plus fréquents
async function recommendMoviesBasedOnTopGenres() {
  const movieClickHistory = localStorage.getItem('movieClickHistory');
  console.log(movieClickHistory);
  if (movieClickHistory) {
    const movieIds = JSON.parse(movieClickHistory);
    const genreCounts = await fetchGenreCounts(movieIds);
    // Trie les genres par fréquence et prend les deux premiers
    const topGenres = Object.entries(genreCounts)
                             .sort((a, b) => b[1] - a[1])
                             .slice(0, 2)
      .map(entry => entry[0]);
    console.log(topGenres);
    let recommendations = [];
    for (let genreId of topGenres) {
      const response = await axios.get(`${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=fr-FR`);
      // Filtre les films déjà dans l'historique des clics et ajoute les nouveaux
      const newRecommendations = response.data.results.filter(movie => !movieIds.includes(movie.id));
      recommendations.push(...newRecommendations);
    }
    // Élimine les doublons et limite à 10 films
    recommendedMovies.value = [...new Set(recommendations)].slice(0, 17);
  }
}

// Utilise watchEffect pour déclencher les recommandations chaque fois que l'historique des clics change
watchEffect(() => {
  recommendMoviesBasedOnTopGenres();
});

onMounted(async () => {
  await loadMovies();
});
</script>


<template>
  <main>
    <!-- Zone de recherche et filtres -->
    <div class="search-and-filters">
      <div class="search-container">
        <input
          type="text"
          placeholder="Rechercher des films, séries, acteurs..."
          v-model="searchQuery"
          @focus="navigateToSearchPage"
          @input="searchContent"
        />
      </div>
      <!-- Filtres -->
    </div>

    <div v-if="recommendedMovies.length" class="recommendations">
      <h2>Notre sélection pour vous</h2>
      <div class="recommendations-container">
        <div
          v-for="movie in recommendedMovies"
          :key="movie.id"
          class="movie"
          @click="goToMovie(movie)" 
        >
          <!-- Affiche les films recommandés ici -->
          <img :src="getImageUrl(movie)" :alt="movie.title || movie.name">
          <h3>{{ movie.title || movie.name }}</h3>
        </div>
      </div>
      <hr>
    </div>

    <div class="upcoming-movies-container">
      <h2>Films à venir</h2>
      <div class="upcoming-movies-scroll-container">
        <div v-for="movie in upcomingMovies" :key="movie.id" class="movie" @click="goToMovie(movie)">
          <img :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`" :alt="movie.title">
          <h3>{{ movie.title }}</h3>
        </div>
      </div>
    </div>
    <hr>

    <div class="top-rated-shows-container">
      <h2>Meilleures séries</h2>
      <div class="top-rated-shows-scroll-container">
        <div v-for="show in topRatedShows" :key="show.id" class="movie" @click="goToShow(show)">
          <img :src="`https://image.tmdb.org/t/p/w300${show.poster_path}`" :alt="show.name">
          <h3>{{ show.name }}</h3>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.recommendations-container {
  display: flex;
  overflow-x: auto;
  width: 100%; /* ou la largeur que vous souhaitez */
  /* Ajoutez cette propriété si vous voulez masquer la barre de défilement */
  -ms-overflow-style: none; /* pour Internet Explorer et Edge */
  margin-bottom: 10px;
}
.upcoming-movies-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.top-rated-shows-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.top-rated-shows-scroll-container {
  display: flex;
  overflow-x: auto;
  width: 100%; /* ou la largeur que vous souhaitez */
  /* Ajoutez cette propriété si vous voulez masquer la barre de défilement */
  -ms-overflow-style: none; /* pour Internet Explorer et Edge */
  margin-bottom: 10px;
}
.top-rated-shows-scroll-container::-webkit-scrollbar {
  width: 2px; /* largeur de la barre de défilement */
}
.upcoming-movies-scroll-container{
  display: flex;
  overflow-x: auto;
  width: 100%; /* ou la largeur que vous souhaitez */
  /* Ajoutez cette propriété si vous voulez masquer la barre de défilement */
  -ms-overflow-style: none; /* pour Internet Explorer et Edge */
  margin-bottom: 10px;
} 
.top-rated-shows-scroll-container {
  display: flex;
  overflow-x: auto;
  width: 100%; /* ou la largeur que vous souhaitez */
  /* Ajoutez cette propriété si vous voulez masquer la barre de défilement */
  -ms-overflow-style: none; /* pour Internet Explorer et Edge */
  margin-bottom: 10px;
}

::-webkit-scrollbar-thumb {
  background: #383838; /* couleur de la poignée de défilement */
  border-radius: 9px;
  width: 7px;
}
.recommendations-container::-webkit-scrollbar {
  width: 2px; /* largeur de la barre de défilement */
}
.upcoming-movies-scroll-container::-webkit-scrollbar {
  width: 2px; /* largeur de la barre de défilement */
}
.services {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin: auto;
}
.movie {
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.movie img {
  width: 200px;  /* Ajuster selon le besoin */
  height: auto;
}
.search-container {
  margin: 20px;
  text-align: center;
}
.search-container input {
  width: 80%;
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 20px;
}
.search-result {
  margin: 20px;
  display: inline-block;
}
</style>

