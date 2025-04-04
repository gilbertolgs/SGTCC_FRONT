<script lang="ts">
	import type Curso from '$model/Curso';
	import CursoRepository from '$repository/CursoRepository';
	import { Grid2X2Plus, Plus } from 'lucide-svelte/icons';
	import { getContext, onMount } from 'svelte';
	import FormCadastroCurso from './FormCadastroCurso.svelte';
	import TableCursos from './TableCursos.svelte';

	import Toaster from '$lib/ToastHandler';
	import ExcluirCurso from './ExcluirCurso.svelte';
	import { pageName } from '../../stores';
	import AlterarImagemCurso from './AlterarImagemCurso.svelte';

	const toast = new Toaster(getContext);

	let { data } = $props();

	let openState = $state(false);
	let openStateImagem = $state(false);
	let openStateDelete = $state(false);
	let cursos: Curso[] | null = $state(null);
	let curso: Curso | null = $state(null);

	async function getCursos() {
		cursos = await CursoRepository.PegarTodos();
	}
	onMount(async () => {
		await getCursos();
	});
	async function RealizarCadastro(nome: string, descricao: string, idCurso: number = 0) {
		try {
			if (idCurso === 0) {
				const response = await CursoRepository.CriarCurso(nome, descricao);
			} else {
				const response = await CursoRepository.AtualizarCurso(idCurso, nome, descricao);
			}
			openState = false;
			toast.triggerSuccess('Curso cadastrado com sucesso!');
			getCursos();
		} catch (error) {
			openState = false;
			toast.triggerError('Ocorreu um erro ao tentar cadastrar curso!');
			console.log(error);
		}
	}

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Insert':
				curso = argumentos;
				openState = !openState;
				break;
			case 'Delete':
				if (argumentos == null) return;

				curso = argumentos;
				openStateDelete = !openStateDelete;
				break;
			case 'Imagem':
				curso = argumentos;
				openStateImagem = !openStateImagem;
				break;

			default:
				break;
		}
	}
</script>

<svelte:head>
	<title>{pageName} - Cursos</title>
	<meta name="Página de administrador exibindo cursos" content="Exibindo cursos" />
</svelte:head>

<FormCadastroCurso {RealizarCadastro} bind:curso bind:openState {data} />
<AlterarImagemCurso bind:openState={openStateImagem} {curso} {getCursos}/>
<ExcluirCurso bind:openState={openStateDelete} {curso} {getCursos} />

<div class="grid">
	<div class="preset-tonal m-2 ml-auto p-1">
		<!-- <button class="btn preset-filled-primary-500">
			<Grid2X2Plus />
			Importar
		</button> -->

		<button
			class="btn preset-filled-success-500"
			onclick={() => {
				abrirModal('Insert');
			}}
		>
			<Plus />
			Cadastrar
		</button>
	</div>
	<TableCursos {abrirModal} {getCursos} {cursos} bind:curso />
</div>
