<script lang="ts">
	import type Projeto from '$model/Projeto';
	import { onMount } from 'svelte';
	import { pageName } from '../../stores';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import { EnumTipoFiltro } from '$model/EnumTipoFiltro';
	import { EnumTipoOrdenacao } from '$model/EnumTipoOrdenacao';
	import CardProjetoPublico from '$components/CardProjetoPublico.svelte';
	import PesquisaProjetoPublico from './PesquisaProjetoPublico.svelte';

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
		<CardProjetoPublico {projeto} />
	{/each}
{/if}
