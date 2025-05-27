<script lang="ts">
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import type Duvida from '$model/Duvida';
	import { Pencil, Trash, XIcon } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { storeLogin } from '../../../../stores';
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import DuvidaRepository from '$repository/DuvidaRepository';
	import { fade } from 'svelte/transition';

	const toast = new Toaster(getContext);

	let usuarioLogado = $derived($storeLogin);

	interface Props {
		openState: any;
		duvida: Duvida | null;
		abrirModal: Function;
		getDuvidas: Function;
	}

	interface RespostaDuvida {
		id: number;
		idDuvida: number;
		idUsuario: number;
		texto: string;
		nomeUsuario: string;
	}

	let { openState = $bindable(), duvida, abrirModal, getDuvidas }: Props = $props();

	let respostas: RespostaDuvida[] | null = $derived(null);
	let txtResposta: string = $state('');
	let idRespostaSelecionada: number = $state(0);

	async function pegaRespostas() {
		if (!duvida) return;

		try {
			respostas = await DuvidaRepository.RespostasPorDuvida(duvida.id);
		} catch (error) {
			respostas = [];
		}
	}

	async function EnviarResposta() {
		if (txtResposta.trim() == '' || usuarioLogado === null || duvida === null) {
			return;
		}

		if (idRespostaSelecionada === 0) {
			await DuvidaRepository.AdicionarResposta(duvida.id, usuarioLogado.id, txtResposta);
		} else {
			await DuvidaRepository.AtualizarResposta(
				idRespostaSelecionada,
				duvida.id,
				usuarioLogado.id,
				txtResposta
			);
		}
		pegaRespostas();
		txtResposta = '';
		idRespostaSelecionada = 0;
	}

	async function ExcluirResposta(idResposta: number) {
		await DuvidaRepository.ApagarResposta(idResposta);
		pegaRespostas();
	}

	async function AlterarResposta(idReposta: number, texto: string) {
		idRespostaSelecionada = idReposta;
		txtResposta = texto.trim();
	}

	$effect(() => {
		if (duvida) {
		}
		pegaRespostas();
	});
</script>

<ModalBase
	bind:openState
	classe="card grid bg-surface-100-900 p-4 shadow-xl w-full md:w-1/2 h-full"
>
	{#snippet conteudo()}
		{#if duvida}
			<div class="flex h-full flex-col gap-3">
				<div class="grid grid-flow-col">
					<h3 class="h3">{duvida.texto}</h3>
				</div>
				<hr class="mx-5 my-2 opacity-30" />
				{#if usuarioLogado && usuarioLogado.id == duvida.idUsuario}
					<div class="flex gap-2">
						<button
							class="btn preset-filled-primary-500"
							onclick={() => {
								abrirModal('Adicionar', duvida);
							}}
						>
							<Pencil /> Alterar
						</button>
						<button
							class="btn preset-filled-error-500"
							onclick={() => {
								abrirModal('Apagar', duvida);
							}}
						>
							<Trash /> Excluir
						</button>
					</div>
				{/if}
			</div>
			{#if respostas === null || respostas.length < 1}
				<span class="preset-tonal m-2 p-2 italic opacity-70" in:fade={{ duration: 200 }}
					>Ainda não há respostas</span
				>
			{:else}
				<ul
					class="mb-3 grid gap-2 overflow-auto"
					in:fade={{ duration: 200 }}
				>
					{#each respostas as resposta}
						<li class="rounded preset-tonal shadow-xl p-2" in:fade={{ duration: 400 }} out:fade={{ duration: 100 }}>
							<div class="flex w-full gap-1">
								<a href="/usuario/{resposta.idUsuario}" class="anchor mr-auto"
									>{resposta.nomeUsuario}</a
								>
								{#if usuarioLogado && usuarioLogado.id == resposta.idUsuario}
									<button
										class="btn preset-outlined-primary-500"
										onclick={() => {
											AlterarResposta(resposta.id, resposta.texto);
										}}><Pencil /> Alterar</button
									>
									<button
										class="btn preset-outlined-error-500"
										onclick={() => {
											ExcluirResposta(resposta.id);
										}}><XIcon /> Excluir</button
									>
								{/if}
							</div>
							<p>{resposta.texto}</p>
						</li>
					{/each}
				</ul>
			{/if}
			<div class="my-10 flex gap-2">
				<FormInputComponent
					classe="col-span-3"
					label="Resposta"
					placeholder="resposta"
					tipo="text"
					bind:valor={txtResposta}
					erros={null}
					constraints={null}
				/>
				<button
					class="btn preset-filled-primary-500 mt-auto"
					onclick={() => {
						EnviarResposta();
					}}>{idRespostaSelecionada === 0 ? 'Enviar' : 'Alterar'}</button
				>
			</div>
		{/if}
	{/snippet}
</ModalBase>
