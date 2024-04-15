<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
const route = useRoute();
const tvShow = ref({});
const genres = ref('');
const apiKey = 'a446566ae142c41aa0fcfd2febbee065';
const baseUrl = 'https://api.themoviedb.org/3';
onMounted(async () => {
  try {
    const response = await axios.get(`${baseUrl}/tv/${route.params.id}?api_key=${apiKey}&language=fr-FR`);
    tvShow.value = response.data;
    genres.value = response.data.genres.map(genre => genre.name).join(', ');
  } catch (error) {
    console.error('Erreur lors du chargement des détails de la série TV:', error);
  }
});
</script>
<template>
  <div class="tv-show-details">
    <img :src="'https://image.tmdb.org/t/p/w500' + tvShow.poster_path" :alt="tvShow.name" class="tv-show-poster">
    <div class="tv-show-info">
      <h1>{{ tvShow.name }}</h1>
      <p>{{ tvShow.overview }}</p>
      <p><strong>Genres:</strong> {{ genres }}</p>
      <p><strong>Date de première diffusion:</strong> {{ tvShow.first_air_date }}</p>
      <p><strong>Note moyenne:</strong> {{ tvShow.vote_average }} / 10</p>
      <!-- Autres informations sur la série TV -->
    </div>
  </div>
</template>

