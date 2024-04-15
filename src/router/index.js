import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomeView.vue"; // Ton composant principal
import MovieDetails from "../views/MovieDetails.vue"; // Le composant pour afficher les détails du film
import ActorDetails from "../views/ActorDetails.vue"; // Le composant pour afficher les détails de l'acteur
import TvShowDetails from "../views/TvShowDetails.vue"; // Le composant pour afficher les détails de la série TV
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: Home,
        },
        {
            path: "/movie/:id", // :id est un paramètre dynamique
            name: "MovieDetails",
            component: MovieDetails,
            props: true,
        },
        {
            path: "/actor/:id",
            name: "ActorDetails",
            component: ActorDetails,
            props: true,
        },
        {
            path: "/tv/:id",
            name: "TvShowDetails", // Nom corrigé ici
            component: TvShowDetails,
            props: true,
        },
    ],
});
export default router;
