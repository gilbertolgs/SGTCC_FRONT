<script lang="ts">
	import { generateRandomCanvas } from '$lib/canvasUtils';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import FileHandler from '$lib/FileHandler';
	import type LoggedUser from '$model/LoggedUser';
	import Projeto from '$model/Projeto';
	import CursoRepository from '$repository/CursoRepository';
	import ProjetoArquivoRepository from '$repository/ProjetoArquivoRepository';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { Download, Heart, Star } from 'lucide-svelte';
	import { onMount } from 'svelte';

	interface Props {
		projeto: Projeto;
		usuarioLogado: LoggedUser | null;
	}

	let { projeto, usuarioLogado }: Props = $props();

	let imagem = $state(projeto.ExibeImagem());
	let avaliarChecado = $state(false);
	let estrelas = $derived(0);

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
		pegaEstrelas();
	});

	async function pegaEstrelas() {
		try {
			const novasEstrelas = await ProjetoRepository.PegarEstrelas(projeto.id);
			if (novasEstrelas) {
				if (usuarioLogado !== null) {
					const exists = novasEstrelas.some(
						(item: { idUsuario: number }) => item.idUsuario === usuarioLogado?.id
					);

					if (exists) {
						avaliarChecado = true;
					}
				}
				estrelas = novasEstrelas.length;
			}
		} catch (error) {
			estrelas = 0;
		}
	}

	async function avaliar() {
		if (usuarioLogado) {
			switch (avaliarChecado) {
				case true:
					await ProjetoRepository.RemoverAvaliacao(projeto.id, usuarioLogado.id);
					break;
				case false:
					await ProjetoRepository.Avaliar(projeto.id, usuarioLogado.id);
					break;

				default:
					break;
			}
			pegaEstrelas();
		}
	}

	async function baixarDocumento(
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
	) {
		try {
			const arquivos = await ProjetoArquivoRepository.PegarTodosPorProjeto(projeto.id);
			//TODO Alterar isso
			const arquivo = arquivos[0];

			const idArquivo = arquivo.id;
			const response = await ProjetoArquivoRepository.BaixarArquivo(idArquivo);
			const blob = FileHandler.FormataArquivoBaixado(response);

			const link = document.createElement('a');
			const url = window.URL.createObjectURL(blob);
			link.href = url;
			link.download = arquivo.nomeOriginal;
			link.click();

			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.log(error);
		}
	}
</script>

<div
	class="card group m-2 mx-auto grid w-full grid-cols-1 border border-stone-800 shadow-2xl drop-shadow-2xl md:w-3/4 md:grid-cols-3"
>
	<div class="grid items-center justify-between overflow-hidden p-4">
		<span class="mb-auto font-bold">
			{projeto.nome}
		</span>
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
		{:else}
			<span class="text-sm text-gray-400">Sem usuários</span>
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
	<div class="m-2 hidden flex-col md:flex">
		<span class="text-xl break-all opacity-70">{projeto.descricao}</span>
	</div>
	<div class="ml-auto flex flex-col items-end justify-between">
		<div class="m-2 grid grid-flow-col items-center gap-2">
			<span>{estrelas} Favoritos </span>
			{#if usuarioLogado}
				<label class="relative cursor-pointer brightness-125 hover:text-[#7e6eff]">
					<input
						bind:checked={avaliarChecado}
						onclick={avaliar}
						type="checkbox"
						class="peer hidden"
					/>
					<Heart class="hidden peer-checked:block" fill="#7e6eff" />
					<Heart class="block peer-checked:hidden" />
				</label>
			{/if}
		</div>

		<div class="m-2">
			<button class="btn preset-filled-secondary-500" onclick={baixarDocumento}>
				<Download />
				Baixar PDF</button
			>
			{#if projeto.dataFim}
				<span class="font-sans font-extralight"
					>{DataFormatHandler.FormatDate(projeto.dataFim)}</span
				>
			{/if}
		</div>
	</div>
</div>
