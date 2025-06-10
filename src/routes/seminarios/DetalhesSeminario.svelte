<script lang="ts">
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import { getContext } from 'svelte';
	import { Trash, Pencil, Plus, Minus } from 'lucide-svelte';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import SeminarioApiRepository from '$repository/openapi/SeminarioApiRepository';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import FormSelectComponent from '$components/FormSelectComponent.svelte';
	import type Projeto from '$model/Projeto';
	import { storeLogin } from '../../stores';

	const toast = new Toaster(getContext);
	let usuarioLogado = $derived($storeLogin);

	interface Props {
		openState: any;
		seminario: any | null;
		onAction: Function;
		alterar: Function;
        getSeminarios: Function;
	}

    interface ProjetoSeminario {
        idProjeto: number;
        nomeProjeto: string;
    }

	let { openState = $bindable(), seminario, onAction, alterar, getSeminarios }: Props = $props();

	let projetosDisponiveis: Projeto[] = $state([]);
	let projetosDoSeminario: ProjetoSeminario[] = $state([]);
	let projetoSelecionado: number = $state(0);

	async function carregaProjetosDoSeminario() {
		if (!usuarioLogado || !seminario) return;

		projetosDoSeminario = await SeminarioApiRepository.PegarProjetosPorSeminario(seminario.id);
		const todosProjetos = await ProjetoRepository.PegarPorCurso(usuarioLogado.idCurso);

		projetosDisponiveis = todosProjetos.filter((p: any) => {
			console.log(p);
			return !projetosDoSeminario.some((sp) => sp.idProjeto === p.id);
		});
	}

	$effect(() => {
		carregaProjetosDoSeminario();
	});

	async function adicionarProjeto() {
		if (!projetoSelecionado) return;
		try {
			await SeminarioApiRepository.CriarSeminarioProjeto(seminario.id, projetoSelecionado);
			carregaProjetosDoSeminario();
			toast.triggerSuccess('Projeto adicionado.');
			projetoSelecionado = 0;
		} catch {
			toast.triggerError('Erro ao adicionar projeto.');
		}
	}

	async function removerProjeto(idProjeto: number) {
		const numeroSeminariosAtuais = projetosDoSeminario.length;
		try {
			await SeminarioApiRepository.RemoverProjetoDoSeminario(seminario.id, idProjeto);
			projetosDoSeminario = await SeminarioApiRepository.PegarProjetosPorSeminario(seminario.id);
			toast.triggerSuccess('Projeto removido.');
		} catch {
            carregaProjetosDoSeminario();
			if (projetosDoSeminario.length !== numeroSeminariosAtuais) {
				toast.triggerSuccess('Projeto removido.');
				return;
			}
			toast.triggerSuccess('Projeto removido.');
		}
	}

	async function excluirSeminario() {
		try {
            openState = false;
			await SeminarioApiRepository.FinalizarSeminario(seminario.id);
            getSeminarios();
			toast.triggerSuccess('Seminário excluído.');
		} catch {
            getSeminarios();
			// toast.triggerError('Erro ao excluir seminário.');
		}
	}
</script>

<ModalBase
	bind:openState
	classe="card flex flex-col bg-surface-100-900 p-4 shadow-xl w-full md:w-1/2 h-full"
>
	{#snippet conteudo()}
		{#if seminario}
			<h3 class="h3">{`Seminário - ${DataFormatHandler.FormatDate(seminario.data)}`}</h3>
			<p class="mt-2 text-base opacity-80">Requisitos: {seminario.requisitos}</p>
			<p class="text-base opacity-80">Data: {DataFormatHandler.FormatDate(seminario.data)}</p>

			<div class="mt-4 flex gap-2">
				<button
					class="btn preset-outlined-primary-500"
					onclick={() => {
						alterar(seminario);
					}}
				>
					<Pencil /> Editar
				</button>
				<button class="btn preset-outlined-error-500" onclick={excluirSeminario}>
					<Trash /> Excluir
				</button>
			</div>

			<hr class="my-4" />

			<h4 class="font-semibold">Projetos Vinculados</h4>
			{#if projetosDoSeminario.length > 0}
				<ul class="mt-2 max-h-1/2 space-y-2 overflow-auto">
					{#each projetosDoSeminario as projeto}
						<li class="preset-tonal flex justify-between rounded p-2 shadow">
							<span>{projeto.nomeProjeto}</span>
							<button
								class="btn btn-sm preset-outlined-error-500"
								onclick={() => removerProjeto(projeto.idProjeto)}
							>
								<Minus class="h-4 w-4" />
							</button>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-gray-500">Nenhum projeto vinculado.</p>
			{/if}

			<hr class="my-4" />

			<h4 class="font-semibold">Adicionar Projeto</h4>
			<FormSelectComponent
				label="Projeto"
				placeholder="Selecione um projeto"
				bind:valor={projetoSelecionado}
				erros={null}
				constraints={null}
			>
				{#snippet opcoes()}
					{#each projetosDisponiveis as projeto}
						<option value={projeto.id}>{projeto.nome}</option>
					{/each}
				{/snippet}
			</FormSelectComponent>

			<button class="btn preset-filled-primary-500 mt-2" onclick={adicionarProjeto}>
				<Plus /> Adicionar Projeto
			</button>
		{/if}
	{/snippet}
</ModalBase>
