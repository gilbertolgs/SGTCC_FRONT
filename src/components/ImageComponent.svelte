<script lang="ts">
	import { generateRandomCanvas } from '$lib/canvasUtils';
	import { onMount } from 'svelte';

	let { objeto } = $props();

	let imgUrl: null | string = $state(null);

	function imagemExiste(imgUrl: string) {
		return imgUrl.trim() !== '';
	}

	async function defineImagem(imgOriginal: string, idObjeto: number) {
		if (imagemExiste(imgOriginal)) {
			return imgOriginal;
		}

		const imagemGerada = await generateRandomCanvas(idObjeto, idObjeto);
		if (!imagemGerada) {
			return imgOriginal;
		}

		return imagemGerada.imageUrl;
	}

	onMount(async () => {
		imgUrl = await defineImagem(objeto.ExibeImagem(), objeto.id);
	});
</script>

{#if imgUrl}
	<img class="min-w-26 rounded" src={imgUrl} alt="" />
{:else}
	<div class="placeholder h-15 min-w-26 animate-pulse"></div>
{/if}
