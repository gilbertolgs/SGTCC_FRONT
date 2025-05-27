<script lang="ts">
	import Toaster from '$lib/ToastHandler';
	import { EnumParecerProposta } from '$model/EnumParecerProposta';
	import type Proposta from '$model/Proposta';
	import PropostaRepository from '$repository/PropostaRepository';
	import { getContext, onMount } from 'svelte';
	import { pageName, storeLogin } from '../../stores';
	import TableProposta from './TableProposta.svelte';
	import DetalhesProposta from './DetalhesProposta.svelte';
	import FormRetornaParecer from './FormRetornaParecer.svelte';

	let { data } = $props();

	const toast = new Toaster(getContext);

	let usuarioLogado = $derived($storeLogin);

	let openStateDetalhes = $state(false);
	let openStateParecer = $state(false);

	let propostas: Proposta[] | null = $state(null);
	let propostaSelecionada: Proposta | null = $state(null);

	async function getPropostas() {
		if (usuarioLogado) {
			propostas = await PropostaRepository.PegarPorIdCurso(usuarioLogado.idCurso);
		}
		console.log(propostas);
	}

	onMount(async () => {
		await getPropostas();
	});

	async function retornarParecerProposta(
		idProposta: number,
		sugestao: string,
		parecer: EnumParecerProposta
	) {
		if (!propostaSelecionada) return;
		try {
			if (sugestao && sugestao.length > 0) {
				await PropostaRepository.AlterarProposta(
					idProposta,
					propostaSelecionada.atividadesPropostas,
					propostaSelecionada.contribuicaoAgenda,
					sugestao
				);
			}

			await PropostaRepository.Parecer(idProposta, parecer);
			if (parecer == EnumParecerProposta.Desfavoravel) {
				toast.triggerSuccess('Proposta reprovada com sucesso!');
			} else {
				toast.triggerSuccess('Proposta aprovada com sucesso!');
			}
			await getPropostas();
		} catch (error) {
			toast.triggerError('Erro ao retornar Parecer');
		}
		openStateDetalhes = false;
		openStateParecer = false;
		getPropostas();
	}

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Parecer':
				propostaSelecionada = argumentos;
				openStateParecer = !openStateParecer;
				openStateDetalhes = false;
				break;
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

<FormRetornaParecer
	RetornarParecer={retornarParecerProposta}
	bind:openState={openStateParecer}
	proposta={propostaSelecionada}
	{data}
/>

<DetalhesProposta
	bind:openState={openStateDetalhes}
	proposta={propostaSelecionada}
	{abrirModal}
	{getPropostas}
/>

<TableProposta {abrirModal} {getPropostas} {propostas} />
