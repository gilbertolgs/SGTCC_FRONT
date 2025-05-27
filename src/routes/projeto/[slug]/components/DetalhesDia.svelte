<script lang="ts">
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import type Atividade from '$model/Atividade';
	import { textoEnumAtividade } from '$model/EnumAtividade';
	import { textoEnumPrioridadeAtividade } from '$model/EnumPrioridadeAtividade';
	import { date } from 'zod';

	interface Props {
		openState: any;
		atividades: Atividade[] | null;
		dia: number;
	}
	let { openState = $bindable(), atividades, dia }: Props = $props();
</script>

{#snippet atividadesDoDia()}
	<h3 class="h3">
		{DataFormatHandler.FormatDate(new Date(dia).toString())}
	</h3>
	<span class="text-xl font-bold">Atividades:</span>

	{#if atividades?.length}
		<ul class="space-y-4">
			{#each atividades as atividade}
				<li class="preset-tonal rounded p-4 shadow">
					<h4 class="text-lg font-semibold">
						{atividade.nome}
					</h4>

					{#if atividade.descricao}
						<p class="text-sm text-gray-600 italic">
							{atividade.descricao}
						</p>
					{/if}

					<div class="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 md:grid-cols-3">
						<div>Estado: {textoEnumAtividade[atividade.estado]}</div>
						<div>Prioridade: {textoEnumPrioridadeAtividade[atividade.prioridade]}</div>
						<div>Duração: {atividade.duracaoEstimada} h</div>
						<div>
							Início:
							{DataFormatHandler.FormatDate(atividade.dataInicio)}
						</div>
						{#if atividade.dataEntrega}
							<div>
								Entrega:
								{DataFormatHandler.FormatDate(atividade.dataEntrega)}
							</div>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-gray-500 italic">Sem Atividades!</p>
	{/if}
{/snippet}

<ModalBase
	bind:openState
	classe="card grid bg-surface-100-900 p-4 space-y-4 shadow-xl w-full md:w-3/4"
>
	{#snippet conteudo()}
		{@render atividadesDoDia()}
	{/snippet}
</ModalBase>
