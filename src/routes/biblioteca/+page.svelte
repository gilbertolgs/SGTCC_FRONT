<script lang="ts">
	import type Projeto from '$model/Projeto';
	import { onMount } from 'svelte';
	import { pageName } from '../../stores';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import { EnumTipoFiltro } from '$model/EnumTipoFiltro';
	import { EnumTipoOrdenacao } from '$model/EnumTipoOrdenacao';
	import CardProjetoPublico from '$components/CardProjetoPublico.svelte';

	let projetos: Projeto[] = $state([]);

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
		ProjetoRepository.PegarTodosPorFiltro(tipoFiltro, filtro, tipoOrdenacao, ano).then(
			(resposta) => {
				projetos = resposta;
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

{#if projetos.length > 0}
	{#each projetos as projeto}
		<CardProjetoPublico {projeto}/>
	{/each}
{/if}
