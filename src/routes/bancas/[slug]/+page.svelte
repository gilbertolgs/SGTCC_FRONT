<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import { EnumPapel } from '$model/EnumPapel.js';
	import type Projeto from '$model/Projeto.js';
	import type Usuario from '$model/Usuario';
	import BancaApiRepository from '$repository/openapi/BancaApiRepository';
	import UsuarioRepository from '$repository/UsuarioRepository.js';
	import { Plus, Trash } from 'lucide-svelte';
	import { onMount } from 'svelte';

	type Banca = {
		nomeProjeto: string;
		descricao: string;
	};

	type Avaliador = {
		id: number;
		idUsuario: number;
		nomeUsuario: string;
		emailUsuario: string;
		idBanca: number;
	};

	let { data } = $props();
	const idBanca = data.idBanca;

	let banca: Banca | null = $state(null);
	let projeto: Projeto | null = $state(null);
	let professoresDisponiveis: Usuario[] = $state([]);
	let avaliadoresSelecionados: Avaliador[] = $state([]);

	let openModalEditar = $state(false);
	let dataSeminario = $state('');
	let filtroNome = $state('');

	onMount(async () => {
		await carregarDados();
	});

	async function carregarDados() {
		await getBanca();
		await getProfessores();
		await getAvaliadores();
	}

	async function getBanca() {
		banca = await BancaApiRepository.DetalhesDaBanca(idBanca);
	}

	async function getAvaliadores() {
		avaliadoresSelecionados = await BancaApiRepository.BuscarTodosAvaliadoresPorBanca(idBanca);
	}

	async function getProfessores() {
		const papeis = [EnumPapel.Professor, EnumPapel.Coordenador, EnumPapel.ProfessorResponsavel];
		const resultados = await Promise.all(
			papeis.map((papel) => UsuarioRepository.PegarTodosPorPapel(papel))
		);
		professoresDisponiveis = resultados.flat();
	}

	async function adicionarAvaliador(idUsuario: number) {
		await BancaApiRepository.CriarAvaliador({ idUsuario, idBanca });
		await carregarDados();
	}

	async function removerAvaliador(avaliadorId: number) {
		await BancaApiRepository.DeletarAvaliador(avaliadorId);
		await carregarDados();
	}

	async function salvarData(e: any) {
		e.preventDefault();
		await BancaApiRepository.AtualizarBanca({ id: idBanca, dataSeminario });
		openModalEditar = false;
		alert('Data atualizada.');
	}

	function iniciarAvaliacao() {
		alert('Avaliação iniciada! (implemente a lógica)');
	}

	let professoresFiltrados = $derived(
		professoresDisponiveis.filter(
			(p) =>
				!avaliadoresSelecionados.find((a) => a.idUsuario === p.id) &&
				p.nome.toLowerCase().includes(filtroNome.toLowerCase())
		)
	);
</script>

<div class="mx-auto max-w-4xl space-y-8 p-6">
	<!-- Info Header -->
	<div class="space-y-1">
		<h1 class="text-2xl font-bold">Banca</h1>
		<p><strong>Projeto:</strong> {banca?.nomeProjeto}</p>
		<p><strong>Descrição:</strong> {banca?.descricao}</p>
		<button class="btn preset-outlined-primary-500 mt-2" onclick={() => (openModalEditar = true)}>
			Editar Data
		</button>
	</div>

	<!-- Avaliadores Atuais -->
	<div class="card bg-surface-100-900 space-y-4 p-4">
		<h2 class="text-lg font-semibold">Avaliadores Atuais</h2>
		{#if avaliadoresSelecionados.length}
			<ul class="space-y-2">
				{#each avaliadoresSelecionados as avaliador}
					<li class="flex items-center justify-between">
						<span>{avaliador.nomeUsuario}</span>
						<button
							class="btn preset-outlined-error-500"
							onclick={() => removerAvaliador(avaliador.id)}
						>
							<Trash />
							Remover
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-sm text-gray-500">Nenhum avaliador atribuído ainda.</p>
		{/if}
	</div>

	<!-- Professores Disponíveis -->
	<div class="card bg-surface-100-900 space-y-4 p-4">
		<h2 class="text-lg font-semibold">Professores Disponíveis</h2>
		<input
			type="text"
			class="input w-full"
			placeholder="Filtrar por nome"
			bind:value={filtroNome}
		/>
		<ul class="mt-2 space-y-2">
			{#each professoresFiltrados as prof}
				<li class="flex items-center justify-between">
					<span>{prof.nome}</span>
					<button
						class="btn preset-outlined-primary-500"
						onclick={() => adicionarAvaliador(prof.id)}
					>
						<Plus />
						Adicionar
					</button>
				</li>
			{/each}
			{#if professoresFiltrados.length === 0}
				<p class="text-sm text-gray-500">Nenhum professor encontrado.</p>
			{/if}
		</ul>
	</div>

	<!-- Start Evaluation Button -->
	<div class="pt-4 text-center">
		<a class="btn preset-filled-success-500 w-full md:w-1/2"
		href="/bancas/{idBanca}/avaliacao">
			Iniciar Avaliação
		</a>
	</div>
</div>

<!-- Modal: Editar Data -->
<ModalBase bind:openState={openModalEditar}>
	{#snippet conteudo()}
		<form onsubmit={salvarData} class="space-y-4 p-4">
			<h2 class="text-xl font-semibold">Editar Data da Banca</h2>
			<FormInputComponent
				tipo="date"
				label="Data do Seminário"
				bind:valor={dataSeminario}
				placeholder="Data"
				erros={null}
				constraints={null}
			/>
			<button type="submit" class="btn preset-filled-primary-500 w-full">Salvar</button>
		</form>
	{/snippet}
</ModalBase>
