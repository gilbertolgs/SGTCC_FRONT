<script lang="ts">
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import CursoRepository from '$repository/CursoRepository';
	import { getContext } from 'svelte';

	const toast = new Toaster(getContext);

	let { openState = $bindable(), curso, getCursos } = $props();

	async function ExcluirCurso(idCurso: number) {
		try {
			const response = await CursoRepository.DeletarCurso(idCurso);
			openState = false;
			toast.triggerSuccess('Curso excluído com sucesso!');
			getCursos();
		} catch (error) {
			openState = false;
			toast.triggerError('Ocorreu um erro ao tentar excluir curso!');
			console.log(error);
		}
	}
</script>

<ModalBase bind:openState>
	{#snippet conteudo()}
		<div class="mx-5 grid gap-2">
			<h5 class="h5">Tem certeza que deseja excluir esse Curso?</h5>
			<span>Curso: {curso.nome}</span>
			<div class="m-2 grid grid-flow-col gap-3">
				<button
					class="btn preset-filled-success-500"
					onclick={() => {
						ExcluirCurso(curso.id);
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
