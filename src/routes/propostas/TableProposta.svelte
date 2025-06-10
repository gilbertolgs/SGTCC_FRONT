<script lang="ts">
	import TableBaseComponent from '$components/TableBaseComponent.svelte';
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import ImageComponent from '$components/ImageComponent.svelte';
	import type Proposta from '$model/Proposta';
	import { CheckCircle, InfoIcon, XCircle } from 'lucide-svelte';
	import DataFormatHandler from '$lib/DataFormatHandler';

	interface Props {
		abrirModal: Function;
		getPropostas: Function;
		propostas: Proposta[];
	}
	let { abrirModal, getPropostas, propostas } = $props();

	let propostasFiltradas: Proposta[] = $derived(propostas);

	let pesquisa = $state({
		nomeProposta: ''
	});

	async function pesquisar() {
		await getPropostas();

		const txtNomeProposta = pesquisa.nomeProposta.toLowerCase().trim();
		if (txtNomeProposta === '') {
			propostasFiltradas = propostas;
		} else {
			propostasFiltradas = propostasFiltradas.filter((p: Proposta) =>
				p.nomeProjeto.toLowerCase().includes(txtNomeProposta)
			);
		}
	}

	const camposCabecalho = ['Nome', 'Criado Em', 'Ações'];
</script>

<div class="m-2 flex items-end gap-2">
	<FormInputComponent
		label="Nome da Proposta"
		placeholder="nome"
		tipo="text"
		bind:valor={pesquisa.nomeProposta}
		erros={null}
		constraints={[]}
	/>
	<button class="btn preset-filled-primary-500 mt-auto" onclick={pesquisar}>Pesquisar</button>
</div>

{#snippet cabecalhoPropostas()}
	<thead>
		<tr>
			{#each camposCabecalho as campo}
				<td>{campo}</td>
			{/each}
		</tr>
	</thead>
{/snippet}

{#if propostasFiltradas}
	{#if propostasFiltradas.length < 1}
		<div class="flex items-center justify-center">
			<span class="preset-tonal rounded p-5">Não há propostas no momento.</span>
		</div>
	{:else}
		<TableBaseComponent
			{camposCabecalho}
			arrObjetosTamanho={propostasFiltradas.length}
			labelObjeto="Propostas"
		>
			{#snippet cabecalho()}
				{@render cabecalhoPropostas()}
			{/snippet}
			{#snippet corpo()}
				{#each propostasFiltradas as proposta}
					<tr class="even:preset-tonal">
						<td>
							<span class="inline-flex w-min items-center gap-1 whitespace-nowrap">
								<span>{proposta.nomeProjeto}</span>
							</span>
						</td>
						<td>{DataFormatHandler.FormatDate(proposta.criadoEm)}</td>
						<td>
							<div class="grid grid-flow-col gap-2 w-min ml-auto">
								<button
									class="btn preset-filled-primary-500"
									onclick={() => abrirModal('Detalhes', proposta)}
								>
									<InfoIcon /> Detalhes
								</button>
							</div>
						</td>
					</tr>
				{/each}
			{/snippet}
		</TableBaseComponent>
	{/if}
{:else}
	<TableBaseComponent {camposCabecalho} arrObjetosTamanho={1} labelObjeto="Propostas">
		{#snippet cabecalho()}
			{@render cabecalhoPropostas()}
		{/snippet}
		{#snippet corpo()}
			<tr>
				<td class="flex items-center gap-2">
					<div class="placeholder h-2 w-full animate-pulse"></div>
				</td>
				<td><div class="placeholder animate-pulse"></div></td>
				<td><div class="placeholder animate-pulse"></div></td>
			</tr>
		{/snippet}
	</TableBaseComponent>
{/if}
