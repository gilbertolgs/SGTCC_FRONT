<script lang="ts">
	import { goto } from '$app/navigation';
	import CardProjetoUsuario from '$components/CardProjetoUsuario.svelte';
	import type LoggedUser from '$model/LoggedUser';
	import type Projeto from '$model/Projeto';
	import type Usuario from '$model/Usuario';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import { Plus } from 'lucide-svelte';
	import { getContext, onMount } from 'svelte';
	import { pageName, storeLogin } from '../../../../stores';
	import FormCadastroProjeto from './FormCadastroProjeto.svelte';

	import Toaster from '$lib/ToastHandler';
	const toast = new Toaster(getContext);

	let usuarioLogado: LoggedUser | null = $state<LoggedUser | null>(null);

	storeLogin.subscribe((value) => {
		usuarioLogado = value;
	});

	let { data } = $props();

	let usuario: Usuario | null = $state(null);
	let projetos: Projeto[] | null = $state(null);
	let idUsuario = data.idUsuario;

	let openState = $state(false);

	onMount(async () => {
		if (usuarioLogado === null || idUsuario !== usuarioLogado.id) {
			goto(`/usuario/${idUsuario}`);
		}
		usuario = await UsuarioRepository.PegarPorId(idUsuario);

		await getProjetos();
	});

	async function getProjetos() {
		projetos = await ProjetoRepository.PegarTodosNaoCanceladosPorIdUsuario(idUsuario);
	}

	function abrirModal() {
		openState = !openState;
	}

	async function RealizarCadastro(
		nome: string,
		descricao: string,
		justificativa: string,
		tags: string[]
	) {
		try {
			if (usuarioLogado) {
				const response = await ProjetoRepository.CriarProjeto(
					usuarioLogado.id,
					usuarioLogado.idCurso,
					nome,
					descricao,
					justificativa,
					tags
				);
			}
			openState = false;
			toast.triggerSuccess('Projeto cadastrado com sucesso!');
			await getProjetos();
		} catch (error) {
			openState = false;
			toast.triggerError('Ocorreu um erro ao tentar cadastrar projeto!');
			console.log(error);
		}
	}
</script>

<svelte:head>
	<title>{pageName} - Projetos</title>
	<meta name="Seus Projetos" content="Exibindo seus Projetos" />
</svelte:head>

<FormCadastroProjeto {RealizarCadastro} bind:openState {data} />

<div class="grid w-full">
	<div class="preset-tonal m-2 ml-auto p-1">
		<button
			class="btn preset-filled-success-500"
			onclick={() => {
				abrirModal();
			}}
		>
			<Plus />
			Cadastrar
		</button>
	</div>

	{#if projetos && usuario}
		{#if projetos.length < 1}
			<div class="flex w-full items-center justify-center">
				<span class="preset-tonal rounded p-5">Ainda não há projetos aqui.</span>
			</div>
		{:else}
			<div class="preset-tonal grid gap-2 rounded p-3 md:m-5 md:grid-cols-3">
				{#each projetos as projeto}
					<CardProjetoUsuario {projeto} {usuario} />
				{/each}
			</div>
		{/if}
	{/if}
</div>
