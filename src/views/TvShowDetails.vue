<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
const route = useRoute();
const router = useRouter(); // Initialise router avec useRouter
const tvShow = ref({});
const genres = ref('');
const apiKey = 'a446566ae142c41aa0fcfd2febbee065';
const baseUrl = 'https://api.themoviedb.org/3';
onMounted(async () => {
  try {
    const detailsResponse = await axios.get(`${baseUrl}/tv/${route.params.id}?api_key=${apiKey}&language=fr-FR`);
    const creditsResponse = await axios.get(`${baseUrl}/tv/${route.params.id}/credits?api_key=${apiKey}&language=fr-FR`);
    const videosResponse = await axios.get(`${baseUrl}/tv/${route.params.id}/videos?api_key=${apiKey}&language=fr-FR`);
    
    tvShow.value = detailsResponse.data;
    tvShow.value.cast = creditsResponse.data.cast; // Ajout du casting
    tvShow.value.crew = creditsResponse.data.crew; // Ajout de l'équipe de production
    tvShow.value.videos = videosResponse.data.results; // Ajout des vidéos
    genres.value = detailsResponse.data.genres.map(genre => genre.name).join(', ');
  } catch (error) {
    console.error('Erreur lors du chargement des détails de la série TV:', error);
  }
});
function getActorImageUrl(actor) {
  return actor.profile_path ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` : ''; // You can use a placeholder image URL if profile_path is null
}
function goToActorDetails(actorId) {
  router.push({ name: 'ActorDetails', params: { id: actorId } });
}


</script>
<template>
  <div class="tv-show-details">
    <img :src="'https://image.tmdb.org/t/p/w500' + tvShow.poster_path" :alt="tvShow.name" class="tv-show-poster">
    <div class="tv-show-info">
      <h1>{{ tvShow.name }}</h1>
      <p>{{ tvShow.overview }}</p>
      <p><strong>Genres:</strong> {{ genres }}</p>
      <p><strong>Date de première diffusion:</strong> {{ tvShow.first_air_date }}</p>
      <p><strong>Statut:</strong> {{ tvShow.status }}</p>
      <p><strong>Note moyenne:</strong> {{ tvShow.vote_average }} / 10</p>
      <p><strong>Nombre de saisons:</strong> {{ tvShow.number_of_seasons }}</p>
      <p><strong>Nombre d'épisodes:</strong> {{ tvShow.number_of_episodes }}</p>
      
      <div v-if="tvShow.cast && tvShow.cast.length" class="cast-container">
        <h2>Casting</h2>
        <div class="cast-list">
          <div class="cast-member" v-for="actor in tvShow.cast" :key="actor.id" @click="goToActorDetails(actor.id)">
            <img :src="getActorImageUrl(actor)" :alt="actor.name" class="cast-photo">
            <h3>{{ actor.name }}</h3>
            <p>as {{ actor.character }}</p>
          </div>
        </div>
      </div>
      
      <!-- Équipe de production -->
      <div v-if="tvShow.crew && tvShow.crew.length">
        <h2>Équipe de Production</h2>
        <ul>
          <li v-for="crewMember in tvShow.crew" :key="crewMember.credit_id">
            {{ crewMember.name }} - {{ crewMember.job }}
          </li>
        </ul>
      </div>
      
      <!-- Vidéos -->
      <div v-if="tvShow.videos && tvShow.videos.length">
        <h2>Vidéos</h2>
        <div class="videos-container">
          <iframe 
            v-for="video in tvShow.videos" 
            :key="video.id" 
            width="560" 
            height="315" 
            :src="'https://www.youtube.com/embed/' + video.key" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.cast-container {
  text-align: center;
}

.cast-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.cast-member {
  margin: 10px;
  text-align: center;
}

.cast-photo {
  width: 100px; /* or any other size */
  height: auto;
  border-radius: 50%;
}
</style>

