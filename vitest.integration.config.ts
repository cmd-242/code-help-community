import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/** Tests d'intégration : nécessitent une vraie base PostgreSQL (DATABASE_URL). Lancés en CI. */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@content": fileURLToPath(new URL("./content", import.meta.url)),
      "server-only": fileURLToPath(new URL("./tests/stubs/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/integration/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 20000,
  },
});
