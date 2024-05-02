import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        outDir:"docs",
        emptyOutDir: true,
    },
    plugins: [react(), dts()],
})
