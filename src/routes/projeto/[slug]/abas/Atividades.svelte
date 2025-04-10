<script lang="ts">
	import TodoList from '$components/TodoList.svelte';
	import type Atividade from '$model/Atividade';
	import { EnumAtividade } from '$model/EnumAtividade';
	import type Projeto from '$model/Projeto';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import { Plus } from 'lucide-svelte';
	import { getContext, onMount } from 'svelte';
	import FormAdicionarAtividade from '../components/FormAdicionarAtividade.svelte';
	import Toaster from '$lib/ToastHandler';

	const toast = new Toaster(getContext);

	interface Props {
		projeto: Projeto;
		data: any;
	}
	let { projeto, data }: Props = $props();
	let atividades: Atividade[] | null = $state(null);

	let openStateAdicionar = $state(false);

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Adicionar':
				openStateAdicionar = !openStateAdicionar;
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
			let estado: number;

			// Reverse the logic: if estado is Pendente, make it 0; if Concluida, make it 1
			if (atividade.estado === EnumAtividade.Created) {
				estado = 0;
			} else if (atividade.estado === EnumAtividade.InProgress) {
				estado = 1;
			} else {
				estado = 0; // Default to 0 if it’s EmProgresso or other states
			}

			return {
				id: atividade.id,
				estado: estado,
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
</script>

<FormAdicionarAtividade
	AdicionarAtividade={adicionarAtividade}
	bind:openState={openStateAdicionar}
	atividade={null}
	{data}
/>

<div class="flex flex-col">
	<button
		onclick={() => {
			abrirModal('Adicionar');
		}}
		class="btn preset-filled-success-500 mt-auto md:ml-auto"><Plus />Adicionar</button
	>
	<div class="grid grid-flow-col justify-items-center">
		<div class="preset-tonal m-2 rounded p-5">
			<h2 class="h2">Em Progresso</h2>
			<TodoList todos={todos.filter((t) => !t.estado)} {remove} />
		</div>

		<div class="preset-tonal m-2 rounded p-5">
			<h2 class="h2">Concluída</h2>
			<TodoList todos={todos.filter((t) => t.estado)} {remove} />
		</div>
	</div>
</div>
