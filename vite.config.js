import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  // plugins: [react(), svgr(), ], //mkcert()
  plugins: [react(), svgr(), mkcert()], 
  // server: { port: 3000 },
  server: { https: true, port: 3000 },
});
