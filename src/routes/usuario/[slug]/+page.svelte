<script lang="ts">
	import CardProjetoUsuario from '$components/CardProjetoUsuario.svelte';
	import Toaster from '$lib/ToastHandler';
	import type LoggedUser from '$model/LoggedUser';
	import type Projeto from '$model/Projeto';
	import type Usuario from '$model/Usuario';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import { getContext, onMount } from 'svelte';
	import { pageName, storeLogin } from '../../../stores';
	import PerfilCard from './PerfilCard.svelte';
	const toast = new Toaster(getContext);

	let usuarioLogado: LoggedUser | null = $state<LoggedUser | null>(null);

	storeLogin.subscribe((value) => {
		usuarioLogado = value;
	});

	let { data } = $props();

	let usuario: Usuario | null = $state(null);
	let projetos: Projeto[] | null = $state(null);
	let idUsuario = data.idUsuario;

	onMount(async () => {
		usuario = await UsuarioRepository.PegarPorId(idUsuario);

		if (usuarioLogado && usuario.id === usuarioLogado.id) {
			projetos = await ProjetoRepository.PegarTodosNaoCanceladosPorIdUsuario(idUsuario);
		}
	});
</script>

<svelte:head>
	<title>{pageName} - Login</title>
	<meta name="Realizar Login" content="Pagina para realização de login" />
</svelte:head>

<div class="grid justify-items-center gap-2">
	<PerfilCard {idUsuario} {data} />
</div>

{#if usuario && projetos && projetos.length > 0}
	<div class="preset-tonal grid gap-2 rounded p-3 md:m-5 md:grid-cols-3">
		{#each projetos as projeto}
			<CardProjetoUsuario {projeto} {usuario} />
		{/each}
	</div>
{/if}
