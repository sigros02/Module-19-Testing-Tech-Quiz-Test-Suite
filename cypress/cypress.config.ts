import { defineConfig } from "cypress";
import react from "@vitejs/plugin-react";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: {
        plugins: [react()],
      },
    },
  },
  e2e: {
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
}); 
