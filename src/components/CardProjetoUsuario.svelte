<script lang="ts">
	import { goto, preloadCode, preloadData } from '$app/navigation';
	import { generateRandomCanvas } from '$lib/canvasUtils';
	import type Projeto from '$model/Projeto';
	import type Usuario from '$model/Usuario';
	import CursoRepository from '$repository/CursoRepository';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import { onMount } from 'svelte';

	interface Props {
		projeto: Projeto;
		usuario: Usuario;
	}
	let { projeto, usuario }: Props = $props();

	//Gambiarra pro Typescript não reclamar
	let imagemProjeto: string = $derived((projeto as Projeto | null)?.ExibeImagem?.() ?? '');
	let progresso = $state(50);

	function imagemExiste(imgUrl: string) {
		return imgUrl.trim() !== '';
	}

	function defineImagem() {
		if (imagemExiste(imagemProjeto)) {
			return imagemProjeto;
		}

		CursoRepository.PegarPorId(usuario.idCurso).then((curso) => {
			imagemProjeto = curso.ExibeImagem();

			if (imagemExiste(imagemProjeto)) {
				return imagemProjeto;
			}

			generateRandomCanvas(projeto.id, usuario.idCurso).then((imagemGerada) => {
				if (!imagemGerada) {
					return imagemProjeto;
				}

				imagemProjeto = imagemGerada.imageUrl;
			});
		});
	}

	$effect(() => {
		defineImagem();
		calculaProgresso();
	});

	async function calculaProgresso() {
		const atividades = await ProjetoRepository.PegarAtividades(projeto.id);

		const totalPoints = atividades.length;
		let earnedPoints = atividades.reduce((sum: number, task: { estado: number; }) => {
			if (task.estado === 2) return sum + 2;
			if (task.estado === 1) return sum + 1;
			return sum;
		}, 0);

		if (totalPoints === 0) {
			progresso = 0;
			return;
		}
		console.log("earnedPoints");
		console.log(earnedPoints);
		console.log(totalPoints);
		earnedPoints = earnedPoints / 2;
		

		progresso = Math.round((earnedPoints / totalPoints) * 100);
	}

	async function navigateToFoo() {
		const target = '/projeto/1';

		// Preload code and data
		await preloadCode(target);
		await preloadData(target);

		// If view transitions are supported
		if (document.startViewTransition) {
			document.startViewTransition(() => {
				goto(target);
			});
		} else {
			goto(target);
		}
	}
</script>

<div
	class="card group m-2 mx-auto flex w-full flex-col justify-between border border-stone-800 shadow-2xl drop-shadow-2xl md:w-80"
>
	<div>
		<div class="overflow-hidden rounded-t-xl">
			<img
				src={imagemProjeto}
				alt="Imagem do Projeto"
				style={`view-transition-name: item-image-${projeto.id};`}
				class="w-full transition-all delay-100 duration-300 group-hover:scale-110 md:min-w-30"
			/>
		</div>
		<hr class="text-stone-800" />

		<div class="grid items-center justify-between overflow-hidden p-4">
			<div>
				<a href={`/projeto/${projeto.id}`} class="anchor font-bold">
					{projeto.nome}
				</a>
				<div class="text-xs break-normal opacity-70">{projeto.descricao}</div>
			</div>
		</div>
	</div>
	<div class="m-2 grid gap-3">
		<span class="text-primary-500 mx-2">Progresso: {progresso}%</span>
		<Progress value={progresso} max={100} meterBg="bg-primary-500" />
	</div>
	{#if projeto.tags.length > 0}
		<div class="flex flex-wrap gap-2 p-2">
			{#each projeto.tags as tag}
				<div class="preset-filled-primary-500 chip">
					{tag.nome}
				</div>
			{/each}
		</div>
	{/if}
</div>
