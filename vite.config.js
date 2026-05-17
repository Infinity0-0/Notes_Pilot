import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true, generatedRouteTree: "./src/routeTree.gen.js", disableTypes: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  server: {
    port: 8080,
  }
});
