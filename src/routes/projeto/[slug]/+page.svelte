<script lang="ts">
	import { generateRandomCanvas } from '$lib/canvasUtils.js';
	import type Projeto from '$model/Projeto.js';
	import CursoRepository from '$repository/CursoRepository.js';
	import ProjetoRepository from '$repository/ProjetoRepository.js';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import { FolderOpen, Info, ListTodo, Users } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Informacoes from './components/Informacoes.svelte';
	import Participantes from './components/Participantes.svelte';
	import Atividades from './components/Atividades.svelte';
	import Arquivos from './components/Arquivos.svelte';
	import { pageName } from '../../../stores';

	let { data } = $props();

	let idProjeto = data.idProjeto;
	let projeto: Projeto | null = $state(null);

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
		console.log(projeto);
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

{#if projeto}
	<div class="items-center justify-items-center md:grid">
		<div class="relative flex w-full justify-center">
			<!-- style={`view-transition-name: item-image-${projeto.id};`} -->
			<img
				src={imagemProjeto}
				alt="Imagem do Projeto"
				class="rounded-xl inset-shadow-sm md:w-1/2"
			/>
			<div class="bg-primary-500/50 absolute bottom-0 left-0 m-2 rounded-xl px-4 py-2 md:left-1/4">
				{projeto.nome}
			</div>
		</div>
		<div class="w-full md:m-2 md:w-3/4">
			<Tabs
				listJustify="justify-between"
				value={abaAtual}
				onValueChange={(e) => (handleTabChange(e.value))}
			>
				{#snippet list()}
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
					<Tabs.Control value="atividades">
						<span class="flex items-center md:gap-2"
							><ListTodo />
							<span class="hidden md:block">Atividades</span>
						</span>
					</Tabs.Control>
					<Tabs.Control value="arquivos">
						<span class="flex items-center md:gap-2"
							><FolderOpen />
							<span class="hidden md:block">Arquivos</span>
						</span>
					</Tabs.Control>
				{/snippet}
				{#snippet content()}
					{#if projeto}
						<Tabs.Panel value="informacoes"><Informacoes {projeto} {getProjeto} /></Tabs.Panel>
						<Tabs.Panel value="participantes"><Participantes {projeto} /></Tabs.Panel>
						<Tabs.Panel value="atividades"><Atividades {projeto} /></Tabs.Panel>
						<Tabs.Panel value="arquivos"><Arquivos {projeto} /></Tabs.Panel>
					{/if}
				{/snippet}
			</Tabs>
		</div>
	</div>
{/if}
