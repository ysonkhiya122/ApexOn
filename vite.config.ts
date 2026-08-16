import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    // Allow tunneled/preview hostnames during development.
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2020",
    sourcemap: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split long-lived vendor code from app code so a content change
        // doesn't invalidate the entire download for returning users.
        // Matched on resolved path, not package entry name, so deep imports
        // (react-dom/client, @reduxjs/toolkit/query/react) group correctly.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          const pkg = id.split("node_modules/").pop()!.split("/")[0];

          if (pkg === "react" || pkg === "react-dom" || pkg === "scheduler") {
            return "vendor-react";
          }
          if (pkg.startsWith("react-router")) return "vendor-router";
          if (pkg === "@reduxjs" || pkg === "react-redux" || pkg === "immer" || pkg === "reselect") {
            return "vendor-redux";
          }
          if (pkg === "lucide-react") return "vendor-icons";
          return "vendor";
        },
      },
    },
  },
});
