<script lang="ts">
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import type Atividade from '$model/Atividade';
	import type ComentarioAtividade from '$model/ComentarioAtividade';
	import AtividadeRepository from '$repository/AtividadeRepository';
	import { CircleDot, X as IconX, Pencil } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { storeLogin } from '../../../../stores';
	import type LoggedUser from '$model/LoggedUser';
	import {
		EnumPrioridadeAtividade,
		textoEnumPrioridadeAtividade
	} from '$model/EnumPrioridadeAtividade';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import type Usuario from '$model/Usuario';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import { fade } from 'svelte/transition';
	const toast = new Toaster(getContext);

	let usuarioLogado: LoggedUser | null = $state<LoggedUser | null>(null);

	storeLogin.subscribe((value) => {
		console.log(value);

		usuarioLogado = value;
	});

	let { openState = $bindable(), idAtividade, abrirModal, getAtividades } = $props();
	let atividade: Atividade | null = $derived(null);
	let usuarioEncarregado: Usuario | null = $derived(null);
	let comentarios: ComentarioAtividade[] | null = $derived(null);
	let txtComentario: string = $state('');
	let idComentarioSelecionado: number = $state(0);

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
		usuarioEncarregado = await UsuarioRepository.PegarPorId(atividade.idUsuario);
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
		try {
			comentarios = await AtividadeRepository.PegarComentariosAtividade(idAtividade);
		} catch (error) {
			comentarios = [];
		}
	}

	async function EnviarComentario() {
		if (txtComentario.trim() == '' || usuarioLogado == null) {
			return;
		}
		if (idComentarioSelecionado === 0) {
			await AtividadeRepository.AdicionarComentario(usuarioLogado.id, idAtividade, txtComentario);
		} else {
			await AtividadeRepository.AtualizarComentario(
				idComentarioSelecionado,
				usuarioLogado.id,
				idAtividade,
				txtComentario
			);
		}
		pegaComentarios();
		txtComentario = '';
		idComentarioSelecionado = 0;
	}

	async function ExcluirComentario(idComentario: number) {
		await AtividadeRepository.ExcluirComentario(idComentario);
		pegaComentarios();
	}

	async function AlterarComentario(idComentario: number, texto: string) {
		idComentarioSelecionado = idComentario;
		txtComentario = texto;
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
			<div class="mx-5 flex flex-col overflow-auto">
				<div class="mb-5 flex grid-cols-4 md:grid">
					<div class="col-span-3 flex flex-col">
						<h3 class="h3">{atividade.nome}</h3>
						<span class="max-h-20 overflow-auto break-all">{atividade.descricao}</span>
						<div class="mt-5">
							<button
								class="btn preset-filled-primary-500"
								onclick={() => {
									abrirModal('Adicionar', atividade);
									openState = false;
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
					<div class="ml-auto grid justify-start gap-2">
						<span>Encarregado: {usuarioEncarregado?.nome}</span>
						<span class="flex gap-2"
							>Prioridade:
							{#if atividade.prioridade === EnumPrioridadeAtividade.Baixa}
								<CircleDot class="text-success-500 fill-current" />
							{:else if atividade.prioridade === EnumPrioridadeAtividade.Media}
								<CircleDot class="text-warning-500 fill-current" />
							{:else if atividade.prioridade === EnumPrioridadeAtividade.Alta}
								<CircleDot class="text-error-500 fill-current" />
							{/if}
							{textoEnumPrioridadeAtividade[atividade.prioridade]}</span
						>
						<span>Duração Estimada: {atividade.duracaoEstimada} Horas</span>
						<span>Data Início: {DataFormatHandler.FormatDate(atividade.dataInicio)}</span>
						{#if atividade.dataEntrega}
							<span>Data Entrega: {DataFormatHandler.FormatDate(atividade.dataEntrega)}</span>
						{/if}
					</div>
				</div>
				{#if comentarios === null || comentarios.length < 1}
					<span class="preset-tonal m-2 p-2 italic opacity-70" in:fade={{ duration: 200 }}
						>Ainda não há comentários</span
					>
				{:else}
					<ul
						class="preset-tonal mb-3 grid h-1/2 gap-2 overflow-auto shadow-xl"
						in:fade={{ duration: 200 }}
					>
						{#each comentarios as comentario}
							<li
								class="rounded border p-2"
								in:fade={{ duration: 400 }}
								out:fade={{ duration: 100 }}
							>
								<div class="flex w-full gap-1">
									<a href="/usuario/{comentario.idUsuario}" class="anchor mr-auto"
										>{comentario.nomeUsuario}</a
									>
									<button
										class="btn preset-filled-primary-500"
										onclick={() => {
											AlterarComentario(comentario.id, comentario.comentario);
										}}><Pencil /> Alterar</button
									>
									<button
										class="btn preset-filled-error-500"
										onclick={() => {
											ExcluirComentario(comentario.id);
										}}><IconX /> Excluir</button
									>
								</div>
								<p>{comentario.comentario}</p>
							</li>
						{/each}
					</ul>
				{/if}
				<div class="my-10 flex gap-2">
					<FormInputComponent
						classe="col-span-3"
						label="Comentário"
						placeholder="comentário"
						tipo="text"
						bind:valor={txtComentario}
						erros={null}
						constraints={null}
					/>
					<button
						class="btn preset-filled-primary-500 mt-auto"
						onclick={() => {
							EnviarComentario();
						}}>{idComentarioSelecionado === 0 ? 'Enviar' : 'Alterar'}</button
					>
				</div>
			</div>
		{/if}
	{/snippet}
</ModalBase>
