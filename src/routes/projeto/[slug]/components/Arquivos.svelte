<script lang="ts">
	import TableBaseComponent from '$components/TableBaseComponent.svelte';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import FileHandler from '$lib/FileHandler';
	import Toaster from '$lib/ToastHandler';
	import Arquivo from '$model/Arquivo';
	import type Projeto from '$model/Projeto';
	import ProjetoArquivoRepository from '$repository/ProjetoArquivoRepository';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
	import { Download, FilePlus2, X as IconX, Trash } from 'lucide-svelte';
	import IconRemove from 'lucide-svelte/icons/circle-x';
	import IconFile from 'lucide-svelte/icons/paperclip';
	import { getContext, onMount } from 'svelte';

	const toast = new Toaster(getContext);

	interface Props {
		projeto: Projeto;
	}
	let { projeto }: Props = $props();
	let arquivos: Arquivo[] | null = $state(null);
	let tamanhoTotal: string = $state('0');

	onMount(async () => {
		await getArquivos();
	});

	async function getArquivos() {
		arquivos = await ProjetoArquivoRepository.PegarTodosPorProjeto(projeto.id);

		const tamanhoTotalBytes = arquivos.reduce((acc, file) => acc + file.tamanho, 0);
		tamanhoTotal = DataFormatHandler.FormatBytes(tamanhoTotalBytes);
	}

	const camposCabecalho = ['ID', 'Extensão', 'Nome', 'Ultima Alteração', 'Tamanho'];

	let linhaSelecionada = $state(0);

	function selecionaLinha(idArquivo: number) {
		linhaSelecionada = idArquivo;
		console.log(linhaSelecionada);
	}

	async function apagaArquivo() {
		try {
			const response = await ProjetoArquivoRepository.ApagarArquivo(linhaSelecionada);
			// openState = false;
			toast.triggerSuccess('Arquivo excluido com sucesso!');
			linhaSelecionada = 0;
			await getArquivos();
		} catch (error) {
			toast.triggerError('Ocorreu um erro ao tentar excluir arquivo!');
			console.log(error);
		}
	}

	async function baixaArquivo(idArquivo: number) {
		try {
			const response = await ProjetoArquivoRepository.BaixarArquivo(idArquivo);
			const blob = FileHandler.FormataArquivoBaixado(response);

			const link = document.createElement('a');
			const url = window.URL.createObjectURL(blob);
			link.href = url;
			link.download = arquivoSelecionado.nomeOriginal;
			link.click();

			window.URL.revokeObjectURL(url);
		} catch (error) {
			toast.triggerError('Ocorreu um erro ao tentar baixar o arquivo!');
			console.log(error);
		}
	}

	async function onFileSelected(e: { acceptedFiles: any[]; rejectedFiles: any[] }) {
		let file = e.acceptedFiles[0];

		if (file) {
			try {
				await ProjetoArquivoRepository.EnviarArquivo(projeto.id, file);
				toast.triggerSuccess('Arquivo enviado com sucesso!');
				linhaSelecionada = 0;
				await getArquivos();
			} catch (error) {
				toast.triggerError('Erro ao tentar enviar Arquivo');
				console.error('Error uploading file:', error);
			}
		} else {
			console.error('No file selected.');
		}

		//TODO limpar fileupload
	}

	let arquivoSelecionado = $state(new Arquivo(0, 0, '', '', '', '', '', 0));
</script>

<FileUpload
	name="example"
	maxFiles={1}
	label="Insira um arquivo aqui"
	onFileChange={onFileSelected}
	onFileReject={console.error}
	classes="w-full"
>
	{#snippet iconInterface()}<FilePlus2 class="size-8" />{/snippet}
	{#snippet iconFile()}<IconFile class="size-4" />{/snippet}
	{#snippet iconFileRemove()}<IconRemove class="size-4" />{/snippet}
</FileUpload>

{#if linhaSelecionada !== 0}
	<div class="preset-tonal grid w-full grid-flow-col rounded md:w-min">
		<button
			onclick={() => {
				selecionaLinha(0);
			}}
			class="btn hover:text-primary-500 flex"><IconX /> Cancelar</button
		>
		<button
			onclick={() => {
				baixaArquivo(arquivoSelecionado.id);
			}}
			class="btn hover:text-success-500 flex"><Download /> Baixar</button
		>
		<button
			onclick={() => {
				apagaArquivo();
			}}
			class="btn hover:text-error-500 flex"><Trash /> Excluir</button
		>
	</div>
{/if}

{#snippet cabecalhoCursos()}
	<thead>
		<tr>
			{#each camposCabecalho as campo}
				<td>{campo}</td>
			{/each}
		</tr>
	</thead>
{/snippet}
{#if arquivos}
	<TableBaseComponent
		{camposCabecalho}
		arrObjetosTamanho={arquivos.length}
		labelObjeto="Arquivos, {tamanhoTotal} Utilizados"
	>
		{#snippet cabecalho()}
			{@render cabecalhoCursos()}
		{/snippet}
		{#snippet corpo()}
			{#if arquivos}
				{#each arquivos as arquivo}
					<tr
						class=" {linhaSelecionada === arquivo.idExterno
							? 'preset-filled-primary-500'
							: 'even:preset-tonal'}"
						onclick={() => {
							selecionaLinha(arquivo.idExterno);
							arquivoSelecionado.id = arquivo.id;
							arquivoSelecionado.nomeOriginal = arquivo.nomeOriginal;
						}}
					>
						<td>{arquivo.idExterno}</td>
						<td>{arquivo.extensao}</td>
						<td>{arquivo.nomeOriginal}</td>
						<td>{arquivo.ExibeUltimaAlteracao()}</td>
						<td>{DataFormatHandler.FormatBytes(arquivo.tamanho, 2)}</td>
					</tr>
				{/each}
			{/if}
		{/snippet}
	</TableBaseComponent>
{:else}
	<TableBaseComponent
		{camposCabecalho}
		arrObjetosTamanho={1}
		labelObjeto="Arquivos, {tamanhoTotal} Utilizados"
	>
		{#snippet cabecalho()}
			{@render cabecalhoCursos()}
		{/snippet}
		{#snippet corpo()}
			<tr class="">
				<td class="">
					<div class="placeholder animate-pulse"></div>
				</td>
				<td class="flex items-center gap-2">
					<div class="placeholder h-15 min-w-26 animate-pulse"></div>
					<div class="placeholder h-2 w-full animate-pulse"></div>
				</td>
				<td class="">
					<div class="placeholder animate-pulse"></div>
				</td>
				<td class="">
					<div class="placeholder animate-pulse"></div>
				</td>
				<td class="">
					<div class="placeholder animate-pulse"></div>
				</td>
			</tr>
		{/snippet}
	</TableBaseComponent>
{/if}
