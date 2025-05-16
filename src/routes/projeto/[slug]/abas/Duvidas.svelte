<script lang="ts">
	import Toaster from '$lib/ToastHandler';
	import type Duvida from '$model/Duvida';
	import { EnumVisibilidadeDuvida } from '$model/EnumVisibilidadeDuvida';
	import type LoggedUser from '$model/LoggedUser';
	import type Projeto from '$model/Projeto';
	import DuvidaRepository from '$repository/DuvidaRepository';
	import { Plus } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { storeLogin } from '../../../../stores';
	import FormAdicionarDuvida from '../components/FormAdicionarDuvida.svelte';

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
	let duvidaSelecionada: Duvida | null = $state(null);
	let duvidas: Duvida[] | null = $state(null);

	$effect(() => {
		getDuvidas();
	});

	async function getDuvidas() {
		duvidas = await DuvidaRepository.PegarDuvidasPorProjeto(projeto.id);
	}

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Adicionar':
				duvidaSelecionada = argumentos;
				openStateAdicionar = !openStateAdicionar;
				break;
			default:
				break;
		}
	}

	async function adicionarDuvida(id: number, texto: string, visibilidade: EnumVisibilidadeDuvida) {
		if (!usuarioLogado) {
			return;
		}
		console.log(texto);
		
		try {
			if (id === 0) {
				await DuvidaRepository.AdicionarDuvida(projeto.id, usuarioLogado.id, texto, visibilidade);
			} else {
				await DuvidaRepository.AtualizarDuvida(
					id,
					projeto.id,
					usuarioLogado.id,
					texto,
					visibilidade
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
</script>

<FormAdicionarDuvida
	AdicionarDuvida={adicionarDuvida}
	openState={openStateAdicionar}
	duvida={duvidaSelecionada}
	{data}
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
				<div class="grid">
					<p class="font-semibold">{duvida.texto}</p>
					<p class="text-sm text-gray-500">
						Visibilidade: {EnumVisibilidadeDuvida[duvida.visibilidade]}
					</p>
				</div>
			{/each}
		{:else}
			<span>Não há dúvidas no momento!</span>
		{/if}
	</div>
</div>
