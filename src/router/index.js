import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomeView.vue"; // Ton composant principal
import MovieDetails from "../views/MovieDetails.vue"; // Le composant pour afficher les détails du film

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
            component: () => import("../views/ActorDetails.vue"), // Assure-toi que le chemin est correct
            props: true,
        },
        
    ],
});

export default router;
