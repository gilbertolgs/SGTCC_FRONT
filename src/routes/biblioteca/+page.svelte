<script lang="ts">
	import CardProjetoPublico from '$components/CardProjetoPublico.svelte';
	import { EnumTipoFiltro } from '$model/EnumTipoFiltro';
	import { EnumTipoOrdenacao } from '$model/EnumTipoOrdenacao';
	import type LoggedUser from '$model/LoggedUser';
	import type Projeto from '$model/Projeto';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import { onMount } from 'svelte';
	import { pageName, storeLogin } from '../../stores';
	import PesquisaProjetoPublico from './PesquisaProjetoPublico.svelte';

	let usuarioLogado: LoggedUser | null = $state<LoggedUser | null>(null);

	storeLogin.subscribe((value) => {
		usuarioLogado = value;
	});

	let projetos: Projeto[] | null = $state(null);

	onMount(() => {
		getProjetos(
			EnumTipoFiltro.NomeProjeto,
			'',
			EnumTipoOrdenacao.Recentes,
			new Date().getFullYear()
		);
	});

	function getProjetos(
		tipoFiltro: EnumTipoFiltro,
		filtro: string,
		tipoOrdenacao: EnumTipoOrdenacao,
		ano: number
	) {
		projetos = null;
		ProjetoRepository.PegarTodosPorFiltro(tipoFiltro, filtro, tipoOrdenacao, ano).then(
			(resposta) => {
				projetos = resposta;
				console.log(projetos);
			}
		);
	}
</script>

<svelte:head>
	<title>{pageName} - Biblioteca</title>
	<meta
		name="Página principal exibindo projetos concluidos"
		content="Exibindo projetos concluidos"
	/>
</svelte:head>

<div class="m-5 mx-auto md:w-2/3">
	<PesquisaProjetoPublico {getProjetos} />
</div>

{#if projetos}
	{#each projetos as projeto}
		<CardProjetoPublico {projeto} {usuarioLogado} />
	{/each}
{/if}
