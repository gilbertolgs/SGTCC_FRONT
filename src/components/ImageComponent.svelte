<script lang="ts">
	import { generateRandomCanvas } from '$lib/canvasUtils';
	import { onMount } from 'svelte';

	let { objeto } = $props();

	//Gambiarra pro Typescript não reclamar
	let imgUrl: string | null = $derived(objeto.ExibeImagem() ?? null);

	function imagemExiste(imgUrl: string) {
		return imgUrl.trim() !== '';
	}

	async function defineImagem(imgOriginal: string, idObjeto: number) {
		console.log(objeto.nome);
		if (imagemExiste(imgOriginal)) {
			console.log('caiu aki');
			return imgOriginal;
		}

		const imagemGerada = await generateRandomCanvas(idObjeto, idObjeto);
		if (!imagemGerada) {
			return imgOriginal;
		}

		return imagemGerada.imageUrl;
	}

	$effect(() => {
		defineImagem(objeto.ExibeImagem(), objeto.id).then((novaImagem) => {
			imgUrl = novaImagem;
		});
	});
</script>

{#if imgUrl}
	<img class="min-w-26 rounded" src={imgUrl} alt="" />
{:else}
	<div class="placeholder h-15 min-w-26 animate-pulse"></div>
{/if}
