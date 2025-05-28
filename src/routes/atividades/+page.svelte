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

{#if projetoAtividades?.length}
	<div class="mx-auto mt-6 space-y-6 md:w-1/2">
		<h3 class="text-lg font-semibold">Projetos</h3>

		{#each projetoAtividades as projetoAtividade (projetoAtividade.projeto.id)}
			<div class="preset-tonal rounded p-4 shadow-sm transition-all hover:shadow-md">
				<a
					href={`projeto/${projetoAtividade.projeto.id}`}
					class="anchor text-base font-bold hover:underline"
				>
					{projetoAtividade.projeto.nome}
				</a>

				{#if projetoAtividade.atividades?.length > 0}
					<ul class="mt-3 space-y-3 text-sm">
						{#each projetoAtividade.atividades as atividade}
							<li>
								<div class="font-semibold">{atividade.nome}</div>
								<div class="text-muted-foreground text-xs">
									Início: {DataFormatHandler.FormatDate(atividade.dataInicio)} | Entrega: {DataFormatHandler.FormatDate(
										atividade.dataEntrega
									)}<br />
									Prioridade: {textoEnumPrioridadeAtividade[atividade.prioridade]} | Estado: {textoEnumAtividade[
										atividade.estado
									]}
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-muted-foreground mt-3 text-sm">Sem atividades.</p>
				{/if}
			</div>
		{/each}
	</div>
{:else}
	<div
		class="preset-tonal text-muted-foreground mx-auto mt-6 rounded p-6 text-center shadow-sm md:w-1/2"
	>
		<p>Não há projetos para exibir no momento.</p>
	</div>
{/if}
