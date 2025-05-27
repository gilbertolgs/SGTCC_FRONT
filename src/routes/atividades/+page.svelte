<script lang="ts">
	import Toaster from '$lib/ToastHandler';
	import type Atividade from '$model/Atividade';
	import type LoggedUser from '$model/LoggedUser';
	import type Projeto from '$model/Projeto';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import { getContext, onMount } from 'svelte';
	import { pageName, storeLogin } from '../../stores';
	import AtividadeRepository from '$repository/AtividadeRepository';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import { EnumEstadoProjeto } from '$model/EnumEstadoProjeto';
	import {
		EnumAtividade,
		EnumAtividadeTodosPapeis,
		textoEnumAtividade
	} from '$model/EnumAtividade';
	import { textoEnumPrioridadeAtividade } from '$model/EnumPrioridadeAtividade';

	const toast = new Toaster(getContext);

	let { data } = $props();
	let usuarioLogado = $derived($storeLogin);

	interface ProjetoAtividade {
		projeto: Projeto;
		atividades: Atividade[];
	}
	let projetoAtividades: ProjetoAtividade[] | null = $state(null);

	async function getProjetoAtividades() {
		if (!usuarioLogado) return;

		const projetosUsuario = await ProjetoRepository.PegarTodosNaoCanceladosPorIdUsuario(
			usuarioLogado.id
		);

		const resultados: ProjetoAtividade[] = [];

		for (const projeto of projetosUsuario) {
			const atividadesProjeto = await AtividadeRepository.PegarAtividadesPorProjeto(projeto.id);
			resultados.push({
				projeto,
				atividades: atividadesProjeto
			});
		}

		projetoAtividades = resultados;
	}
	onMount(async () => {
		await getProjetoAtividades();
	});
</script>

<svelte:head>
	<title>{pageName} - Atividades</title>
	<meta name="Página de Atividades pessoais" content="Exibindo atividades" />
</svelte:head>

{#if projetoAtividades}
	<div class="preset-tonal mx-auto mt-2 grid p-3 md:w-1/2">
		<h3 class="h3">Projetos</h3>
		{#each projetoAtividades as projetoAtividade}
			<div class="preset-tonal m-3 rounded p-2">
				<div class="flex justify-between gap-2">
					<a
						href="projeto/{projetoAtividade.projeto.id}"
						class="anchor font-bold group-hover:underline"
					>
						{projetoAtividade.projeto.nome}
					</a>
				</div>
				{#if projetoAtividade.atividades.length > 0}
					<ul class="mt-2 text-sm">
						{#each projetoAtividade.atividades as atividade}
							<li class="my-1">
								<div class="font-semibold">{atividade.nome}</div>
								<div class="text-xs">
									Início: {DataFormatHandler.FormatDate(atividade.dataInicio)} | Entrega: {DataFormatHandler.FormatDate(
										atividade.dataEntrega
									)}
									<br />
									Prioridade: {textoEnumPrioridadeAtividade[atividade.prioridade]} | Estado: {textoEnumPrioridadeAtividade[
										atividade.prioridade
									]}
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="mt-2 text-sm">Sem atividades.</p>
				{/if}
			</div>
		{/each}
	</div>
{/if}
