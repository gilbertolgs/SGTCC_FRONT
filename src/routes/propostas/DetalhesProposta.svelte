<script lang="ts">
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import { MessageSquareQuote, Pencil, Trash } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { storeLogin } from '../../stores';
	import type Proposta from '$model/Proposta';
	import { textoEnumParecerProposta } from '$model/EnumParecerProposta';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import type Usuario from '$model/Usuario';
	import { EnumConvite } from '$model/EnumConvite';

	const toast = new Toaster(getContext);

	let usuarioLogado = $derived($storeLogin);

	interface Props {
		openState: any;
		proposta: Proposta | null;
		abrirModal: Function;
		getPropostas: Function;
	}

	let { openState = $bindable(), proposta, abrirModal, getPropostas }: Props = $props();

	let participantes: Usuario[] | null = $state(null);

	$effect(() => {
		if (proposta) {
		}
		getParticipantes();
	});

	async function getParticipantes() {
		if (!proposta) return;
		const participantesGerais = await UsuarioRepository.PegarTodosPorProjeto(proposta?.idProjeto);
		participantes = participantesGerais.filter((p) => p.estado == EnumConvite.Aceito);
	}
</script>

<ModalBase bind:openState>
	{#snippet conteudo()}
		{#if proposta}
			<div class="flex h-full flex-col gap-3">
				<div class="grid grid-flow-col">
					<h3 class="h3">{proposta.nomeProjeto}</h3>
				</div>
				<hr class="mx-5 my-2 opacity-30" />
				<div class="preset-tonal flex w-full rounded p-6 shadow-xl">
					<div>
						<div>
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
						{#if participantes && participantes.length > 0}
							<div class="mb-4">
								<span class="text-surface-700-300 font-bold">Participantes:</span>
								{#each participantes as participante}
									<br />
									<a href="/usuario/{participante.id}" class="anchor">{participante.nome}</a>
								{/each}
							</div>
						{/if}
					</div>
					<button
						class="btn preset-outlined-primary-500 mb-auto ml-auto"
						onclick={() => {
							abrirModal('Parecer', proposta);
						}}
					>
						<MessageSquareQuote /> Retornar Parecer
					</button>
				</div>
			</div>
		{/if}
	{/snippet}
</ModalBase>
