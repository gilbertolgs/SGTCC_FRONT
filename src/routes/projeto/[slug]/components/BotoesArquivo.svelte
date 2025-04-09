<script lang="ts">
	import { Download, Trash, X as IconX } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let { linhaSelecionada, selecionaLinha, baixaArquivo, abrirModal } = $props();
</script>

{#if linhaSelecionada}
	<div
		in:fade={{ duration: 200 }}
		class=" preset-tonal mt-2 grid w-full grid-flow-col rounded md:w-min"
	>
		<button
			onclick={() => {
				selecionaLinha(0);
			}}
			class="btn hover:text-primary-500 flex"><IconX /> Cancelar</button
		>
		<button
			onclick={() => {
				baixaArquivo();
			}}
			class="btn hover:text-success-500 flex"><Download /> Baixar</button
		>
		<button
			onclick={() => {
				abrirModal('Apagar');
			}}
			class="btn hover:text-error-500 flex"><Trash /> Excluir</button
		>
	</div>
{:else}
	<div class=" mt-2 grid w-full grid-flow-col rounded opacity-0 md:w-min">
		<button class="btn hover:text-primary-500 flex cursor-default"><IconX /> Cancelar</button>
	</div>
{/if}
