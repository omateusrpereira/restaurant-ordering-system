import { loadEnvFile } from "node:process";
import { defineConfig } from "vitest/config";

loadEnvFile(".env");

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/models/**/*.ts"],
    },
  },
});
