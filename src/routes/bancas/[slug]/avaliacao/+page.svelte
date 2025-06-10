<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import Toaster from '$lib/ToastHandler';
	import { EnumConvite } from '$model/EnumConvite';
	import { EnumFuncaoUsuario } from '$model/EnumFuncaoUsuario';
	import { EnumTipoNota } from '$model/EnumTipoNota';
	import type Projeto from '$model/Projeto';
	import type Usuario from '$model/Usuario';
	import BancaApiRepository from '$repository/openapi/BancaApiRepository';
	import DocumentoApiRepository from '$repository/openapi/DocumentoApiRepository';
	import NotaApiRepository from '$repository/openapi/NotaApiRepository';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import { getContext, onMount } from 'svelte';
	import { storeLogin } from '../../../../stores';
	import { goto } from '$app/navigation';

	const toast = new Toaster(getContext);

	interface Props {
		data: any;
	}
	let { data }: Props = $props();
	const idBanca = $derived(data.idBanca);

	let usuarioLogado = $derived($storeLogin);

	let idProjeto: number = $state(0);
	let projeto: Projeto | null = $state(null);
	let idAluno: number = $state(0);
	let idAvaliadorBanca: number = $state(0);
	let alunos: Usuario[] | null = $state(null);

	type NotaEntry = {
		alunoId: number;
		campoId: number;
		valor: number | null;
	};

	let notas: Record<number, Record<number, NotaEntry>> = $state({});
	let categorias: any[] = $state([]);
	let camposPorCategoria: Record<string, any[]> = $state({});

	let carregando = $state(true);

	onMount(async () => {
		try {
			const categoriasResponse = await DocumentoApiRepository.PegarCategorias();
			categorias = categoriasResponse;

			for (const cat of categorias) {
				const campos = await DocumentoApiRepository.PegarPorCategoria(cat.id);
				camposPorCategoria[cat.valor] = campos;
			}

			pegaAvaliadorBanca();
			await pegaProjeto();
			await pegaAlunos(); // <-- await this before continuing
		} catch (error) {
			console.error(error);
		} finally {
			carregando = false; // <-- Only after everything is ready
		}
	});

	async function pegaProjeto() {
		const dados: any = await BancaApiRepository.PegarBancaPorId(idBanca);
		projeto = await ProjetoRepository.PegarPorId(dados.idProjeto);
	}
	async function pegaAlunos() {
		if (!projeto) return;
		const participantesGerais = await UsuarioRepository.PegarTodosPorProjeto(projeto.id);
		alunos = participantesGerais.filter(
			(p) => p.estado == EnumConvite.Aceito && p.funcao != EnumFuncaoUsuario.Orientador
		);

		// Ensure all global fields (non-individual) are initialized under alunoId = 0
		notas[0] ??= {};

		for (const categoria of categorias) {
			if (categoria.valor !== 'Avaliação Individual') {
				for (const campo of camposPorCategoria[categoria.valor]) {
					notas[0][campo.id] ??= {
						alunoId: 0,
						campoId: campo.id,
						valor: null
					};
				}
			}
		}

		// Then handle individual fields per aluno
		for (const aluno of alunos) {
			notas[aluno.id] ??= {};

			for (const categoria of categorias) {
				if (categoria.valor === 'Avaliação Individual') {
					for (const campo of camposPorCategoria[categoria.valor]) {
						notas[aluno.id][campo.id] ??= {
							alunoId: aluno.id,
							campoId: campo.id,
							valor: null
						};
					}
				}
			}
		}

		console.log(notas);
	}
	async function pegaAvaliadorBanca() {
		const avaliadores: any = await BancaApiRepository.BuscarTodosAvaliadoresPorBanca(idBanca);

		if (!avaliadores || !usuarioLogado) return;

		const avaliadoresFiltrados = avaliadores.filter(
			(a: { idUsuario: number }) => a.idUsuario === usuarioLogado.id
		);

		console.log(avaliadoresFiltrados);
		if (avaliadoresFiltrados.length < 1) return;

		idAvaliadorBanca = avaliadoresFiltrados[0].id;
	}

	async function salvarNotas() {
		for (const alunoId in notas) {
			const campos = notas[alunoId];
			for (const campoId in campos) {
				const nota = campos[campoId];

				// Skip if not part of 'Avaliação Individual'
				if (nota.valor != null && nota.alunoId > 0) {
					await NotaApiRepository.CriarNotaDocumentoAluno(
						idAvaliadorBanca,
						nota.campoId,
						nota.alunoId,
						nota.valor,
						EnumTipoNota.QuantoAoProjeto
					);
				}
			}
		}
		toast.triggerSuccess('Notas salvas com sucesso!');

		goto('/bancas/' + idBanca);
	}
</script>

{#if carregando}
	<p>Carregando campos...</p>
{:else}
	<div class="space-y-8">
		{#each categorias as categoria}
			{#if categoria.valor !== 'Avaliação Individual'}
				<div class="rounded p-4 shadow-xl md:m-4">
					<h2 class="mb-4 text-xl font-semibold">{categoria.valor}</h2>
					<div class="space-y-4">
						{#each camposPorCategoria[categoria.valor] ?? [] as campo}
							{#if notas[0] && notas[0][campo.id]}
								<FormInputComponent
									label={campo.campo}
									placeholder={campo.campo}
									tipo="number"
									bind:valor={notas[0][campo.id].valor}
									erros={null}
									constraints={null}
								/>
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		{/each}

		<!-- CAMPOS POR ALUNO (Avaliação Individual) -->
		{#if alunos}
			{#each alunos as aluno}
				<div class="rounded p-4 shadow-xl md:m-4">
					<h2 class="mb-4 text-xl font-semibold">{aluno.nome}</h2>
					<div class="space-y-4">
						{#each categorias as categoria}
							{#if categoria.valor === 'Avaliação Individual'}
								<div class="rounded p-4 shadow-xl md:m-4">
									<h2 class="mb-4 text-xl font-semibold">{categoria.valor}</h2>
									<div class="space-y-4">
										{#each camposPorCategoria[categoria.valor] ?? [] as campo}
											{#if notas[aluno.id] && notas[aluno.id][campo.id]}
												<FormInputComponent
													label={campo.campo}
													placeholder={campo.campo}
													tipo="number"
													bind:valor={notas[aluno.id][campo.id].valor}
													erros={null}
													constraints={null}
												/>
											{/if}
										{/each}
									</div>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		{/if}

		<div class="text-center">
			<button class="btn preset-filled-success-500 my-5 mt-4 w-full md:w-1/2" onclick={salvarNotas}>
				Salvar Avaliação
			</button>
		</div>
	</div>
{/if}
