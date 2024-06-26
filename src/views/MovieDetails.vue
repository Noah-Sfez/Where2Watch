<template>
  <div class="movie-details">
    <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title" class="movie-poster">
    <div class="movie-info">
      <h1>{{ movie.title }}</h1>
      <p>{{ movie.overview }}</p>
      <p><strong>Genre:</strong> {{ movieGenres }}</p>
      <p><strong>Date de sortie:</strong> {{ movie.release_date }}</p>
      <p><strong>Durée:</strong> {{ movie.runtime }} minutes</p>
      <p><strong>Note moyenne:</strong> {{ movie.vote_average }} / 10</p>
      <div v-if="streamingOptions?.flatrate?.length">
      <div class="streaming-options">
      
      <div v-if="streamingOptions.flatrate && streamingOptions.flatrate.length">
        <h3>Streaming</h3>
        <ul>
          <li v-for="option in streamingOptions.flatrate" :key="option.provider_id">
            <img :src="'https://image.tmdb.org/t/p/w92' + option.logo_path" :alt="option.provider_name">
            <p>{{ option.provider_name }}</p>
          </li>
        </ul>
      </div>
      <div v-if="streamingOptions.buy && streamingOptions.buy.length">
        <h3>Acheter</h3>
        <ul>
          <li v-for="option in streamingOptions.buy" :key="option.provider_id">
            <img :src="'https://image.tmdb.org/t/p/w92' + option.logo_path" :alt="option.provider_name">
            <p>{{ option.provider_name }}</p>
          </li>
        </ul>
      </div>
      <div v-if="streamingOptions.rent && streamingOptions.rent.length">
        <h3>Louer</h3>
        <ul>
          <li v-for="option in streamingOptions.rent" :key="option.provider_id">
            <img :src="'https://image.tmdb.org/t/p/w92' + option.logo_path" :alt="option.provider_name">
            <p>{{ option.provider_name }}</p>
          </li>
        </ul>
      </div>
    </div>
      <div v-if="movieTrailer" class="video-container">
        <iframe
          width="560"
          height="315"
          :src="'https://www.youtube.com/embed/' + movieTrailer"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
    </div>
    <div class="movie-cast">
    <h2>Casting</h2>
    <div class="cast-member" v-for="member in cast" :key="member.cast_id" @click="goToActor(member.id)">
        <img :src="'https://image.tmdb.org/t/p/w200' + member.profile_path" :alt="member.name">
        <div>
        <h3>{{ member.name }}</h3>
        <p>{{ member.character }}</p>
        </div>
    </div>
    </div>
    </div>
    <div class="recommendations">
      <h2>Films recommandés</h2>
      <div class="recommended-movies">
        <div v-for="recommended in recommendations" :key="recommended.id" class="recommended-movie" @click="goToMovieDetails(recommended.id)">
          <img :src="'https://image.tmdb.org/t/p/w200' + recommended.poster_path" :alt="recommended.title">
          <h3>{{ recommended.title }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const movie = ref({});
const cast = ref([]);
const recommendations = ref([]);
const streamingOptions = ref({
  flatrate: [],
  buy: [],
  rent: []
});
const movieGenres = ref('');
const movieTrailer = ref('');
const apiKey = 'a446566ae142c41aa0fcfd2febbee065';
const baseUrl = 'https://api.themoviedb.org/3';

// Fonction pour charger les détails du film
async function loadMovieDetails(movieId) {
  const movieResponse = await axios.get(`${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=fr-FR&append_to_response=videos,credits`);
  movie.value = movieResponse.data;
  cast.value = movieResponse.data.credits.cast.slice(0, 10);
  movieGenres.value = movieResponse.data.genres.map(genre => genre.name).join(', ');
  const trailer = movieResponse.data.videos.results.find(video => video.site === 'YouTube' && video.type === 'Trailer');
  movieTrailer.value = trailer ? trailer.key : '';
  const providersResponse = await axios.get(`${baseUrl}/movie/${movieId}/watch/providers?api_key=${apiKey}`);
  const providersData = providersResponse.data.results.FR || {};
  streamingOptions.value = {
    flatrate: providersData.flatrate || [],
    buy: providersData.buy || [],
    rent: providersData.rent || [],
  };
  const recommendationsResponse = await axios.get(`${baseUrl}/movie/${movieId}/recommendations?api_key=${apiKey}&language=fr-FR`);
  recommendations.value = recommendationsResponse.data.results;
}

// Watcher sur la route pour recharger les données quand l'ID change
watch(() => route.params.id, (newId) => {
  loadMovieDetails(newId);
});

onMounted(() => {
  loadMovieDetails(route.params.id);
});

function goToMovieDetails(movieId) {
  router.push({ name: 'MovieDetails', params: { id: movieId } });
}

function goToActor(id) {
  router.push({ name: 'ActorDetails', params: { id } });
}
</script>

<style>
.movie-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.movie-poster {
  max-width: 300px;
}
.movie-info {
  text-align: center;
  margin: 20px;
}
.movie-cast {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}
.cast-member {
  margin: 10px;
  text-align: center;
}
.cast-member img {
  width: 100px;
  height: auto;
  border-radius: 50%;
}
.video-container {
  max-width: 60%;
  margin: 20px auto;
  aspect-ratio: 16 / 9;
}
.video-container iframe {
  width: 100%;
  height: 100%;
}
.streaming-options {
  margin-top: 20px;
  text-align: center;
}

.streaming-options h2 {
  margin-bottom: 10px;
}
.streaming-options h3 {
  margin-top: 10px;
}
.streaming-options ul {
  list-style-type: none;
  padding: 0;
}

.streaming-options li {
  display: inline-block;
  margin: 0 10px;
}

.streaming-options img {
  width: 50px; /* Tu peux ajuster la taille comme tu veux */
  height: auto;
  margin-bottom: 5px;
}

.recommendations {
  margin-top: 20px;
  text-align: center;
}

.recommended-movies {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

</style>

