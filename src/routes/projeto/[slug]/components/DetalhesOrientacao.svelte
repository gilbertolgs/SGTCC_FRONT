<script lang="ts">
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import type Relatorio from '$model/Relatorio';
	import { Download, Pencil, Trash } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { storeLogin } from '../../../../stores';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import RelatorioRepository from '$repository/RelatorioRepository';
	import FileHandler from '$lib/FileHandler';

	const toast = new Toaster(getContext);

	let usuarioLogado = $derived($storeLogin);

	interface Props {
		openState: any;
		relatorio: Relatorio | null;
		abrirModal: Function;
	}

	let { openState = $bindable(), relatorio, abrirModal }: Props = $props();

	async function baixarPdf(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		if (!relatorio) return;

		const response = await RelatorioRepository.GerarPdfRelatorio(relatorio?.id);
		const blob = FileHandler.FormataArquivoBaixado(response);
		const link = document.createElement('a');
		const url = window.URL.createObjectURL(blob);
		link.href = url;
		link.download = 'Relatorio ' + DataFormatHandler.FormatDate(relatorio.dataRealizacao);
		link.click();

		window.URL.revokeObjectURL(url);
	}
</script>

<ModalBase
	bind:openState
	classe="card grid bg-surface-100-900 p-4 shadow-xl w-full md:w-1/2 h-full"
>
	{#snippet conteudo()}
		{#if relatorio}
			<div class="flex h-full flex-col gap-3">
				<div class="grid grid-flow-col">
					<h3 class="h3">{relatorio.titulo ?? 'Sem título'}</h3>
				</div>
				<hr class="mx-5 my-2 opacity-30" />
				<div class="mt-4 flex gap-2">
					<button class="btn preset-outlined-primary-500" onclick={baixarPdf}>
						<Download /> Baixar
					</button>
					{#if usuarioLogado && usuarioLogado.id == relatorio.idProfessor}
						<button
							class="btn preset-outlined-primary-500"
							onclick={() => abrirModal('Adicionar', relatorio)}
						>
							<Pencil /> Alterar
						</button>
						<button
							class="btn preset-outlined-error-500"
							onclick={() => abrirModal('Apagar', relatorio)}
						>
							<Trash /> Excluir
						</button>
					{/if}
				</div>

				<p class="text-base opacity-80">Descrição: {relatorio.descricao ?? 'Sem descrição'}</p>
				<p class="text-base opacity-80">Duração: {relatorio.duracaoEncontro}h</p>
				<p class="text-base opacity-80">
					Data: {new Date(relatorio.dataRealizacao).toLocaleString()}
				</p>
				<p class="text-base opacity-80">
					Criado em: {DataFormatHandler.FormatDate(relatorio.criadoEm)}
				</p>
			</div>
		{/if}
	{/snippet}
</ModalBase>
