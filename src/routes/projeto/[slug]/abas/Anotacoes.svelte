<script lang="ts">
	import DataFormatHandler from '$lib/DataFormatHandler';
	import type Anotacao from '$model/Anotacao';
	import type Projeto from '$model/Projeto';
	import AnotacaoRepository from '$repository/AnotacaoRepository';
	import { Plus } from 'lucide-svelte';
	import DetalhesAnotacao from '../components/DetalhesAnotacao.svelte';

	interface Props {
		projeto: Projeto;
	}
	let { projeto }: Props = $props();

	let openStateAdicionar = $state(false);
	let openStateDetalhes = $state(false);

	let anotacaoSelecionada: Anotacao | null = $state(null);

	let anotacoes: Anotacao[] | null = $state(null);

	$effect(() => {
		getAnotacoes();
	});

	async function getAnotacoes() {
		anotacoes = await AnotacaoRepository.PegarAnotacoesPorProjeto(projeto.id);
	}

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Adicionar':
				anotacaoSelecionada = argumentos;
				openStateAdicionar = !openStateAdicionar;
				break;
			case 'Detalhes':
				anotacaoSelecionada = argumentos;
				openStateDetalhes = !openStateDetalhes;
				break;
			default:
				break;
		}
	}
</script>

<DetalhesAnotacao
	bind:openState={openStateDetalhes}
	anotacao={anotacaoSelecionada}
	{abrirModal}
	{getAnotacoes}
/>

<div class="grid gap-4">
	<button
		onclick={() => {
			abrirModal('Adicionar');
		}}
		class="btn preset-filled-success-500 mt-auto md:ml-auto"
	>
		<Plus />Adicionar
	</button>
	<div class="preset-tonal grid gap-3 border p-4 shadow-md md:grid-cols-3">
		{#if anotacoes}
			{#each anotacoes as anotacao}
				<button
					class="bg-primary-300 dark:bg-primary-950 rounded border p-2 shadow-2xl transition-all duration-500 hover:brightness-80"
					onclick={() => {
						abrirModal('Detalhes', anotacao);
					}}
				>
					<div class="m-5 grid">
						<h5 class="h5">
							{anotacao.titulo}
						</h5>
						<hr class="mx-5 my-2 opacity-30" />
						<span class="">
							{anotacao.descricao}
						</span>
						<span class="ml-auto opacity-70">
							{DataFormatHandler.FormatDate(anotacao.criadoEm)}
						</span>
					</div>
				</button>
			{/each}
		{/if}
	</div>
</div>
