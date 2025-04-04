<script lang="ts">
	import type Curso from '$model/Curso';
	import { EnumPapel } from '$model/EnumPapel';
	import type Usuario from '$model/Usuario';
	import CursoRepository from '$repository/CursoRepository';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import { Grid2X2Plus, Plus } from 'lucide-svelte/icons';
	import { getContext, onMount } from 'svelte';
	import TableUsuarios from './TableUsuarios.svelte';

	import Toaster from '$lib/ToastHandler';
	import FormCadastroUsuario from './FormCadastroUsuario.svelte';
	import { pageName } from '../../stores';

	const toast = new Toaster(getContext);

	let { data } = $props();
	let usuario: Usuario | null = $state(null);
	let usuarios: Usuario[] | null = $state(null);

	let openState = $state(false);
	let cursos: Curso[] | null = $state(null);

	let papelBusca: EnumPapel = $state(EnumPapel.Aluno);

	async function getUsuarios() {
		usuarios = await UsuarioRepository.PegarTodosPorPapel(papelBusca);
	}
	onMount(async () => {
		cursos = await CursoRepository.PegarTodos();
		await getUsuarios();
	});

	async function RealizarCadastro(
		nome: string,
		email: string,
		curso: number,
		senha: string,
		papel: number
	) {
		try {
			const response = await UsuarioRepository.CriarUsuario(curso, nome, email, senha, papel);
			openState = false;
			toast.triggerSuccess('Usuário cadastrado com sucesso!');
			getUsuarios();
		} catch (error) {
			openState = false;
			toast.triggerError('Ocorreu um erro ao tentar cadastrar usuário!');
			console.log(error);
		}
	}
</script>
<svelte:head>
	<title>{pageName} - Usuários</title>
	<meta
		name="Página de administrador exibindo usuários"
		content="Exibindo usuários"
	/>
</svelte:head>


<FormCadastroUsuario {RealizarCadastro} bind:openState {usuario} {cursos} {data} />
<div class="grid">
	<div class="preset-tonal m-2 ml-auto p-1">
		<!-- <button class="btn preset-filled-primary-500">
			<Grid2X2Plus />
			Importar
		</button> -->

		<button
			class="btn preset-filled-success-500"
			onclick={() => {
				openState = !openState;
			}}
		>
			<Plus />
			Cadastrar
		</button>
	</div>
	<TableUsuarios {getUsuarios} {usuarios} bind:usuario bind:openState bind:papelBusca />
</div>
