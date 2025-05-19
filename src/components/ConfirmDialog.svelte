<script lang="ts">
	import ModalBase from '$components/ModalBase.svelte';

	import Toaster from '$lib/ToastHandler';
	import { getContext } from 'svelte';
	const toast = new Toaster(getContext);

	let { openState = $bindable(), titulo, texto, funcao } = $props();
</script>

<ModalBase bind:openState>
	{#snippet conteudo()}
		<div class="grid gap-10 justify-items-center">
			<h4 class="h4">{titulo}</h4>
			<span>{texto}</span>
			<div class="flex justify-end">
				<button class="btn preset-tonal m-2" onclick={funcao}>Confirmar</button>
				<button
					class="btn preset-filled-error-500 m-2"
					onclick={() => {
						openState = false;
					}}>Cancelar</button
				>
			</div>
		</div>
	{/snippet}
</ModalBase>
