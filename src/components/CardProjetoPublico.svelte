<script lang="ts">
	import { generateRandomCanvas } from '$lib/canvasUtils';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import type Projeto from '$model/Projeto';
	import type Usuario from '$model/Usuario';
	import CursoRepository from '$repository/CursoRepository';
	import { Avatar, Progress } from '@skeletonlabs/skeleton-svelte';
	import { Download, Star } from 'lucide-svelte';
	import { onMount } from 'svelte';

	interface Props {
		projeto: Projeto;
	}
	let { projeto }: Props = $props();

	let imagem = $state(projeto.ExibeImagem());
	let progresso = $state(50);

	function imagemExiste(imgUrl: string) {
		return imgUrl.trim() !== '';
	}

	function defineImagem() {
		if (imagemExiste(imagem)) {
			return imagem;
		}

		CursoRepository.PegarPorId(projeto.usuarios[0].idCurso).then((curso) => {
			imagem = curso.ExibeImagem();

			if (imagemExiste(imagem)) {
				return imagem;
			}

			generateRandomCanvas(projeto.id, projeto.usuarios[0].idCurso).then((imagemGerada) => {
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
	class="card group m-2 mx-auto flex w-full border border-stone-800 shadow-2xl drop-shadow-2xl md:w-3/4"
>
	<div class="m-2 overflow-hidden">
		<img
			src={imagem}
			alt="Imagem do Projeto"
			class="rounded-xl transition-all delay-100 duration-300 md:min-w-30"
		/>
	</div>
	<div class="grid items-center justify-between overflow-hidden p-4">
		<a href={`/projeto/${projeto.id}`} class="anchor mb-auto font-bold">
			{projeto.nome}
		</a>
		{#if projeto.usuarios.length > 0}
			<div class="grid max-h-20 gap-2 overflow-y-auto">
				{#each projeto.usuarios as usuario}
					<a href={`/usuario/${usuario.id}`} class="w-fit">
						<div class="flex items-center gap-2">
							<Avatar
								classes="select-none"
								size="size-6"
								src={usuario.ExibeImagem()}
								name={usuario.nome}
							/>
							<span class="anchor">
								{usuario.nome}
							</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
		{#if projeto.tags.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each projeto.tags as tag}
					<div class="preset-filled-primary-500 chip">
						{tag.nome}
					</div>
				{/each}
			</div>
		{/if}
	</div>
	<div class="m-2 flex flex-col">
		<span class="text-xl break-normal opacity-70">{projeto.descricao}</span>
		<button class="btn preset-filled-secondary-500 mt-auto">
			<Download />
			Baixar PDF</button
		>
	</div>
	<div class="ml-auto flex flex-col items-end justify-between">
		<button class="group/estrela m-2 brightness-125 hover:text-[#e3d664]">
			<Star class="hidden group-hover/estrela:block" fill="#e3d664" />
			<Star class="block group-hover/estrela:hidden" />
		</button>
		<div class="m-2">
			<span>
				<span class="text-[#e3d664] brightness-125">X</span>Estrelas
			</span>
			{#if projeto.dataFim}
				<span class="font-sans font-extralight"
					>{DataFormatHandler.FormatDate(projeto.dataFim)}</span
				>
			{/if}
		</div>
	</div>
</div>