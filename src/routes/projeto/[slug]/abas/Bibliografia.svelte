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
	import ConfirmDialog from '$components/ConfirmDialog.svelte';

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
	let openStateApagar = $state(false);

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
			case 'Apagar':
				referenciaSelecionada = argumentos;
				openStateApagar = !openStateApagar;
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

	async function apagaReferencia() {
		if (!referenciaSelecionada) return;
		try {
			const response = await BibliografiaRepository.ApagarBibliografia(referenciaSelecionada.id);

			openStateApagar = false;
			referenciaSelecionada = null;
			toast.triggerSuccess('Referência excluido com sucesso!');

			await getBibliografia();
		} catch (error) {
			toast.triggerError('Ocorreu um erro ao tentar apagar referência!');
			console.log(error);
		}
	}

	async function copiaReferencia(referencia: Bibliografia) {
		const text = referencia.autores.trim() + '\n' + referencia.referencia.trim();
		await navigator.clipboard.writeText(text);

		toast.triggerSuccess('Referência copiada!');
	}
</script>

<h3 class="h3 my-5">Bibliografia</h3>

<FormAdicionarBibliografia
	AdicionarAnotacao={adicionarBibliografia}
	bind:openState={openStateAdicionar}
	referencia={referenciaSelecionada}
	{data}
/>

<ConfirmDialog
	bind:openState={openStateApagar}
	titulo="Tem certeza que deseja apagar essa referência"
	texto="Referência: {referenciaSelecionada?.referencia}"
	funcao={apagaReferencia}
/>

{#snippet cardReferencia(referencia: Bibliografia, i: number)}
	<div class="preset-tonal mb-4 rounded p-3 shadow-md transition-all hover:shadow-lg">
		<div class="mb-2 flex items-center justify-between">
			<h3 class="text-lg font-semibold">Referência {i + 1}</h3>
			<button class="btn preset-outlined-primary-500" onclick={() => copiaReferencia(referencia)}>
				<Copy class="mr-1 h-4 w-4" />
				Copiar
			</button>
		</div>

		<div class="text-muted-foreground space-y-1 text-sm">
			<p>{referencia.autores}</p>
			<p>
				<span class="font-semibold">{referencia.referencia}</span>
			</p>
			<p class="mt-2 opacity-70">
				Acessado em: {DataFormatHandler.FormatDate(referencia.acessadoEm)}
			</p>
		</div>

		<div class="mt-3 flex gap-3">
			<button
				class="btn preset-outlined-primary-500"
				onclick={() => abrirModal('Adicionar', referencia)}
			>
				<Pencil class="mr-1 h-4 w-4" />
				Editar
			</button>
			<button
				class="btn preset-outlined-error-500"
				onclick={() => abrirModal('Apagar', referencia)}
			>
				<Trash class="mr-1 h-4 w-4" />
				Excluir
			</button>
		</div>
	</div>
{/snippet}

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
				{@render cardReferencia(referencia, i)}
			{/each}
		{:else}
			<span>Não há referências no momento!</span>
		{/if}
	</div>
</div>
