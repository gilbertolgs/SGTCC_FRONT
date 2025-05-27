<script lang="ts">
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import { Pencil, Trash } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { storeLogin } from '../../stores';
	import type Proposta from '$model/Proposta';

	const toast = new Toaster(getContext);

	let usuarioLogado = $derived($storeLogin);

	interface Props {
		openState: any;
		proposta: Proposta | null;
		abrirModal: Function;
		getPropostas: Function;
	}

	let { openState = $bindable(), proposta, abrirModal, getPropostas }: Props = $props();

	$effect(() => {
		if (proposta) {
		}
	});
</script>

<ModalBase bind:openState>
	{#snippet conteudo()}
		{#if proposta}
			<div class="flex h-full flex-col gap-3">
				<div class="grid grid-flow-col">
					<h3 class="h3">{proposta.nomeProjeto}</h3>
				</div>
				<hr class="mx-5 my-2 opacity-30" />
				<div class="flex gap-2">
					<button
						class="btn preset-filled-primary-500"
						onclick={() => {
							abrirModal('Adicionar', proposta);
						}}
					>
						<Pencil /> Alterar
					</button>
					<button
						class="btn preset-filled-error-500"
						onclick={() => {
							abrirModal('Apagar', proposta);
						}}
					>
						<Trash /> Excluir
					</button>
				</div>
			</div>
		{/if}
	{/snippet}
</ModalBase>
