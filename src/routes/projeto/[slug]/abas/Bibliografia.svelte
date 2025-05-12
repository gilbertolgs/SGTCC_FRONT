<script lang="ts">
	import DataFormatHandler from '$lib/DataFormatHandler';
	import type Anotacao from '$model/Anotacao';
	import type Projeto from '$model/Projeto';
	import AnotacaoRepository from '$repository/AnotacaoRepository';
	import { Plus } from 'lucide-svelte';
	import DetalhesAnotacao from '../components/DetalhesAnotacao.svelte';
	import FormAdicionarAnotacao from '../components/FormAdicionarAnotacao.svelte';
	import type LoggedUser from '$model/LoggedUser';
	import { storeLogin } from '../../../../stores';
	import Toaster from '$lib/ToastHandler';
	import { getContext } from 'svelte';

	const toast = new Toaster(getContext);

	interface Props {
		projeto: Projeto;
		data: any;
	}
	let { projeto, data }: Props = $props();

	let usuarioLogado: LoggedUser | null = $state<LoggedUser | null>(null);
	storeLogin.subscribe((value) => {
		usuarioLogado = value;
	});

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

	async function adicionarAnotacao(id: number, titulo: string, descricao: string) {
		if (!usuarioLogado) {
			return;
		}
		try {
			if (id === 0) {
				await AnotacaoRepository.AdicionarAnotacao(usuarioLogado.id, projeto.id, titulo, descricao);
			} else {
				await AnotacaoRepository.AtualizarAnotacao(
					id,
					usuarioLogado.id,
					projeto.id,
					titulo,
					descricao
				);
			}
			openStateAdicionar = false;
			toast.triggerSuccess('Anotação criada com sucesso!');
		} catch (error) {
			openStateAdicionar = false;
			toast.triggerError('Erro ao criar Anotação');
		}
		getAnotacoes();
	}
</script>

<FormAdicionarAnotacao
	AdicionarAnotacao={adicionarAnotacao}
	openState={openStateAdicionar}
	anotacao={anotacaoSelecionada}
	{data}
/>
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
		{#if anotacoes && anotacoes.length > 0}
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
		{:else}
			<span>Não há anotações no momento!</span>
		{/if}
	</div>
</div>
