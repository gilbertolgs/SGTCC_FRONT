<script lang="ts">
	import { pageName, storeLogin } from '../../../stores';

	import Toaster from '$lib/ToastHandler';
	import { getContext, onMount } from 'svelte';

	import CardProjetoUsuario from '$components/CardProjetoUsuario.svelte';
	import type LoggedUser from '$model/LoggedUser';
	import type Projeto from '$model/Projeto';
	import type Usuario from '$model/Usuario';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import UsuarioRepository from '$repository/UsuarioRepository';
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

		projetos = await ProjetoRepository.PegarTodosPorIdUsuario(idUsuario);
	});
</script>

<svelte:head>
	<title>{pageName} - Login</title>
	<meta name="Realizar Login" content="Pagina para realização de login" />
</svelte:head>

<div class="grid justify-items-center gap-2">
	<PerfilCard {idUsuario} {data} />
</div>

{#if projetos && usuario}
	<div class="preset-tonal rounded md:m-5 grid md:grid-cols-3 gap-2 p-3">
		{#each projetos as projeto}
			<CardProjetoUsuario {projeto} {usuario} />
		{/each}
	</div>
{/if}
