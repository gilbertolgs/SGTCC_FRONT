<script lang="ts">
	import CropperComponent from '$components/CropperComponent.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import CursoRepository from '$repository/CursoRepository';

	import Toaster from '$lib/ToastHandler';
	import { getContext } from 'svelte';
	const toast = new Toaster(getContext);

	let { openState = $bindable(), curso, getCursos } = $props();
	console.log(curso);
	

	async function salvaImagem(idCurso: number, nomeImagem: string, imagemMontada: { blob: Blob; imageUrl: string }) {
		const resultado = await CursoRepository.AlterarImagem(
			idCurso,
			imagemMontada.blob,
			nomeImagem
		).catch((error) => {
			openState = false;
			toast.triggerError('Ocorreu um erro ao tentar alterar imagem!');
		});

		if (resultado) {
			openState = false;
			toast.triggerSuccess('Imagem Alterada com Sucesso!');

			getCursos();
		}
	}

	function modalClose() {
		openState = false;
	}
</script>

<ModalBase
	bind:openState
	classe="card grid bg-surface-100-900 p-4 space-y-4 shadow-xl w-full md:w-3/4"
>
	{#snippet conteudo()}
		<CropperComponent objeto={curso} {salvaImagem} cropShape="rect" aspect={16 / 9} />
	{/snippet}
</ModalBase>
