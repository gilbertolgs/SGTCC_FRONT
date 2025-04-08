<script lang="ts">
	import ModalBase from '$components/ModalBase.svelte';

	import Toaster from '$lib/ToastHandler';
	import { getContext } from 'svelte';
	const toast = new Toaster(getContext);

	let { openState = $bindable(), titulo, texto, funcao } = $props();
</script>

<ModalBase
	bind:openState
	classe="card grid bg-surface-100-900 p-4 space-y-4 shadow-xl w-full md:w-3/4"
>
	{#snippet conteudo()}
		<h4 class="h4">{titulo}</h4>
		<span>{texto}</span>
		<div class="flex justify-end">
			<button class="btn preset-filled-primary-500 m-2" onclick={funcao}>Confirma</button>
			<button
				class="btn preset-filled-error-500 m-2"
				onclick={() => {
					openState = false;
				}}>Cancelar</button
			>
		</div>
	{/snippet}
</ModalBase>
