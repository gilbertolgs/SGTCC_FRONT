<script lang="ts">
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import Toaster from '$lib/ToastHandler';
	import { EnumEstadoProjeto } from '$model/EnumEstadoProjeto';
	import type Projeto from '$model/Projeto';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import { Check, X as IconX, ImagePlus, Pencil } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import AlterarImagemProjeto from './AlterarImagemProjeto.svelte';

	const toast = new Toaster(getContext);

	interface Props {
		projeto: Projeto;
		getProjeto: Function;
	}
	let { projeto, getProjeto }: Props = $props();

	let openStateFinalizar = $state(false);
	let openStateCancelar = $state(false);
	let openStateImagem = $state(false);

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Finalizar':
				openStateFinalizar = !openStateFinalizar;
				break;
			case 'Cancelar':
				openStateCancelar = !openStateCancelar;
				break;
			case 'Imagem':
				openStateImagem = !openStateImagem;
				break;

			default:
				break;
		}
	}

	async function finalizarProjeto() {
		try {
			const response = await ProjetoRepository.FinalizarProjeto(projeto.id);
			openStateFinalizar = false;
			toast.triggerSuccess('Projeto Finalizado com sucesso!');
			await getProjeto();
		} catch (error) {
			toast.triggerError('Ocorreu um erro ao tentar finalizar projeto!');
			console.log(error);
		}
	}

	async function cancelarProjeto() {
		try {
			const response = await ProjetoRepository.CancelarProjeto(projeto.id);
			openStateCancelar = false;
			toast.triggerSuccess('Projeto Cancelado com sucesso!');
			await getProjeto();
		} catch (error) {
			toast.triggerError('Ocorreu um erro ao tentar cancelar projeto!');
			console.log(error);
		}
	}
</script>

<ConfirmDialog
	bind:openState={openStateFinalizar}
	titulo="Tem certeza que deseja finalizar esse projeto?"
	texto="Projeto: {projeto.nome}"
	funcao={finalizarProjeto}
/>

<ConfirmDialog
	bind:openState={openStateCancelar}
	titulo="Tem certeza que deseja cancelar esse projeto?"
	texto="Projeto: {projeto.nome}"
	funcao={cancelarProjeto}
/>

<AlterarImagemProjeto bind:openState={openStateImagem} {projeto} {getProjeto} />

<div class="grid justify-center md:flex">
	<div class="preset-tonal w-full rounded-lg p-6 shadow-md">
		<div class="mb-4">
			<span class="text-surface-700-300 font-bold">Nome:</span>
			<p class="">{projeto.nome}</p>
		</div>

		<div class="mb-4">
			<span class="text-surface-700-300 font-bold">Descrição:</span>
			<p class="">{projeto.descricao}</p>
		</div>

		<div class="mb-4">
			<span class="text-surface-700-300 font-bold">Justificativa:</span>
			<p class="">{projeto.justificativa}</p>
		</div>

		<div class="mb-4">
			<span class="text-surface-700-300 font-bold">Data de Início:</span>
			<p class="">{DataFormatHandler.FormatDate(projeto.dataInicio)}</p>
		</div>

		{#if projeto.tags && projeto.tags.length > 0}
			<div class="mb-4">
				<span class="text-surface-700-300 font-bold">Tags:</span>
				<div class="flex flex-wrap gap-2">
					{#each projeto.tags as tag}
						<span class="chip preset-filled-primary-500 flex flex-wrap">{tag.nome}</span>
					{/each}
				</div>
			</div>
		{/if}

		<div class="mb-4">
			<span class="text-surface-700-300 font-bold">Estado:</span>
			<p class="">{projeto.ExibeStatus()}</p>
		</div>
	</div>
	{#if projeto.estado == EnumEstadoProjeto.EmProgresso || projeto.estado == EnumEstadoProjeto.Criado}
		<div class="m-2 grid h-1/2 gap-2">
			<button class="btn preset-filled-primary-500"><Pencil /> Alterar Projeto</button>
			<button
				onclick={() => {
					abrirModal('Imagem');
				}}
				class="btn preset-filled-warning-500"><ImagePlus /> Alterar Imagem</button
			>
			<button
				onclick={() => {
					abrirModal('Finalizar');
				}}
				class="btn preset-filled-success-500 mt-3"><Check /> Finalizar Projeto</button
			>
			<button
				onclick={() => {
					abrirModal('Cancelar');
				}}
				class="btn preset-filled-error-500"><IconX /> Cancelar Projeto</button
			>
		</div>
	{/if}
</div>
