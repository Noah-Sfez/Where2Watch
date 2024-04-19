import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from "vite-plugin-pwa";

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            // vos options ici
            registerType: "autoUpdate",
            includeAssets: [
                "favicon.svg",
                "robots.txt",
                "apple-touch-icon.png",
            ],
            manifest: {
                // les détails de votre manifeste
                name: "Where 2 Watch",
                short_name: "W2W",
                theme_color: "#ffffff",
                icons: [
                    {
                        src: "pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    // autres tailles d'icônes si nécessaire
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
