<script lang="ts">
	import TodoList from '$components/TodoList.svelte';
	import Toaster from '$lib/ToastHandler';
	import type Atividade from '$model/Atividade';
	import { EnumAtividade } from '$model/EnumAtividade';
	import type Projeto from '$model/Projeto';
	import type Usuario from '$model/Usuario';
	import AtividadeRepository from '$repository/AtividadeRepository';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import { CircleCheck, CirclePause, CirclePlay, Plus } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import DetalhesAtividade from '../components/DetalhesAtividade.svelte';
	import FormAdicionarAtividade from '../components/FormAdicionarAtividade.svelte';
	import type { EnumPrioridadeAtividade } from '$model/EnumPrioridadeAtividade';

	const toast = new Toaster(getContext);

	interface Props {
		projeto: Projeto;
		getAtividadesGlobal: Function;
		data: any;
	}
	let { projeto, getAtividadesGlobal, data }: Props = $props();
	let atividades: Atividade[] | null = $state(null);
	let idAtividadeAberta: number = $state(0);
	let atividadeASerAlterada: Atividade | null = $state(null);
	let usuariosDisponiveis: Usuario[] | null = $state(null);

	let openStateAdicionar = $state(false);
	let openStateDetalhes = $state(false);

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Adicionar':
				atividadeASerAlterada = argumentos;
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

	$effect(() => {
		getAtividades();
		getUsuariosDisponiveis();
	});

	let todos: { id: number; estado: number; nome: string; prioridade: EnumPrioridadeAtividade }[] = $state([]);

	function remove(todo: { id: number; estado: number; nome: string; prioridade: EnumPrioridadeAtividade }) {
		const index = todos.indexOf(todo);
		todos.splice(index, 1);
	}

	async function getAtividades() {
		atividades = await AtividadeRepository.PegarAtividadesPorProjeto(projeto.id);

		if (!atividades || atividades.length < 1) {
			atividades = [];
		}

		todos = atividades.map((atividade) => {
			return {
				id: atividade.id,
				estado: atividade.estado,
				nome: atividade.nome,
				prioridade: atividade.prioridade
			};
		});

		todos = todos.sort((a, b) => {
			return b.prioridade - a.prioridade;
		})

		getAtividadesGlobal(atividades);
	}

	async function adicionarAtividade(
		idAtividade: number,
		nome: string,
		descricao: string,
		idUsuario: number,
		prioridade: number,
		duracaoEstimada: number,
		dataInicio: string,
		dataEntrega: string
	) {
		try {
			if (idAtividade !== 0) {
				const response = await AtividadeRepository.AtualizarAtividade(
					projeto.id,
					idAtividade,
					nome,
					descricao,
					idUsuario,
					duracaoEstimada,
					prioridade,
					dataInicio,
					dataEntrega
				);
				atividadeASerAlterada = null;
				idAtividadeAberta = 0;
			} else {
				const response = await AtividadeRepository.AdicionarAtividade(
					projeto.id,
					nome,
					descricao,
					idUsuario,
					duracaoEstimada,
					prioridade,
					dataInicio,
					dataEntrega
				);
			}
			openStateAdicionar = false;
			toast.triggerSuccess('Atividade criada com sucesso!');
			await getAtividades();
		} catch (error) {
			openStateAdicionar = false;
			toast.triggerError('Ocorreu um erro ao tentar criar atividade!');
			console.log(error);
		}
	}

	function mudaEstado(idAtividade: number, estado: EnumAtividade) {
		AtividadeRepository.AtualizarStatusAtividade(idAtividade, estado);
	}

	async function getUsuariosDisponiveis() {
		usuariosDisponiveis = await UsuarioRepository.PegarTodosPorProjeto(projeto.id);
	}
</script>

<h3 class="h3 my-5">Atividades</h3>

<FormAdicionarAtividade
	AdicionarAtividade={adicionarAtividade}
	bind:openState={openStateAdicionar}
	atividade={atividadeASerAlterada}
	{usuariosDisponiveis}
	{data}
/>
<DetalhesAtividade
	bind:openState={openStateDetalhes}
	idAtividade={idAtividadeAberta}
	{abrirModal}
	{getAtividades}
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
