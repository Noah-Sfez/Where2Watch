<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

export default {
  setup() {
    const installable = ref(false);
    const deferredPrompt = ref(null);
    const isIOS = ref((/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream));
    const showModal = ref(false);
    function checkForIOS() {
      // Coerce the value into a boolean with double bang (!!)
      isIOS.value = !!navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
                    !window.MSStream &&
                    navigator.userAgent.match(/AppleWebKit/);
    }
    function toggleModal() {
      showModal.value = !showModal.value;
    }
    function showInstallButton(e) {
      e.preventDefault();
      deferredPrompt.value = e;
      installable.value = true;
    }

    async function promptInstall() {
      if (deferredPrompt.value) {
        deferredPrompt.value.prompt();
        const { outcome } = await deferredPrompt.value.userChoice;
        if (outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt.value = null;
        installable.value = false;
      }
    }

    onMounted(() => {
      window.addEventListener('beforeinstallprompt', showInstallButton);
      checkForIOS();
    });

    onUnmounted(() => {
      window.removeEventListener('beforeinstallprompt', showInstallButton);
    });

    return {
      installable,
      isIOS,
      promptInstall
    };
  }
};
</script>
<template>
  <header>
    <nav>
        <RouterLink to="/" class="linknav">Home</RouterLink>
        <button v-if="installable && !isIOS" @click="promptInstall">Installer l'app</button>
        <button v-if="isIOS" @click="toggleModal">Voir comment installer</button>
    </nav> 
    <div id="mySidenav" class="sidenav" :class="{ 'active': sidenavOpen }">
      <!-- Utilise @click.prevent pour appeler toggleSidenav et prévenir le comportement par défaut du lien -->
      <a id="closeBtn" href="#" class="close" @click.prevent="toggleSidenav">&times;</a>
      <ul>
        <li><RouterLink to="/" class="linknav">Home</RouterLink></li>
        <button v-if="installable && !isIOS" @click="promptInstall">Installer l'app</button>
        <button v-if="isIOS" @click="toggleModal">Voir comment installer</button>
      </ul>
    </div>
    <a href="#" id="openBtn" @click.prevent="toggleSidenav">
      <span class="burger-icon">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </a>
  </header>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="toggleModal">&times;</span>
      <h2>Installer sur iOS</h2>
      <p>Pour ajouter cette application à votre écran d'accueil :</p>
      <ol>
        <li>Cliquez sur l'icône de partage en bas de votre navigateur Safari.</li>
        <li>Faites défiler vers le bas et cliquez sur 'Sur l'écran d'accueil'.</li>
        <li>Donnez un nom à l'application puis cliquez sur 'Ajouter'.</li>
      </ol>
    </div>
  </div>
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
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
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

