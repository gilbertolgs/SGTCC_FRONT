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
	import CardProjetoPublico from '$components/CardProjetoPublico.svelte';
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
			projetos = await ProjetoRepository.PegarPorFavoritosDeUsuario(idUsuario);
		}
	});
</script>

<svelte:head>
	<title>{pageName} - Perfil</title>
	<meta name="Perfil de Usuario" content="Pagina de perfil" />
</svelte:head>

<div class="grid justify-items-center gap-2">
	<PerfilCard {idUsuario} {data} />
</div>

{#if usuario && projetos && projetos.length > 0}
	<div class="preset-tonal grid gap-2 p-5">
		{#each projetos as projeto}
			<CardProjetoPublico {projeto} usuarioLogado={usuarioLogado} />
		{/each}
	</div>
{/if}
