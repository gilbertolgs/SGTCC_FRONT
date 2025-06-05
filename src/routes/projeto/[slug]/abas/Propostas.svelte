<script lang="ts">
	import DataFormatHandler from '$lib/DataFormatHandler';
	import Toaster from '$lib/ToastHandler';
	import type Projeto from '$model/Projeto';
	import type Proposta from '$model/Proposta';
	import PropostaRepository from '$repository/PropostaRepository';
	import { Plus } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import FormAdicionarProposta from '../components/FormAdicionarProposta.svelte';
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
	import { textoEnumParecerProposta } from '$model/EnumParecerProposta';

	const toast = new Toaster(getContext);

	interface Props {
		projeto: Projeto;
		getProjeto: Function;
		data: any;
	}
	let { projeto, getProjeto, data }: Props = $props();

	let openStateFinalizar = $state(false);
	let openStateApagar = $state(false);
	let openStateDetalhes = $state(false);
	let openStateAdicionar = $state(false);

	let propostas: Proposta[] | null = $state(null);
	let propostaSelecionada: Proposta | null = $state(null);

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Apagar':
				propostaSelecionada = argumentos;
				openStateApagar = !openStateApagar;
				break;
			case 'Adicionar':
				propostaSelecionada = argumentos;
				openStateAdicionar = !openStateAdicionar;
				break;

			default:
				break;
		}
	}

	async function getPropostas() {
		propostas = await PropostaRepository.PegarPorIdProjeto(projeto.id);
	}

	$effect(() => {
		getPropostas();
	});

	async function adicionarProposta(
		idProposta: number,
		atividadesPropostas: string,
		contribuicaoAgenda: string,
		sugestao: string
	) {
		try {
			if (idProposta === 0) {
				await PropostaRepository.CriarProposta(projeto.id, atividadesPropostas, contribuicaoAgenda, '');
			} else {
				await PropostaRepository.AlterarProposta(
					idProposta,
					atividadesPropostas,
					contribuicaoAgenda,
					sugestao
				);
			}
			toast.triggerSuccess('Sucesso adicionar Proposta');
		} catch (error) {
			toast.triggerError('Erro ao tentar adicionar Proposta');
		}
		openStateAdicionar = false;
		propostaSelecionada = null;
		getPropostas();
	}

	async function apagarProposta(idProposta: number | undefined) {
		if (!idProposta) {
			return;
		}

		try {
			const response = await PropostaRepository.Deletar(idProposta);
			openStateApagar = false;
			openStateDetalhes = false;
			openStateAdicionar = false;
			toast.triggerSuccess('Proposta excluída com sucesso!');
			getPropostas();
		} catch (error) {
			openStateApagar = false;
			toast.triggerError('Ocorreu um erro ao tentar apagar proposta!');
		}
	}
</script>

<!-- <ConfirmDialog
	bind:openState={openStateFinalizar}
	titulo="Tem certeza que deseja finalizar esse projeto?"
	texto="Projeto: {projeto.nome}"
	funcao={finalizarProjeto}
/>
 -->

<ConfirmDialog
	bind:openState={openStateApagar}
	titulo="Tem certeza que deseja apagar essa proposta?"
	texto="Proposta de Projeto: {projeto.nome}"
	funcao={apagarProposta}
/>

<FormAdicionarProposta
	AdicionarProposta={adicionarProposta}
	bind:openState={openStateAdicionar}
	proposta={propostaSelecionada}
	{data}
/>

<div class="grid">
	<button
		onclick={() => {
			abrirModal('Adicionar');
		}}
		class="btn preset-filled-success-500 mt-auto md:ml-auto"
	>
		<Plus />Adicionar
	</button>
	<div class="mt-2 grid gap-6 md:flex md:flex-col md:items-center">
		{#if propostas}
			{#each propostas as proposta}
				<div class="preset-tonal w-full rounded-lg p-6 shadow-md md:w-3/4">
					<div class="mb-4">
						<span class="text-surface-700-300 font-bold">Atividades Propostas:</span>
						<p>{proposta.atividadesPropostas}</p>
					</div>

					<div class="mb-4">
						<span class="text-surface-700-300 font-bold">Contribuição para a Agenda:</span>
						<p>{proposta.contribuicaoAgenda}</p>
					</div>

					<div class="mb-4">
						<span class="text-surface-700-300 font-bold">Parecer:</span>
						<p>{textoEnumParecerProposta[proposta.parecer]}</p>
					</div>

					<div class="mb-4">
						<span class="text-surface-700-300 font-bold">Criado em:</span>
						<p>{DataFormatHandler.FormatDate(proposta.criadoEm)}</p>
					</div>

					{#if proposta.sugestao.trim().length > 0}
						<div class="mb-4">
							<span class="text-surface-700-300 font-bold">Sugestão de Coordenador</span>
							<p>{proposta.sugestao}</p>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</div>
