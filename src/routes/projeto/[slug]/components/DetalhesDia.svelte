<script lang="ts">
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import type Atividade from '$model/Atividade';
	import { date } from 'zod';

	interface Props {
		openState: any;
		atividades: Atividade[] | null;
		dia: number;
	}
	let { openState = $bindable(), atividades, dia }: Props = $props();
</script>

<ModalBase
	bind:openState
	classe="card grid bg-surface-100-900 p-4 space-y-4 shadow-xl w-full md:w-3/4"
>
	{#snippet conteudo()}
		{DataFormatHandler.FormatDate(new Date(dia).toString())}
		{#if atividades}
			{#each atividades as atividade}
				{atividade.nome}
			{/each}
		{/if}
	{/snippet}
</ModalBase>
