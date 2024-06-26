import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        outDir:"dist",
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "react-minimalistic-gantt",
            fileName: (format) => `index.${format}.js`,formats:["es","cjs","umd"],

        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
        sourcemap: true,
        emptyOutDir: true,
    },
    plugins: [react(), dts()],
})
