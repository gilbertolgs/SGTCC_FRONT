<script lang="ts">
	import { generateRandomCanvas } from '$lib/canvasUtils.js';
	import { EnumParecerProposta } from '$model/EnumParecerProposta';
	import type Projeto from '$model/Projeto.js';
	import CursoRepository from '$repository/CursoRepository.js';
	import ProjetoRepository from '$repository/ProjetoRepository.js';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import {
		Album,
		CalendarDays,
		GraduationCap,
		HandHelping,
		Info,
		ListTodo,
		MessageCircleQuestion,
		NotebookPen,
		ScrollText,
		Users
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { pageName } from '../../../stores';
	import Anotacoes from './abas/Anotacoes.svelte';
	import Arquivos from './abas/Arquivos.svelte';
	import Atividades from './abas/Atividades.svelte';
	import Bibliografia from './abas/Bibliografia.svelte';
	import Calendario from './abas/Calendario.svelte';
	import Duvidas from './abas/Duvidas.svelte';
	import Informacoes from './abas/Informacoes.svelte';
	import Orientacoes from './abas/Orientacoes.svelte';
	import Participantes from './abas/Participantes.svelte';
	import Propostas from './abas/Propostas.svelte';
	import type Atividade from '$model/Atividade';
	import AtividadeRepository from '$repository/AtividadeRepository';

	let { data } = $props();

	let idProjeto = data.idProjeto;
	let projeto: Projeto | null = $state(null);
	let atividades: Atividade[] | null = $state(null);

	async function getAtividades(atividadesPassadas: Atividade[] | null = null) {
		if (atividadesPassadas) {
			atividades = atividadesPassadas;
			return;
		}
		if (!projeto) return;

		atividades = await AtividadeRepository.PegarAtividadesPorProjeto(projeto.id);
	}

	//Gambiarra pro Typescript não reclamar
	let imagemProjeto: string | null = $derived((projeto as Projeto | null)?.ExibeImagem?.() ?? null);

	function handleTabChange(newTabValue: string) {
		if (!document.startViewTransition) {
			abaAtual = newTabValue;
			return;
		}

		document.startViewTransition(() => {
			abaAtual = newTabValue;
		});
	}

	function imagemExiste(imgUrl: string | null) {
		if (!imgUrl) {
			return false;
		}
		return imgUrl.trim() !== '';
	}

	function defineImagem(projetoAtual: Projeto) {
		if (imagemExiste(imagemProjeto)) {
			return imagemProjeto;
		}

		CursoRepository.PegarPorId(projetoAtual.usuarios[0].idCurso).then((curso) => {
			imagemProjeto = curso.ExibeImagem();

			if (imagemExiste(imagemProjeto)) {
				return imagemProjeto;
			}

			generateRandomCanvas(projetoAtual.id, projetoAtual.usuarios[0].idCurso).then(
				(imagemGerada) => {
					if (!imagemGerada) {
						return imagemProjeto;
					}

					imagemProjeto = imagemGerada.imageUrl;
				}
			);
		});
	}

	onMount(async () => {
		await getProjeto();
	});

	async function getProjeto() {
		projeto = await ProjetoRepository.PegarPorId(idProjeto);

		defineImagem(projeto);
	}

	let abaAtual = $state('informacoes');
</script>

<svelte:head>
	<title>{pageName} - {projeto ? projeto.nome : 'Projeto'}</title>
	<meta name="Exibindo informações de projeto" content="Exibindo projeto" />
</svelte:head>

{#snippet projetoBase()}
	<Tabs.Control value="proposta">
		<span class="flex items-center md:gap-2"
			><HandHelping />
			<span class="hidden md:block">Proposta</span>
		</span>
	</Tabs.Control>
	<Tabs.Control value="informacoes">
		<span class="flex items-center md:gap-2"
			><Info />
			<span class="hidden md:block">Informações</span>
		</span>
	</Tabs.Control>
	<Tabs.Control value="participantes">
		<span class="flex items-center md:gap-2"
			><Users />
			<span class="hidden md:block">Participantes</span>
		</span>
	</Tabs.Control>
{/snippet}
{#snippet projetoProposta()}
	{@render projetoBase()}
{/snippet}
{#snippet projetoEmAndamento()}
	{@render projetoBase()}
	<Tabs.Control value="atividades">
		<span class="flex items-center md:gap-2"
			><ListTodo />
			<span class="hidden md:block">Atividades</span>
		</span>
	</Tabs.Control>
	<Tabs.Control value="arquivos">
		<span class="flex items-center md:gap-2"
			><ScrollText />
			<span class="hidden md:block">Documentação</span>
		</span>
	</Tabs.Control>
	<Tabs.Control value="anotacoes">
		<span class="flex items-center md:gap-2"
			><NotebookPen />
			<span class="hidden md:block">Anotações</span>
		</span>
	</Tabs.Control>
	<Tabs.Control value="bibliografia">
		<span class="flex items-center md:gap-2"
			><Album />
			<span class="hidden md:block">Bibliografia</span>
		</span>
	</Tabs.Control>
	<Tabs.Control value="duvidas">
		<span class="flex items-center md:gap-2"
			><MessageCircleQuestion />
			<span class="hidden md:block">Dúvidas</span>
		</span>
	</Tabs.Control>
	<Tabs.Control value="orientacoes">
		<span class="flex items-center md:gap-2"
			><GraduationCap />
			<span class="hidden md:block">Relatório</span>
		</span>
	</Tabs.Control>
	<Tabs.Control value="calendario">
		<span class="flex items-center md:gap-2"
			><CalendarDays />
			<span class="hidden md:block">Calendário</span>
		</span>
	</Tabs.Control>
{/snippet}

{#if projeto}
	<div class="items-center justify-items-center md:grid">
		<div class="w-screen">
			<Tabs
				listJustify="justify-start"
				value={abaAtual}
				onValueChange={(e) => handleTabChange(e.value)}
				listClasses="w-full overflow-x-auto overflow-y-hidden"
				contentClasses="md:w-[90%] mx-auto"
			>
				{#snippet list()}
					{#if projeto?.propostaAprovada == EnumParecerProposta.NaoAvaliado}
						{@render projetoProposta()}
					{:else}
						{@render projetoEmAndamento()}
					{/if}
				{/snippet}
				{#snippet content()}
					{#if projeto}
						<Tabs.Panel value="proposta"><Propostas {projeto} {getProjeto} {data} /></Tabs.Panel>
						<Tabs.Panel value="informacoes"
							><Informacoes {projeto} {getProjeto} {data} /></Tabs.Panel
						>
						<Tabs.Panel value="participantes"><Participantes {projeto} /></Tabs.Panel>
						<Tabs.Panel value="atividades"><Atividades {projeto} getAtividadesGlobal={getAtividades} {data} /></Tabs.Panel>
						<Tabs.Panel value="arquivos"><Arquivos {projeto} /></Tabs.Panel>
						<Tabs.Panel value="anotacoes"><Anotacoes {projeto} {data} /></Tabs.Panel>
						<Tabs.Panel value="bibliografia"><Bibliografia {projeto} {data} /></Tabs.Panel>
						<Tabs.Panel value="duvidas"><Duvidas {projeto} {data} /></Tabs.Panel>
						<Tabs.Panel value="orientacoes"><Orientacoes {projeto} {data} /></Tabs.Panel>
						<Tabs.Panel value="calendario"><Calendario {projeto} {atividades} /></Tabs.Panel>
					{/if}
				{/snippet}
			</Tabs>
		</div>
	</div>
{/if}
