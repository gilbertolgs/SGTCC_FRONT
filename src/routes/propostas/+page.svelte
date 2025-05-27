<script lang="ts">
	import Toaster from '$lib/ToastHandler';
	import { EnumParecerProposta } from '$model/EnumParecerProposta';
	import type Proposta from '$model/Proposta';
	import PropostaRepository from '$repository/PropostaRepository';
	import { getContext, onMount } from 'svelte';
	import { pageName, storeLogin } from '../../stores';
	import TableProposta from './TableProposta.svelte';
	import DetalhesProposta from './DetalhesProposta.svelte';

	const toast = new Toaster(getContext);

	let openStateDetalhes = $state(false);
	let usuarioLogado = $derived($storeLogin);

	let propostas: Proposta[] | null = $state(null);
	let propostaSelecionada: Proposta | null = $state(null);

	async function getPropostas() {
		if (usuarioLogado) {
			propostas = await PropostaRepository.PegarPorIdCurso(usuarioLogado.idCurso);
			console.log(propostas);
		}
	}

	onMount(async () => {
		await getPropostas();
	});

	async function retornarParecerProposta(idProposta: number, parecer: EnumParecerProposta) {
		await PropostaRepository.Parecer(idProposta, parecer);
		if (parecer == EnumParecerProposta.Desfavoravel) {
			toast.triggerSuccess('Proposta reprovada com sucesso!');
		} else {
			toast.triggerSuccess('Proposta aprovada com sucesso!');
		}
		await getPropostas();
	}

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Detalhes':
				propostaSelecionada = argumentos;
				openStateDetalhes = !openStateDetalhes;
				break;

			default:
				break;
		}
	}
</script>

<svelte:head>
	<title>{pageName} - Propostas</title>
	<meta name="Página de coordenador exibindo propostas" content="Exibindo propostas" />
</svelte:head>

<DetalhesProposta
	bind:openState={openStateDetalhes}
	proposta={propostaSelecionada}
	{abrirModal}
	{getPropostas}
/>

<TableProposta {abrirModal} {getPropostas} {propostas} />
