<script lang="ts">
	import DataFormatHandler from '$lib/DataFormatHandler';
	import Toaster from '$lib/ToastHandler';
	import type Bibliografia from '$model/Bibliografia';
	import type LoggedUser from '$model/LoggedUser';
	import type Projeto from '$model/Projeto';
	import BibliografiaRepository from '$repository/BibliografiaRepository';
	import { Copy, Pencil, Plus, Trash } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { storeLogin } from '../../../../stores';
	import FormAdicionarBibliografia from '../components/FormAdicionarBibliografia.svelte';

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

	let referenciaSelecionada: Bibliografia | null = $state(null);

	let referencias: Bibliografia[] | null = $state(null);

	$effect(() => {
		getBibliografia();
	});

	async function getBibliografia() {
		referencias = await BibliografiaRepository.PegarBibliografiaPorProjeto(projeto.id);
	}

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Adicionar':
				referenciaSelecionada = argumentos;
				openStateAdicionar = !openStateAdicionar;
				break;
			default:
				break;
		}
	}

	async function adicionarBibliografia(
		id: number,
		autores: string,
		referencia: string,
		acessadoEm: string
	) {
		if (!usuarioLogado) {
			return;
		}
		try {
			if (id === 0) {
				await BibliografiaRepository.AdicionarBibliografia(
					usuarioLogado.id,
					projeto.id,
					autores,
					referencia,
					acessadoEm
				);
			} else {
				await BibliografiaRepository.AtualizarBibliografia(
					id,
					usuarioLogado.id,
					projeto.id,
					autores,
					referencia,
					acessadoEm
				);
			}
			openStateAdicionar = false;
			toast.triggerSuccess('Referência criada com sucesso!');
		} catch (error) {
			openStateAdicionar = false;
			toast.triggerError('Erro ao criar Referência');
		}
		getBibliografia();
	}
</script>

<FormAdicionarBibliografia
	AdicionarAnotacao={adicionarBibliografia}
	openState={openStateAdicionar}
	referencia={referenciaSelecionada}
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
		{#if referencias && referencias.length > 0}
			{#each referencias as referencia, i}
				<div class="grid">
					{#if i >> 0}
						<hr class="my-3" />
					{/if}
					<span class="text-primary-500">
						{i + 1}
					</span>
					<span>
						{referencia.autores}
					</span>
					<span class="font-bold">
						{referencia.referencia}
					</span>
					<p class="mt-2 opacity-70">
						Acessado em: {DataFormatHandler.FormatDate(referencia.acessadoEm)}
					</p>
				</div>
				<div class="grid grid-flow-col justify-between gap-5">
					<div class="flex gap-5">
						<button class="hover:text-primary-500 mb-auto ml-auto fill-current"><Pencil /></button>
						<button class="hover:text-error-500 mb-auto ml-auto fill-current"><Trash /></button>
					</div>
					<button class="hover:text-primary-500 mb-auto ml-auto fill-current"><Copy /></button>
				</div>
			{/each}
		{:else}
			<span>Não há referências no momento!</span>
		{/if}
	</div>
</div>
