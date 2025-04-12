import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/4inarow/",
  build: {
    outDir: "dist", // Ensure this is set correctly
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
