<script lang="ts">
	import CropperComponent from '$components/CropperComponent.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import { getContext } from 'svelte';
	const toast = new Toaster(getContext);

	let { openState = $bindable(), usuario, getUsuario } = $props();

	async function salvaImagem(idCurso: number, nomeImagem: string, imagemMontada: { blob: Blob; imageUrl: string }) {
		const resultado = await UsuarioRepository.AlterarImagem(
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

			getUsuario(usuario.id);
		}
	}

	function modalClose() {
		openState = false;
	}
</script>

<ModalBase
	bind:openState
	classe="card flex flex-col bg-surface-100-900 p-4 space-y-4 shadow-xl md:h-auto h-full w-full md:w-3/4"
>
	{#snippet conteudo()}
		<CropperComponent objeto={usuario} {salvaImagem} cropShape="round" aspect={1 / 1} />
	{/snippet}
</ModalBase>
