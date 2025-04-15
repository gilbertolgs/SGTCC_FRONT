<script lang="ts">
	import TodoList from '$components/TodoList.svelte';
	import type Atividade from '$model/Atividade';
	import { EnumAtividade } from '$model/EnumAtividade';
	import type Projeto from '$model/Projeto';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import { CircleCheck, CirclePause, CirclePlay, Plus } from 'lucide-svelte';
	import { getContext, onMount } from 'svelte';
	import FormAdicionarAtividade from '../components/FormAdicionarAtividade.svelte';
	import Toaster from '$lib/ToastHandler';
	import DetalhesAtividade from '../components/DetalhesAtividade.svelte';

	const toast = new Toaster(getContext);

	interface Props {
		projeto: Projeto;
		data: any;
	}
	let { projeto, data }: Props = $props();
	let atividades: Atividade[] | null = $state(null);
	let idAtividadeAberta: number = $state(0);

	let openStateAdicionar = $state(false);
	let openStateDetalhes = $state(false);

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Adicionar':
				openStateAdicionar = !openStateAdicionar;
				break;
			case 'Detalhes':
				idAtividadeAberta = argumentos;
				openStateDetalhes = !openStateDetalhes;
				break;
			default:
				break;
		}
	}

	onMount(async () => {
		await getAtividates();
	});

	let todos: { id: number; estado: number; nome: string }[] = $state([]);

	function remove(todo: { id: number; estado: number; nome: string }) {
		const index = todos.indexOf(todo);
		todos.splice(index, 1);
	}

	async function getAtividates() {
		atividades = await ProjetoRepository.PegarAtividades(projeto.id);

		if (!atividades || atividades.length < 1) {
			return;
		}

		todos = atividades.map((atividade) => {
			return {
				id: atividade.id,
				estado: atividade.estado,
				nome: atividade.nome
			};
		});
	}

	async function adicionarAtividade(idAtividade: number, nome: string, descricao: string) {
		try {
			if (idAtividade !== 0) {
				const response = await ProjetoRepository.AtualizarAtividade(
					projeto.id,
					idAtividade,
					nome,
					descricao
				);
			} else {
				const response = await ProjetoRepository.AdicionarAtividade(projeto.id, nome, descricao);
			}
			openStateAdicionar = false;
			toast.triggerSuccess('Projeto alterado com sucesso!');
			await getAtividates();
		} catch (error) {
			openStateAdicionar = false;
			toast.triggerError('Ocorreu um erro ao tentar alterar projeto!');
			console.log(error);
		}
	}

	function mudaEstado(idAtividade: number, estado: EnumAtividade) {
		ProjetoRepository.AtualizarStatusAtividade(idAtividade, estado);
	}
</script>

<FormAdicionarAtividade
	AdicionarAtividade={adicionarAtividade}
	bind:openState={openStateAdicionar}
	atividade={null}
	{data}
/>
<DetalhesAtividade
bind:openState={openStateDetalhes}
idAtividade={idAtividadeAberta}
/>

<div class="flex flex-col">
	<button
		onclick={() => {
			abrirModal('Adicionar');
		}}
		class="btn preset-filled-success-500 mt-auto md:ml-auto"><Plus />Adicionar</button
	>
	<div class="justify-items-between grid grid-flow-col overflow-auto">
		<div class="bg-primary-400-600 m-2 flex flex-col items-center rounded border p-5">
			<h2 class="h2 flex items-center gap-2 whitespace-nowrap"><CirclePause /> A Fazer</h2>
			<div class="preset-tonal h-full w-full rounded p-5">
				<TodoList
					todos={todos.filter((t) => t.estado === EnumAtividade.Created)}
					{remove}
					{mudaEstado}
					abreDetalhes={abrirModal}
				/>
			</div>
		</div>

		<div class="bg-warning-400-600 m-2 flex flex-col items-center rounded border p-5">
			<h2 class="h2 flex items-center gap-2 whitespace-nowrap"><CirclePlay /> Em Progresso</h2>
			<div class="preset-tonal h-full w-full rounded p-5">
				<TodoList
					todos={todos.filter((t) => t.estado === EnumAtividade.InProgress)}
					{remove}
					{mudaEstado}
					abreDetalhes={abrirModal}
				/>
			</div>
		</div>

		<div class="bg-success-400-600 m-2 flex flex-col items-center rounded border p-5">
			<h2 class="h2 flex items-center gap-2 whitespace-nowrap"><CircleCheck /> Finalizado</h2>
			<div class="preset-tonal h-full w-full rounded p-5">
				<TodoList
					todos={todos.filter((t) => t.estado === EnumAtividade.Finished)}
					{remove}
					{mudaEstado}
					abreDetalhes={abrirModal}
				/>
			</div>
		</div>
	</div>
</div>
