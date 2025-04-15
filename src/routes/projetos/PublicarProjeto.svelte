<script lang="ts">
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import { getContext, onMount } from 'svelte';

	const toast = new Toaster(getContext);

	let { openState = $bindable(), projeto, getProjetos } = $props();

	async function ExcluirProjeto(idProjeto: number) {
		try {
			const response = await ProjetoRepository.TornarPublico(idProjeto);
			openState = false;
			toast.triggerSuccess('Projeto publicado com sucesso!');
			getProjetos();
		} catch (error) {
			openState = false;
			toast.triggerError('Ocorreu um erro ao tentar publicar projeto!');
			console.log(error);
		}
	}
</script>

{#if projeto}
	<ConfirmDialog
		bind:openState
		titulo="Tem certeza que deseja publicar esse Projeto?"
		texto="Projeto: {projeto.nome}"
		funcao={() => {
			ExcluirProjeto(projeto.id);
		}}
	/>
{/if}
