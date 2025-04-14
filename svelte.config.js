import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],

	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/components',
			$repository: 'src/repository',
			$model: 'src/model',
			$lib: 'src/lib',
			$images: 'src/images',
			$static: 'static/'
		}
	},

	extensions: ['.svelte', '.svx']
};

export default config;
