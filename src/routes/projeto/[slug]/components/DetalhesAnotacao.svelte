<script lang="ts">
	import Toaster from '$lib/ToastHandler';
	import type LoggedUser from '$model/LoggedUser';
	import { getContext } from 'svelte';
	import { storeLogin } from '../../../../stores';
	import type Anotacao from '$model/Anotacao';
	import ModalBase from '$components/ModalBase.svelte';
	import DrawerBase from '$components/DrawerBase.svelte';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import { Pencil, Trash } from 'lucide-svelte';

	const toast = new Toaster(getContext);

	let usuarioLogado: LoggedUser | null = $state<LoggedUser | null>(null);

	storeLogin.subscribe((value) => {
		console.log(value);

		usuarioLogado = value;
	});

	interface Props {
		openState: any;
		anotacao: Anotacao | null;
		abrirModal: Function;
		getAnotacoes: Function;
	}

	let { openState = $bindable(), anotacao, abrirModal, getAnotacoes }: Props = $props();

	$effect(() => {
		if (anotacao) {
		}
	});
</script>

<ModalBase
	bind:openState
>
	{#snippet conteudo()}
		{#if anotacao}
			<div class="flex h-full flex-col gap-3">
				<div class="grid grid-flow-col">
					<h3 class="h3">{anotacao.titulo}</h3>
				</div>
				<hr class="mx-5 my-2 opacity-30" />
				<div class="flex gap-2">
					<button
						class="btn preset-filled-primary-500"
						onclick={() => {
							abrirModal('Adicionar', anotacao);
						}}
					>
						<Pencil /> Alterar
					</button>
					<button
						class="btn preset-filled-error-500"
						onclick={() => {
							abrirModal('Apagar', anotacao);
						}}
					>
						<Trash /> Excluir
					</button>

					<span class="md:ml-auto">
						{anotacao.nomeUsuario}
					</span>
				</div>
				{#if anotacao.descricao.trim().length > 0}
					<span class="preset-tonal h-full p-2 text-lg">{anotacao.descricao}</span>
				{/if}
				<span class="mt-auto ml-auto opacity-70">
					{DataFormatHandler.FormatDate(anotacao.criadoEm)}
				</span>
			</div>
		{/if}
	{/snippet}
</ModalBase>
