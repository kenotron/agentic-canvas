import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: parseInt(process.env.VITE_PORT || "13000"),
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
