<script lang="ts">
	import type Projeto from '$model/Projeto';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import { getContext, onMount } from 'svelte';
	import { pageName } from '../../stores';
	import PublicarProjeto from './PublicarProjeto.svelte';
	import TableProjetos from './TableProjetos.svelte';

	import Toaster from '$lib/ToastHandler';
	const toast = new Toaster(getContext);

	let { data } = $props();

	let openState = $state(false);
	let openStatePublicar = $state(false);
	let projetos: Projeto[] | null = $state(null);
	let projeto: Projeto | null = $state(null);

	async function getProjetos() {
		projetos = await ProjetoRepository.PegarPendentes();
	}
	onMount(async () => {
		await getProjetos();

		openStatePublicar = true;
	});

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Insert':
				projeto = argumentos;
				openState = !openState;
				break;

			case 'Publicar':
				console.log(argumentos);
				
				if (argumentos == null) return;

				projeto = argumentos;
				openStatePublicar = !openStatePublicar;
				break;

			default:
				break;
		}
	}
</script>

<svelte:head>
	<title>{pageName} - Projetos</title>
	<meta name="Página de administrador exibindo projetos" content="Exibindo projetos" />
</svelte:head>

<PublicarProjeto bind:openState={openStatePublicar} {projeto} {getProjetos} />

<div class="grid">
	<TableProjetos {abrirModal} {getProjetos} {projetos} />
</div>
