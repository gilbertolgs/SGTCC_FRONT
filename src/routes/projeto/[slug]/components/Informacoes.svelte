<script lang="ts">
	import DataFormatHandler from '$lib/DataFormatHandler';
	import type Projeto from '$model/Projeto';
	import { Check, X as IconX, Pencil } from 'lucide-svelte';

	interface Props {
		projeto: Projeto;
	}
	let { projeto }: Props = $props();
</script>

<div class="grid justify-center md:flex">
	<div class="preset-tonal rounded-lg p-6 shadow-md w-full">
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
			<p class="">{projeto.estado}</p>
		</div>
	</div>
	<div class="m-2 grid h-1/2 gap-2">
        <button class="btn preset-filled-warning-500"><Pencil /> Alterar Projeto</button>
		<button class="btn preset-filled-success-500"><Check /> Finalizar Projeto</button>
		<button class="btn preset-filled-error-500"><IconX /> Cancelar Projeto</button>
	</div>
</div>
