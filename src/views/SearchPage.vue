<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { watchEffect } from 'vue';
const searchQuery = ref('');
const movies = ref([]); // Assure-toi que ceci est initialisé à un tableau vide.
const searchResults = ref([]);
const selectedGenre = ref('');
const filteredMovies = ref([]);
const genres = ref([]);
const streamingServices = ref([]);
const recommendedMovies = ref([]);
const popularStreamingServices = [
  { id: '8', name: 'Netflix' },
  { id: '119', name: 'Amazon Prime' },
  { id: '337', name: 'Disney Plus' },
  { id: '350', name: 'Apple TV Plus' },
  { id: '283', name: 'Crunchyroll' },
  { id: '381', name: 'Canal +' },
  { id: '56', name: 'OCS Go' },
  { id: '3', name: 'Google Play Movies' },
  { id: '61', name: 'Orange VOD' },
  { id: '234', name: 'Arte' },
  { id: '68', name: 'Microsoft Store' },
  { id: '188', name: 'Youtube Premium' },
  { id: '35', name: 'Rakuten TV' },
  { id: '1754', name: 'TF1' },
  { id: '531', name: 'Paramount Plus' },
  { id: '1967', name: 'Molotov TV' },
];
const selectedRating = ref('');
const selectedYear = ref('');
const years = ref([]);
const selectedStreamingServices = ref([]);
const router = useRouter();
const searchInput = ref(null);
const apiKey = 'a446566ae142c41aa0fcfd2febbee065';
const baseUrl = 'https://api.themoviedb.org/3';
const displayMovies = computed(() => searchResults.value.length > 0 ? searchResults.value : filteredMovies.value.length > 0 ? filteredMovies.value : movies.value);
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
onMounted(() => {
  if (searchInput.value) {
    searchInput.value.focus();
  }
});
async function applyFilters() {
  let url = `${baseUrl}/discover/movie?api_key=${apiKey}&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false`;
  if (selectedGenre.value) {
    url += `&with_genres=${selectedGenre.value}`;
  }
  if (selectedRating.value) {
    url += `&vote_average.gte=${selectedRating.value}`;
  }
  if (selectedYear.value) {
    url += `&primary_release_year=${selectedYear.value}`;
  }
  if (selectedStreamingServices.value.length > 0) {
    const providersIds = selectedStreamingServices.value.join('|'); // Utilise '|' comme séparateur si l'API le requiert
    url += `&with_watch_providers=${providersIds}&watch_region=FR`;
  }
  try {
    const response = await axios.get(url);
    filteredMovies.value = response.data.results;
  } catch (error) {
    console.error("Erreur lors de l'application des filtres : ", error);
  }
}
async function loadGenres() {
  try {
    const response = await axios.get(`${baseUrl}/genre/movie/list?api_key=${apiKey}&language=fr-FR`);
    genres.value = response.data.genres;
  } catch (error) {
    console.error('Erreur lors du chargement des genres:', error);
  }
}
async function loadStreamingServices() {
  try {
    const apiKey = 'a446566ae142c41aa0fcfd2febbee065';
    const response = await axios.get(`https://api.themoviedb.org/3/watch/providers/movie?api_key=${apiKey}&watch_region=FR`);
  } catch (error) {
    console.error("Erreur lors du chargement des fournisseurs de streaming:", error);
  }
}
onMounted(() => {
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year > currentYear - 30; year--) {
    years.value.push(year);
  }
});
async function searchContent() {
  if (searchQuery.value.trim().length >= 1) {
    try {
      const response = await axios.get(`${baseUrl}/search/multi?api_key=${apiKey}&language=fr-FR&query=${encodeURIComponent(searchQuery.value)}&page=1&include_adult=false`);
      searchResults.value = response.data.results;
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
    }
  } else {
    searchResults.value = [];
  }
}
function getImageUrl(result) {
  return result.poster_path || result.profile_path
    ? `https://image.tmdb.org/t/p/w500${result.poster_path || result.profile_path}`
    : ''; // You may want to return a placeholder image URL here
}
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
async function fetchGenreCounts(movieIds) {
  let genreCounts = {};
  for (let id of movieIds) {
    try {
      const response = await axios.get(`${baseUrl}/movie/${id}?api_key=${apiKey}&language=fr-FR`);
      response.data.genres.forEach(genre => {
        genreCounts[genre.id] = (genreCounts[genre.id] || 0) + 1;
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error(`Le film avec l'ID ${id} n'a pas été trouvé.`);
      } else {
        console.error(`Erreur lors de la récupération des genres pour le film ${id}:`, error);
      }
    }
  }
  return genreCounts;
}
async function recommendMoviesBasedOnTopGenres() {
  const movieClickHistory = localStorage.getItem('movieClickHistory');
  console.log(movieClickHistory);
  if (movieClickHistory) {
    const movieIds = JSON.parse(movieClickHistory);
    const genreCounts = await fetchGenreCounts(movieIds);
    const topGenres = Object.entries(genreCounts)
                             .sort((a, b) => b[1] - a[1])
                             .slice(0, 2)
      .map(entry => entry[0]);
    console.log(topGenres);
    let recommendations = [];
    for (let genreId of topGenres) {
      const response = await axios.get(`${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=fr-FR`);
      const newRecommendations = response.data.results.filter(movie => !movieIds.includes(movie.id));
      recommendations.push(...newRecommendations);
    }
    recommendedMovies.value = [...new Set(recommendations)].slice(0, 7);
  }
}
onMounted(async () => {
  await loadMovies();
  await loadGenres();
  await loadStreamingServices();
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
            ref="searchInput"
        />
      </div>
      <!-- Filtres -->
      <div class="filters">
        <select v-model="selectedGenre" @change="applyFilters">
          <option value="">Tous les genres</option>
          <option v-for="genre in genres" :value="genre.id" :key="genre.id">{{ genre.name }}</option>
        </select>
        <select v-model="selectedRating" @change="applyFilters">
          <option value="">Toutes les notes</option>
          <option value="9">9 et plus</option>
          <option value="8">8 et plus</option>
          <option value="7">7 et plus</option>
          <option value="6">6 et plus</option>
          <option value="5">5 et plus</option>
        </select>
        <select v-model="selectedYear" @change="applyFilters">
          <option value="">Toutes les années</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
        <div class="services">
          <div v-for="service in popularStreamingServices" :key="service.id">
          <input
            type="checkbox"
            :id="`service-${service.id}`"
            :value="service.id"
            v-model="selectedStreamingServices"
            @change="applyFilters"
          >
          <label :for="`service-${service.id}`">{{ service.name }}</label>
        </div>
        </div>
        
        <!-- Ajoute ici d'autres sélecteurs de filtre si nécessaire -->
      </div>
    </div>
    <div class="content-grid">
      <div v-for="(item, index) in displayMovies" :key="item.id + 'display-' + index" class="content-item movie" @click="goToMovie(item)">
        <img :src="getImageUrl(item)" :alt="item.title || item.name">
        <h2>{{ item.title || item.name }}</h2>
      </div>
    </div>
  </main>
</template>
<style scoped>
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
  display: inline-block;
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

