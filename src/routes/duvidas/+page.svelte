<script lang="ts">
	import { Check, XIcon } from 'lucide-svelte/icons';
	import { getContext, onMount } from 'svelte';

	import Toaster from '$lib/ToastHandler';
	import type Convite from '$model/Convite';
	import { EnumConvite } from '$model/EnumConvite';
	import type LoggedUser from '$model/LoggedUser';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import { pageName, storeLogin } from '../../stores';
	import DetalhesDuvida from '../projeto/[slug]/components/DetalhesDuvida.svelte';
	import DuvidaRepository from '$repository/DuvidaRepository';
	import type Duvida from '$model/Duvida';
	import CardDuvida from '$components/CardDuvida.svelte';

	const toast = new Toaster(getContext);

	let { data } = $props();
	let usuarioLogado = $derived($storeLogin);

	let openStateDetalhes = $state(false);
	let duvidaSelecionada: Duvida | null = $state(null);
	let duvidas: Duvida[] | null = $state(null);

	onMount(async () => {
		getDuvidas();
	});

	async function getDuvidas() {
		if (usuarioLogado) {
			duvidas = await DuvidaRepository.PegarDuvidasPorCurso(usuarioLogado.idCurso);
		}
	}

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Detalhes':
				duvidaSelecionada = argumentos;
				openStateDetalhes = !openStateDetalhes;
				break;
			default:
				break;
		}
	}
</script>

<svelte:head>
	<title>{pageName} - Convites</title>
	<meta name="Página de Convites" content="Exibindo convites" />
</svelte:head>

<DetalhesDuvida
	bind:openState={openStateDetalhes}
	duvida={duvidaSelecionada}
	{abrirModal}
	{getDuvidas}
/>

{#if duvidas}
	<div class="preset-tonal flex flex-col gap-3 border p-4 shadow-md">
		{#if duvidas && duvidas.length > 0}
			{#each duvidas as duvida, i}
				{#if i > 0}
					<hr class="my-3" />
				{/if}
				<CardDuvida {abrirModal} {duvida} />
			{/each}
		{:else}
			<span>Não há dúvidas no momento!</span>
		{/if}
	</div>
{/if}
