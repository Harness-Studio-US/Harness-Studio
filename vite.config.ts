import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  // Which Ollama answers. Defaults to this machine; set VITE_AI_UPSTREAM to a
  // LAN address (http://192.168.1.42:11434) to use a model running elsewhere.
  const upstream = env.VITE_AI_UPSTREAM?.trim() || "http://127.0.0.1:11434";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: "0.0.0.0",
      port: 3000,
      proxy: {
        // Local demos run Harness Copilot and Harness Code against Ollama.
        // The browser only ever calls /api/ollama, so the model can live on any
        // machine this one can reach — no CORS, no mixed content.
        "/api/ollama": {
          target: upstream,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/ollama/, "/v1"),
        },
      },
    },
  };
});
