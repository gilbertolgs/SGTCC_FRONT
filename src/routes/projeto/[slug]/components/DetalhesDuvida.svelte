<script lang="ts">
	import ModalBase from '$components/ModalBase.svelte';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import Toaster from '$lib/ToastHandler';
	import type Anotacao from '$model/Anotacao';
	import type LoggedUser from '$model/LoggedUser';
	import { Pencil, Trash } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { storeLogin } from '../../../../stores';
	import type Duvida from '$model/Duvida';

	const toast = new Toaster(getContext);

	let usuarioLogado: LoggedUser | null = $state<LoggedUser | null>(null);

	storeLogin.subscribe((value) => {
		console.log(value);

		usuarioLogado = value;
	});

	interface Props {
		openState: any;
		duvida: Duvida | null;
		abrirModal: Function;
		getDuvidas: Function;
	}

	let { openState = $bindable(), duvida, abrirModal, getDuvidas }: Props = $props();

	$effect(() => {
		if (duvida) {
		}
	});
</script>

<ModalBase bind:openState>
	{#snippet conteudo()}
		{#if duvida}
			<div class="flex h-full flex-col gap-3">
				<div class="grid grid-flow-col">
					<h3 class="h3">{duvida.texto}</h3>
				</div>
				<hr class="mx-5 my-2 opacity-30" />
				<div class="flex gap-2">
					<button
						class="btn preset-filled-primary-500"
						onclick={() => {
							abrirModal('Adicionar', duvida);
						}}
					>
						<Pencil /> Alterar
					</button>
					<button
						class="btn preset-filled-error-500"
						onclick={() => {
							abrirModal('Apagar', duvida);
						}}
					>
						<Trash /> Excluir
					</button>
				</div>
				<!-- {#if duvida.descricao.trim().length > 0}
					<span class="preset-tonal h-full p-2 text-lg">{duvida.descricao}</span>
				{/if}
				<span class="mt-auto ml-auto opacity-70">
					{DataFormatHandler.FormatDate(duvida.criadoEm)}
				</span> -->
			</div>
		{/if}
	{/snippet}
</ModalBase>
