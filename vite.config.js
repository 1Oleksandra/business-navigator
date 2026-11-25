import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

async function installPartnersApi(server) {
  const { createPartnersApi } = await import("./server/partners.js");
  const api = createPartnersApi();
  server.middlewares.use(api.middleware);
  server.httpServer?.once("close", api.close);
}

export default defineConfig({
  base: "/business-navigator/",

  plugins: [
    react(),
    {
      name: "business-navigator-partners",
      configureServer: installPartnersApi,
      configurePreviewServer: installPartnersApi,
    },
  ],
});