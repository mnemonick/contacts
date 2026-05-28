import {defineConfig, devices} from '@playwright/test'
import path from 'path'

export default defineConfig({
	testDir: './tests',
	baseURL: 'http://localhost:5173',

	use: {
		headless: false
	},

	webServer: {cwd: path.resolve(import.meta.dirname, '..', 'frontend'),
		command: 'pnpm vite',
		url: 'http://localhost:5173'
	}
})