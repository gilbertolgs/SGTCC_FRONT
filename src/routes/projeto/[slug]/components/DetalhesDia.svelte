<script lang="ts">
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
	import ModalBase from '$components/ModalBase.svelte';

	let { openState = $bindable(), atividades } = $props();
</script>

<ModalBase
	bind:openState
	classe="card grid bg-surface-100-900 p-4 space-y-4 shadow-xl w-full md:w-3/4"
>
	{#snippet conteudo()}{/snippet}
</ModalBase>
