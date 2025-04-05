<script lang="ts">
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
	<ModalBase bind:openState>
		{#snippet conteudo()}
			<div class="mx-5 grid gap-2">
				<h5 class="h5">Tem certeza que deseja publicar esse Projeto?</h5>
				<span>Projeto: {projeto.nome}</span>
				<div class="m-2 grid grid-flow-col gap-3">
					<button
						class="btn preset-filled-success-500"
						onclick={() => {
							ExcluirProjeto(projeto.id);
						}}>Confirma</button
					>
					<button
						class="btn preset-filled-error-500"
						onclick={() => {
							openState = false;
						}}>Cancela</button
					>
				</div>
			</div>
		{/snippet}
	</ModalBase>
{/if}
