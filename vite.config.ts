import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  // Base path for GitHub Pages - should match your repository name
  // If your repo is at https://username.github.io/repo-name/, use '/repo-name/'
  // If your repo is at https://username.github.io/, use '/'
  base: "/src/RSVP/",
});
