<script>
import { RouterLink, RouterView } from 'vue-router';
import { ref } from 'vue';
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
// Référence réactive pour savoir si l'application est installable
const installable = ref(false);
// Référence réactive pour conserver l'événement de prompt d'installation
const deferredPrompt = ref(null);
// Fonction pour afficher le bouton d'installation
const showInstallButton = (e) => {
  // Empêcher le mini-infobar d'apparaître sur mobile
  e.preventDefault();
  // Sauvegarde de l'événement pour pouvoir le déclencher plus tard
  deferredPrompt.value = e;
  // Mettre à jour le statut installable pour afficher le bouton d'installation
  installable.value = true;
};

// Fonction pour déclencher le prompt d'installation
const promptInstall = async () => {
  if (deferredPrompt.value) {
    // Afficher le prompt d'installation
    deferredPrompt.value.prompt();
    // Attendre que l'utilisateur réponde à l'invite
    const { outcome } = await deferredPrompt.value.userChoice;
    if (outcome === 'accepted') {
      console.log('L\'utilisateur a accepté l\'installation');
    } else {
      console.log('L\'utilisateur a refusé l\'installation');
    }
    // Nous n'avons plus besoin de l'événement après qu'il a été utilisé
    deferredPrompt.value = null;
    installable.value = false;
  }
};

// Écoute pour l'événement 'beforeinstallprompt' qui indique que l'installation est possible
window.addEventListener('beforeinstallprompt', showInstallButton);
</script>
<template>
  <header>
    <nav>
        <RouterLink to="/" class="linknav">Home</RouterLink>
        <button  @click="promptInstall">Installer l'app</button>
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


button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
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

