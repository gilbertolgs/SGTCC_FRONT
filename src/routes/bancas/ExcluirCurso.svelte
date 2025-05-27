<script lang="ts">
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
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
			toast.triggerError('Ocorreu um erro ao tentar apagar curso!');
			console.log(error);
		}
	}
</script>

<ConfirmDialog
	bind:openState
	titulo="Tem certeza que deseja apagar esse Curso?"
	texto="Curso: {curso.nome}"
	funcao={() => {
		ExcluirCurso(curso.id);
	}}
/>