<script>
import { RouterLink, RouterView } from 'vue-router';
export default {
  data() {
    return {
      sidenavOpen: false
    };
  },
  methods: {
    toggleSidenav() {
      this.sidenavOpen = !this.sidenavOpen;
    }
  }
};
</script>
<template>
  <header>
    <nav>
        <RouterLink to="/" class="linknav">Home</RouterLink>
    </nav> 
    <div id="mySidenav" class="sidenav" :class="{ 'active': sidenavOpen }">
      <!-- Utilise @click.prevent pour appeler toggleSidenav et prévenir le comportement par défaut du lien -->
      <a id="closeBtn" href="#" class="close" @click.prevent="toggleSidenav">&times;</a>
      <ul>
        <li><RouterLink to="/" class="linknav">Home</RouterLink></li>
      </ul>
    </div>
    <!-- Utilise @click.prevent pour appeler toggleSidenav ici aussi -->
    <a href="#" id="openBtn" @click.prevent="toggleSidenav">
      <span class="burger-icon">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </a>
  </header>
  <RouterView/>
  
</template>
<style scoped> 
body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  background-color: rgb(245, 245, 247);
  overflow-x: hidden;
}

.linknav {
 color: white;
 font-size: 1.2rem;
}

nav .linknav {
  position: relative;
  display: inline-block;
  padding-bottom: 5px; /* Espacement pour le trait */
  overflow: hidden; /* Garde le pseudo-élément dans les limites du lien */
  text-decoration: none; /* Retire le soulignement par défaut */
}

nav .linknav::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%; /* Commence au milieu */
  width: 0; /* Commence sans largeur */
  height: 3px; /* Épaisseur du trait */
  background-color: #ffffff; /* Couleur du trait */
  transition: width 0.3s ease 0s, left 0.3s ease 0s; /* Animation pour l'apparition du trait */
}

nav .linknav:hover::after {
  width: 100%; /* Le trait s'étend à 100% de la largeur du lien */
  left: 0; /* Déplace le trait pour qu'il commence depuis le bord gauche */
}


.mobile {
  display: none;
}
nav{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  background-color: rgba(22, 22, 23, 0.8);
  width: 100%;
  gap: 1%;
  color: white !important;
}

a {
  margin-right: 10%;
}

footer {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: center;
  justify-items: center;
  align-items: center;
  background-color: rgb(245, 245, 247);
  padding: 1rem;
  gap: 1%;
}

.mail {
  color: black;
  text-decoration: none;
}

.icones {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.icones img {
  width: 3rem;
  height: auto;
}

.sidenav {
  display: none;
}

@media screen and (max-width: 768px) {
  nav {
    justify-content: center;
    gap: 40px;
    display: none;
  }
  a {
    margin-right: 0;
  }
  footer {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .icones {
    justify-content: center;
  }
  .mobile {
    display: flex;
    justify-content: center;
    gap: 40px;
  }

  /* MOBILE */
  /* Sidenav menu */
.sidenav {
  display: flex;
  height: 100%;
  width: 250px;
  position: fixed;
  z-index: 999;
  top: 0;
  left: -270px;
  background-color: rgba(69, 69, 69, 0.975);
  box-shadow: 10px 0 10px rgba(0, 0, 0, 0.8);
  padding-top: 60px;
  transition: left 0.5s ease;
}

.sidenav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

/* Sidenav menu links */
.sidenav a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: var(--vt-c-white-light);
  display: block;
  transition: 0.3s;
}

.sidenav a:hover {
  color: var(--vt-c-blue-dark);
}

/* Active class */
.sidenav.active {
  left: 0;
}

/* Close btn */
.sidenav .close {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
}


.burger-icon span {
  display: block;
  width: 35px;
  height: 5px;
  background-color: black;
  margin: 10px;
}
}
</style>

