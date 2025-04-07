<script lang="ts">
	import { generateRandomCanvas } from '$lib/canvasUtils.js';
	import type Projeto from '$model/Projeto.js';
	import CursoRepository from '$repository/CursoRepository.js';
	import ProjetoRepository from '$repository/ProjetoRepository.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	let idProjeto = data.idProjeto;
	let projeto: Projeto | null = $state(null);
	let imagemProjeto: string = $state('');

	function imagemExiste(imgUrl: string) {
		return imgUrl.trim() !== '';
	}

	function defineImagem(projetoAtual: Projeto) {
		if (imagemExiste(imagemProjeto)) {
			return imagemProjeto;
		}

		CursoRepository.PegarPorId(projetoAtual.usuarios[0].idCurso).then((curso) => {
			imagemProjeto = curso.ExibeImagem();

			if (imagemExiste(imagemProjeto)) {
				return imagemProjeto;
			}

			generateRandomCanvas(projetoAtual.id, projetoAtual.usuarios[0].idCurso).then(
				(imagemGerada) => {
					if (!imagemGerada) {
						return imagemProjeto;
					}

					imagemProjeto = imagemGerada.imageUrl;
				}
			);
		});
	}

	onMount(async () => {
		projeto = await ProjetoRepository.PegarPorId(idProjeto);
		console.log(projeto);

		defineImagem(projeto);
	});
</script>

{#if projeto}
	<img src={imagemProjeto} alt="" />
{/if}
