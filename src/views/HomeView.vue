<template>
  <main>
    <div class="search-container">
      <input
        type="text"
        placeholder="Rechercher des films, séries, acteurs..."
        v-model="searchQuery"
        @input="searchMovies"
      />
    </div>
    <div v-if="searchResults.length > 0">
      <div v-for="result in searchResults" :key="result.id + result.media_type" class="search-result" @click="goToDetail(result)">
        <img :src="getImageUrl(result)" :alt="result.title || result.name">
        <h2>{{ result.title || result.name }}</h2>
      </div>
    </div>
    <div v-else>
      <div v-for="movie in movies" :key="movie.id" class="movie" @click="goToMovie(movie.id)">
        <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title">
        <h2>{{ movie.title }}</h2>
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
const searchQuery = ref('');
const movies = ref([]);
const searchResults = ref([]);
const router = useRouter();
const apiKey = 'a446566ae142c41aa0fcfd2febbee065';
const baseUrl = 'https://api.themoviedb.org/3';
async function loadMovies() {
  let allMovies = [];
  try {
    for (let page = 1; page <= 2; page++) {
      const response = await axios.get(`${baseUrl}/discover/movie?api_key=${apiKey}&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`);
      allMovies = allMovies.concat(response.data.results);
    }
    const responsePage3 = await axios.get(`${baseUrl}/discover/movie?api_key=${apiKey}&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=3`);
    allMovies = allMovies.concat(responsePage3.data.results.slice(0, 20));
    movies.value = allMovies;
  } catch (error) {
    console.error(error);
  }
}
async function searchMovies() {
  if (searchQuery.value.length < 3) {
    searchResults.value = [];
    return;
  }
  try {
    const response = await axios.get(`${baseUrl}/search/multi?api_key=${apiKey}&language=fr-FR&query=${searchQuery.value}&page=1&include_adult=false`);
    searchResults.value = response.data.results;
  } catch (error) {
    console.error(error);
  }
}
function goToDetail(result) {
  if (result.media_type === 'movie') {
    router.push({ name: 'MovieDetails', params: { id: result.id } });
  } else if (result.media_type === 'tv') {
    router.push({ name: 'TvShowDetails', params: { id: result.id } }); // Remplace 'TvShowDetails' par le nom de la route de tes détails de série
  } else if (result.media_type === 'person') {
    router.push({ name: 'ActorDetails', params: { id: result.id } });
  }
}
function goToMovie(movieId) {
  router.push({ name: 'MovieDetails', params: { id: movieId } });
}
function getImageUrl(result) {
  return result.poster_path || result.profile_path
    ? `https://image.tmdb.org/t/p/w500${result.poster_path || result.profile_path}`
    : ''; // You may want to return a placeholder image URL here
}
onMounted(loadMovies);
</script>
<style>
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

