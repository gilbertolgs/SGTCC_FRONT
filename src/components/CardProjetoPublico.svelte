<script lang="ts">
	import { generateRandomCanvas } from '$lib/canvasUtils';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import type Projeto from '$model/Projeto';
	import type Usuario from '$model/Usuario';
	import CursoRepository from '$repository/CursoRepository';
	import { Avatar, Progress } from '@skeletonlabs/skeleton-svelte';
	import { Star } from 'lucide-svelte';
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

		<div class="grid grid-flow-col">
			<div class="grid items-center justify-between overflow-hidden p-4">
				<div>
					<a href={`/projeto/${projeto.id}`} class="anchor font-bold">
						{projeto.nome}
					</a>
					<div class="text-xs break-normal opacity-70">{projeto.descricao}</div>
				</div>
			</div>
			<button class="group/estrela mt-3 mr-2 mb-auto ml-auto brightness-125 hover:text-[#e3d664]">
				<Star class="hidden group-hover/estrela:block" fill="#e3d664" />
				<Star class="block group-hover/estrela:hidden" />
			</button>
		</div>
	</div>
	{#if projeto.usuarios.length > 0}
		<div class="grid gap-2 p-2">
			{#each projeto.usuarios as usuario}
				<a href={`/usuario/${usuario.id}`}>
					<div class="flex items-center gap-2">
						<Avatar
							classes="select-none"
							size="size-8"
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
		<div class="flex flex-wrap gap-2 p-2">
			{#each projeto.tags as tag}
				<div class="preset-filled-primary-500 chip">
					{tag.nome}
				</div>
			{/each}
		</div>
	{/if}
	{#if projeto.dataFim}
		<span class="m-2 ml-auto font-sans font-extralight"
			>{DataFormatHandler.FormatDate(projeto.dataFim)}</span
		>
	{/if}
</div>
