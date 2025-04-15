<script lang="ts">
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import type Atividade from '$model/Atividade';
	import type ComentarioAtividade from '$model/ComentarioAtividade';
	import AtividadeRepository from '$repository/AtividadeRepository';
	import { X as IconX, Pencil } from 'lucide-svelte';
	import { getContext } from 'svelte';
	const toast = new Toaster(getContext);

	let { openState = $bindable(), idAtividade, abrirModal, getAtividades } = $props();
	let atividade: Atividade | null = $derived(null);
	let comentarios: ComentarioAtividade[] | null = $derived(null);
	let txtComentario: string = $state('');

	let openStateApagar = $state(false);

	$effect(() => {
		console.log(idAtividade);
		if (idAtividade !== 0) {
			pegaAtividade();
			pegaComentarios();
		}
	});

	async function pegaAtividade() {
		atividade = await AtividadeRepository.PegarAtividadePorId(idAtividade);
		console.log(atividade);
	}

	async function apagaAtividade() {
		if (atividade) {
			await AtividadeRepository.ExcluirAtividade(atividade.id);
			openState = false;
			openStateApagar = false;
			toast.triggerSuccess('Atividade excluída com sucesso');
			getAtividades();
			return;
		}
		toast.triggerError('Ocorreu um erro ao tentar Excluir atividade');
	}

	async function pegaComentarios() {
		comentarios = await AtividadeRepository.PegarComentariosAtividade(idAtividade);
	}

	async function EnviarComentario() {
		if (txtComentario.trim() == '') {
			return;
		}
		await AtividadeRepository.AdicionarComentario(2, idAtividade, txtComentario);
		pegaComentarios();
		txtComentario = '';
	}
</script>

<ConfirmDialog
	bind:openState={openStateApagar}
	titulo="Tem certeza que deseja excluir essa atividade?"
	texto="Atividade: {atividade?.nome}"
	funcao={apagaAtividade}
/>

<ModalBase
	bind:openState
	classe="card grid bg-surface-100-900 p-4 space-y-4 shadow-xl w-full md:w-3/4"
>
	{#snippet conteudo()}
		{#if atividade}
			<div class="flex flex-col">
				<div class="mb-5">
					<h3 class="h3">{atividade.nome}</h3>
					<span>{atividade.descricao}</span>
					<div class="mt-5">
						<button
							class="btn preset-filled-primary-500"
							onclick={() => {
								abrirModal('Adicionar', atividade);
							}}><Pencil /> Alterar</button
						>
						<button
							class="btn preset-filled-error-500"
							onclick={() => {
								openStateApagar = !openStateApagar;
							}}><IconX />Excluir</button
						>
					</div>
				</div>
				{#if comentarios === null || comentarios.length < 1}
					<span class="preset-tonal m-2 italic opacity-70">Ainda não há comentários</span>
				{:else}
					<ul class="preset-tonal mb-3 grid h-1/2 gap-2 overflow-auto">
						{#each comentarios as comentario}
							<li class="rounded border p-2">
								<div class="w-full">
									<a href="/usuario/{comentario.idUsuario}" class="anchor mr-auto"
										>{comentario.nomeUsuario}</a
									>
									<!-- <button class="btn preset-filled-primary-500">Alterar</button>
									<button class="btn preset-filled-error-500">Excluir</button> -->
								</div>
								<p>{comentario.comentario}</p>
							</li>
						{/each}
					</ul>
				{/if}
				<div class="flex gap-2">
					<FormInputComponent
						classe="col-span-3"
						label="Comentário"
						placeholder="comentário"
						tipo="text"
						bind:valor={txtComentario}
						erros={null}
						constraints={null}
					/>
					<button class="btn preset-filled-primary-500 mt-auto"
					onclick={() => {
						EnviarComentario();
					}}>Enviar</button>
				</div>
			</div>
		{/if}
	{/snippet}
</ModalBase>
