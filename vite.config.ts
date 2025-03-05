import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { join } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enable global test functions like `describe`, `it`, `expect`
    environment: "jsdom", // Use jsdom for simulating browser behavior in tests
    include: ["**/*.test.tsx", "**/*.test.ts"], // Include test files with the .test.tsx or .test.ts extensions
    setupFiles: [join(__dirname, "src/setupTests.ts")], // Optional: if you need any setup files
  },
});
