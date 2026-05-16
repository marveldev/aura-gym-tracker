import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api/exercises": {
				target: "https://oss.exercisedb.dev",
				changeOrigin: true,
				rewrite: (path) =>
					path.replace(/^\/api\/exercises/, "/api/v1/exercises"),
			},
		},
	},
})
