<script lang="ts">
	import { generateRandomCanvas } from '$lib/canvasUtils';
	import type Projeto from '$model/Projeto';
	import type Usuario from '$model/Usuario';
	import CursoRepository from '$repository/CursoRepository';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import { onMount } from 'svelte';

	interface Props {
		projeto: Projeto;
		usuario: Usuario;
	}
	let { projeto, usuario }: Props = $props();

	let imagem = $state(projeto.ExibeImagem());
	let progresso = $state(50);

	function imagemExiste(imgUrl: string) {
		return imgUrl.trim() !== '';
	}

	function defineImagem() {
		if (imagemExiste(imagem)) {
			return imagem;
		}

		CursoRepository.PegarPorId(usuario.idCurso).then((curso) => {
			imagem = curso.ExibeImagem();

			if (imagemExiste(imagem)) {
				return imagem;
			}

			generateRandomCanvas(projeto.id, usuario.idCurso).then((imagemGerada) => {
				if (!imagemGerada) {
					return imagem;
				}

				imagem = imagemGerada.imageUrl;				
			});
		});
	}

	onMount(() => {
		defineImagem();
	});
</script>

<div
	class="card group m-2 mx-auto flex w-full flex-col justify-between border border-stone-800 shadow-2xl drop-shadow-2xl md:w-80"
>
	<div>
		<div class="overflow-hidden rounded-t-xl">
			<img
				src={imagem}
				alt="Imagem do Projeto"
				class="w-full transition-all delay-100 duration-300 group-hover:scale-110 md:min-w-30"
			/>
		</div>
		<hr class="text-stone-800" />

		<div class="grid items-center justify-between p-4 overflow-hidden">
			<div>
				<a href={`/projeto/${projeto.id}`} class="anchor font-bold">
					{projeto.nome}
				</a>
				<div class="text-xs break-normal opacity-70">{projeto.descricao}</div>
			</div>
		</div>
	</div>
	<div class="m-2 grid gap-3">
		<span class="text-primary-500 mx-2">Progresso: {progresso}%</span>
		<Progress value={progresso} max={100} meterBg="bg-primary-500" />
	</div>
	{#if projeto.tags.length > 0}
		<div class="p-2 flex flex-wrap gap-2">
			{#each projeto.tags as tag}
				<div class="preset-filled-primary-500 chip">
					{tag.nome}
				</div>
			{/each}
		</div>
	{/if}
</div>
