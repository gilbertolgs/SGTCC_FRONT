<script lang="ts">
	import CardRelatorio from '$components/CardOrientacao.svelte';
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
	import Toaster from '$lib/ToastHandler';
	import { EnumConvite } from '$model/EnumConvite';
	import { EnumFuncaoUsuario } from '$model/EnumFuncaoUsuario';
	import type Projeto from '$model/Projeto';
	import type Relatorio from '$model/Relatorio';
	import RelatorioRepository from '$repository/RelatorioRepository';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import { Plus } from 'lucide-svelte';
	import { getContext, onMount } from 'svelte';
	import { storeLogin } from '../../../../stores';
	import DetalhesRelatorio from '../components/DetalhesOrientacao.svelte';
	import FormAdicionarRelatorio from '../components/FormAdicionarOrientacao.svelte';

	const toast = new Toaster(getContext);

	interface Props {
		projeto: Projeto;
		data: any;
	}
	let { projeto, data }: Props = $props();

	let usuarioLogado = $derived($storeLogin);

	let openStateAdicionar = $state(false);
	let openStateDetalhes = $state(false);
	let openStateApagar = $state(false);
	let relatorioSelecionado: Relatorio | null = $state(null);
	let relatorios: Relatorio[] | null = $state(null);

	let usuarioEOrientador: boolean = $derived(
		(usuarioLogado && usuarioLogado.funcao === EnumFuncaoUsuario.Orientador) || false
	);

	async function pegaFuncaoUsuario() {
		let participantes = await UsuarioRepository.PegarTodosPorProjeto(projeto.id);
		participantes = participantes.filter((p) => p.estado == EnumConvite.Aceito);

		if (usuarioLogado) {
			const usuarioLogadoDados = participantes.filter((p) => p.id === usuarioLogado?.id)[0];

			usuarioLogado.funcao = usuarioLogadoDados.funcao;
		}
	}

	$effect(() => {
		getRelatorios();
		pegaFuncaoUsuario().then(() => {
			usuarioEOrientador =
				(usuarioLogado && usuarioLogado.funcao === EnumFuncaoUsuario.Orientador) || false;
		});
	});

	async function getRelatorios() {
		relatorios = await RelatorioRepository.BuscarRelatorioPorProjeto(projeto.id);
		console.log(relatorios);
	}

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Adicionar':
				relatorioSelecionado = argumentos;
				openStateAdicionar = !openStateAdicionar;
				break;
			case 'Detalhes':
				relatorioSelecionado = argumentos;
				openStateDetalhes = !openStateDetalhes;
				break;
			case 'Apagar':
				relatorioSelecionado = argumentos;
				openStateApagar = !openStateApagar;
				break;
			default:
				break;
		}
	}

	async function adicionarRelatorio(
		id: number,
		titulo: string | null,
		descricao: string | null,
		duracaoEncontro: number,
		dataRealizacao: string
	) {
		if (!usuarioLogado) return;
		try {
			if (id === 0) {
				await RelatorioRepository.CriarRelatorio(
					usuarioLogado.id,
					projeto.id,
					titulo,
					descricao,
					duracaoEncontro,
					dataRealizacao
				);
			} else {
				await RelatorioRepository.AtualizarRelatorio(
					id,
					usuarioLogado.id,
					projeto.id,
					titulo,
					descricao,
					duracaoEncontro,
					dataRealizacao
				);
			}
			openStateAdicionar = false;
			toast.triggerSuccess('Relatório salvo com sucesso!');
			await getRelatorios();
		} catch (error) {
			openStateAdicionar = false;
			toast.triggerError('Erro ao salvar relatório');
		}
	}

	async function apagarRelatorio() {
		if (!relatorioSelecionado) return;
		try {
			await RelatorioRepository.DeletarRelatorio(relatorioSelecionado.id);

			openStateApagar = false;
			relatorioSelecionado = null;
			toast.triggerSuccess('Relatório excluído com sucesso!');
			await getRelatorios();
		} catch (error) {
			toast.triggerError('Erro ao excluir relatório');
			console.error(error);
		}
		openStateAdicionar = false;
		openStateApagar = false;
		openStateDetalhes = false;
		getRelatorios();
	}
</script>

<FormAdicionarRelatorio
	AdicionarRelatorio={adicionarRelatorio}
	bind:openState={openStateAdicionar}
	relatorio={relatorioSelecionado}
	{data}
/>

<DetalhesRelatorio
	bind:openState={openStateDetalhes}
	relatorio={relatorioSelecionado}
	{abrirModal}
/>

<ConfirmDialog
	bind:openState={openStateApagar}
	titulo="Tem certeza que deseja apagar este relatório?"
	texto="Relatório: {relatorioSelecionado?.titulo}"
	funcao={apagarRelatorio}
/>

<div class="grid gap-4">
	{#if usuarioEOrientador}
		<button
			onclick={() => abrirModal('Adicionar')}
			class="btn preset-filled-success-500 mt-auto md:ml-auto"
		>
			<Plus />Adicionar
		</button>
	{/if}
	<div class="preset-tonal flex flex-col gap-3 border p-4 shadow-md">
		{#if relatorios && relatorios.length > 0}
			{#each relatorios as relatorio, i}
				{#if i > 0}
					<hr class="my-3" />
				{/if}
				<CardRelatorio {abrirModal} {relatorio} />
			{/each}
		{:else}
			<span>Não há relatórios no momento!</span>
		{/if}
	</div>
</div>
