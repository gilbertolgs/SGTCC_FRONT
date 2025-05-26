<script lang="ts">
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
	import FileHandler from '$lib/FileHandler';
	import Toaster from '$lib/ToastHandler';
	import Arquivo from '$model/Arquivo';
	import type LoggedUser from '$model/LoggedUser';
	import type Projeto from '$model/Projeto';
	import ProjetoArquivoRepository from '$repository/ProjetoArquivoRepository';
	import { FileUpload, type FileUploadApi } from '@skeletonlabs/skeleton-svelte';
	import { FilePlus2, Pencil, Trash } from 'lucide-svelte';
	import IconRemove from 'lucide-svelte/icons/circle-x';
	import IconFile from 'lucide-svelte/icons/paperclip';
	import { getContext, onMount } from 'svelte';
	import { storeLogin } from '../../../../stores';
	import BotoesArquivo from '../components/BotoesArquivo.svelte';
	import TabelaArquivos from '../components/TabelaArquivos.svelte';
	import DataFormatHandler from '$lib/DataFormatHandler';

	const toast = new Toaster(getContext);

	interface Props {
		projeto: Projeto;
	}

	let usuarioLogado: LoggedUser | null = $state<LoggedUser | null>(null);
	storeLogin.subscribe((value) => {
		usuarioLogado = value;
	});
	let { projeto }: Props = $props();
	let arquivos: Arquivo[] | null = $state(null);

	let openStateApagar = $state(false);
	let arquivoSelecionado = $state(new Arquivo(0, 0, '', '', '', '', '', 0));
	let fileUploadApi: FileUploadApi;
	let linhaSelecionada = $state(0);

	onMount(async () => {
		await getArquivos();
	});

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Apagar':
				arquivoSelecionado = argumentos;
				openStateApagar = !openStateApagar;
				break;

			default:
				break;
		}
	}

	async function getArquivos() {
		arquivos = await ProjetoArquivoRepository.PegarTodosPorProjeto(projeto.id);

		arquivos.sort((b, a) => {
			return new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime() || a.id - b.id;
		});
	}

	function selecionaLinha(arquivo: Arquivo) {
		linhaSelecionada = arquivo.idExterno;
		arquivoSelecionado.id = arquivo.id;
		arquivoSelecionado.nomeOriginal = arquivo.nomeOriginal;
		console.log(linhaSelecionada);
	}

	async function apagaArquivoSelecionado() {
		try {
			const response = await ProjetoArquivoRepository.ApagarArquivo(arquivoSelecionado.idExterno);

			arquivoSelecionado = new Arquivo(0, 0, '', '', '', '', '', 0);
			openStateApagar = false;
			toast.triggerSuccess('Arquivo excluido com sucesso!');

			await getArquivos();
		} catch (error) {
			openStateApagar = false;
			toast.triggerError('Ocorreu um erro ao tentar apagar arquivo!');
			console.log(error);
		}
	}

	async function apagaArquivo() {
		try {
			const response = await ProjetoArquivoRepository.ApagarArquivo(linhaSelecionada);

			openStateApagar = false;
			linhaSelecionada = 0;
			toast.triggerSuccess('Arquivo excluido com sucesso!');

			await getArquivos();
		} catch (error) {
			toast.triggerError('Ocorreu um erro ao tentar apagar arquivo!');
			console.log(error);
		}
	}

	async function baixaArquivo() {
		try {
			const idArquivo = arquivoSelecionado.id;
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

		if (!usuarioLogado) {
			return;
		}

		if (!file) {
			return;
		}

		try {
			await ProjetoArquivoRepository.EnviarArquivo(projeto.id, usuarioLogado.id, file);
			toast.triggerSuccess('Arquivo enviado com sucesso!');
			linhaSelecionada = 0;
			await getArquivos();
		} catch (error) {
			toast.triggerError('Erro ao tentar enviar Arquivo');
			console.error('Error uploading file:', error);
		}
		fileUploadApi.clearFiles();
	}
</script>

<ConfirmDialog
	bind:openState={openStateApagar}
	titulo="Tem certeza que deseja apagar essa versão da documentação"
	texto="Documentação: {arquivoSelecionado.nomeOriginal}"
	funcao={apagaArquivoSelecionado}
/>

<FileUpload
	name="example"
	maxFiles={1}
	label="Insira um arquivo aqui"
	onFileChange={onFileSelected}
	onFileReject={console.error}
	classes="w-full"
	onApiReady={(_api) => (fileUploadApi = _api)}
>
	{#snippet iconInterface()}<FilePlus2 class="size-8" />{/snippet}
	{#snippet iconFile()}<IconFile class="size-4" />{/snippet}
	{#snippet iconFileRemove()}<IconRemove class="size-4" />{/snippet}
</FileUpload>

<BotoesArquivo {linhaSelecionada} {selecionaLinha} {baixaArquivo} {abrirModal} />

<div class="grid gap-4">
	<div class="preset-tonal flex flex-col gap-3 border p-4 shadow-md">
		{#if arquivos && arquivos.length > 0}
			{#each arquivos as arquivo, i}
				{#if i > 0}
					<hr />
				{/if}
				<div class="grid">
					<span class="text-primary-500">{arquivos.length - i}</span>
					<span>
						<button
							class="hover:text-primary-500 mb-auto ml-auto fill-current hover:underline"
							onclick={() => {
								arquivoSelecionado = arquivo;
								baixaArquivo();
							}}>{arquivo.nomeOriginal}</button
						>
					</span>
					<span>
						{DataFormatHandler.FormatDate(arquivo.criadoEm)}
					</span>
					<button
						class="hover:text-error-500 mb-auto ml-auto fill-current"
						onclick={() => {
							abrirModal('Apagar', arquivo);
						}}><Trash /></button
					>
				</div>
			{/each}
		{:else}
			<span>Não há Arquivos por enquanto</span>
		{/if}
	</div>
</div>

<!-- <TabelaArquivos {arquivos} {linhaSelecionada} {selecionaLinha} /> -->
