<script lang="ts">
	import Toaster from '$lib/ToastHandler';
	import type Duvida from '$model/Duvida';
	import { EnumVisibilidadeDuvida } from '$model/EnumVisibilidadeDuvida';
	import type LoggedUser from '$model/LoggedUser';
	import type Projeto from '$model/Projeto';
	import DuvidaRepository from '$repository/DuvidaRepository';
	import { Pencil, Plus, Trash } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { storeLogin } from '../../../../stores';
	import FormAdicionarDuvida from '../components/FormAdicionarDuvida.svelte';
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
	import DetalhesDuvida from '../components/DetalhesDuvida.svelte';
	import CardDuvida from '$components/CardDuvida.svelte';

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
	let duvidaSelecionada: Duvida | null = $state(null);
	let duvidas: Duvida[] | null = $state(null);

	$effect(() => {
		getDuvidas();
	});

	async function getDuvidas() {
		duvidas = await DuvidaRepository.PegarDuvidasAtendidas(projeto.id);
		try {
			const novasDuvidas = await DuvidaRepository.PegarDuvidasPorProjeto(projeto.id);
			if (!duvidas) return;
			duvidas = [...novasDuvidas, ...duvidas];
		} catch (error) {}

	}

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Adicionar':
				duvidaSelecionada = argumentos;
				openStateAdicionar = !openStateAdicionar;
				break;
			case 'Detalhes':
				duvidaSelecionada = argumentos;
				openStateDetalhes = !openStateDetalhes;
				break;
			case 'Apagar':
				duvidaSelecionada = argumentos;
				openStateApagar = !openStateApagar;
				break;
			default:
				break;
		}
	}

	async function adicionarDuvida(
		id: number,
		texto: string,
		visibilidade: EnumVisibilidadeDuvida,
		atendida: number
	) {
		if (!usuarioLogado) {
			return;
		}
		try {
			if (id === 0) {
				await DuvidaRepository.AdicionarDuvida(projeto.id, usuarioLogado.id, texto, visibilidade);
			} else {
				await DuvidaRepository.AtualizarDuvida(
					id,
					projeto.id,
					usuarioLogado.id,
					texto,
					visibilidade,
					atendida
				);
			}
			openStateAdicionar = false;
			toast.triggerSuccess('Dúvida adicionada com sucesso!');
		} catch (error) {
			openStateAdicionar = false;
			toast.triggerError('Erro ao adicionar dúvida');
		}
		getDuvidas();
	}

	async function apagaDuvida() {
		if (!duvidaSelecionada) return;
		try {
			const response = await DuvidaRepository.ApagarDuvida(duvidaSelecionada.id);

			openStateApagar = false;
			duvidaSelecionada = null;
			toast.triggerSuccess('Duvida excluido com sucesso!');

			await getDuvidas();
		} catch (error) {
			toast.triggerError('Ocorreu um erro ao tentar apagar duvida!');
			console.log(error);
		}
	}
</script>

<h3 class="h3 my-5">Informações</h3>

<FormAdicionarDuvida
	AdicionarDuvida={adicionarDuvida}
	bind:openState={openStateAdicionar}
	duvida={duvidaSelecionada}
	{data}
/>

<DetalhesDuvida
	bind:openState={openStateDetalhes}
	duvida={duvidaSelecionada}
	{abrirModal}
	{getDuvidas}
/>

<ConfirmDialog
	bind:openState={openStateApagar}
	titulo="Tem certeza que deseja apagar essa dúvida"
	texto="Dúvida: {duvidaSelecionada?.texto}"
	funcao={apagaDuvida}
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
	<div class="preset-tonal flex flex-col gap-3 border p-4 shadow-md">
		{#if duvidas && duvidas.length > 0}
			{#each duvidas as duvida, i}
				<CardDuvida {abrirModal} {duvida} />
			{/each}
		{:else}
			<span>Não há dúvidas no momento!</span>
		{/if}
	</div>
</div>
