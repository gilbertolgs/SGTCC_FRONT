<script lang="ts">
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
	import FileHandler from '$lib/FileHandler';
	import Toaster from '$lib/ToastHandler';
	import Arquivo from '$model/Arquivo';
	import type LoggedUser from '$model/LoggedUser';
	import type Projeto from '$model/Projeto';
	import ProjetoArquivoRepository from '$repository/ProjetoArquivoRepository';
	import { FileUpload, type FileUploadApi } from '@skeletonlabs/skeleton-svelte';
	import { FilePlus2 } from 'lucide-svelte';
	import IconRemove from 'lucide-svelte/icons/circle-x';
	import IconFile from 'lucide-svelte/icons/paperclip';
	import { getContext, onMount } from 'svelte';
	import { storeLogin } from '../../../../stores';
	import BotoesArquivo from '../components/BotoesArquivo.svelte';
	import TabelaArquivos from '../components/TabelaArquivos.svelte';

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
				openStateApagar = !openStateApagar;
				break;

			default:
				break;
		}
	}

	async function getArquivos() {
		arquivos = await ProjetoArquivoRepository.PegarTodosPorProjeto(projeto.id);
	}

	function selecionaLinha(arquivo: Arquivo) {
		linhaSelecionada = arquivo.idExterno;
		arquivoSelecionado.id = arquivo.id;
		arquivoSelecionado.nomeOriginal = arquivo.nomeOriginal;
		console.log(linhaSelecionada);
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
	titulo="Tem certeza que deseja apagar esse arquivo"
	texto="Arquivo: {arquivoSelecionado.nomeOriginal}"
	funcao={apagaArquivo}
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

<TabelaArquivos {arquivos} {linhaSelecionada} {selecionaLinha} />
