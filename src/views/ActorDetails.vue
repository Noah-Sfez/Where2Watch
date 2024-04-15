<template>
  <div class="actor-details">
    <img :src="'https://image.tmdb.org/t/p/w300' + actor.profile_path" :alt="actor.name" class="actor-image">
    <h1>{{ actor.name }}</h1>
    <p>{{ actor.biography }}</p>
    <h2>Films</h2>
    <div class="actor-movies">
      <div v-for="movie in actorMovies" :key="movie.id" class="movie-card" @click="goToMovieDetails(movie.id)">
        <img :src="'https://image.tmdb.org/t/p/w200' + movie.poster_path" :alt="movie.title" class="movie-poster">
        <span>{{ movie.title }}</span>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const actor = ref({});
const actorMovies = ref([]);

// Fonction pour naviguer vers les détails du film
function goToMovieDetails(movieId) {
  router.push({ name: 'MovieDetails', params: { id: movieId } });
}
onMounted(async () => {
  const apiKey = 'a446566ae142c41aa0fcfd2febbee065';
  const actorResponse = await axios.get(`https://api.themoviedb.org/3/person/${route.params.id}?api_key=${apiKey}&language=fr-FR`);
  actor.value = actorResponse.data;
  const creditsResponse = await axios.get(`https://api.themoviedb.org/3/person/${route.params.id}/movie_credits?api_key=${apiKey}&language=fr-FR`);
  actorMovies.value = creditsResponse.data.cast;
});
</script>
<style>
/* ... Autres styles ... */

.actor-movies {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.movie-card {
  cursor: pointer;
  text-align: center;
}

.movie-card img {
  width: 100px; /* ou la taille que tu préfères */
  height: 150px; /* ou la taille que tu préfères */
  object-fit: cover;
  border-radius: 5px;
  transition: transform 0.3s ease;
}

.movie-card:hover img {
  transform: scale(1.05);
}

.movie-card span {
  display: block;
  margin-top: 0.5rem;
}

/* ... Autres styles ... */
</style>

