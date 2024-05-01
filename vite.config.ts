import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/component/index.ts"),
            name: "react-minimalistic-gantt",
            fileName: (format) => `index.${format}.js`,
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
