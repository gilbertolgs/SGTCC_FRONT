<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import TableBaseComponent from '$components/TableBaseComponent.svelte';
	import Toaster from '$lib/ToastHandler';
	import { EnumFuncaoUsuario } from '$model/EnumFuncaoUsuario';
	import type LoggedUser from '$model/LoggedUser';
	import type Projeto from '$model/Projeto';
	import type Usuario from '$model/Usuario';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { Ban, LoaderCircle, Plus } from 'lucide-svelte';
	import { getContext, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { storeLogin } from '../../../../stores';
	import { EnumConvite } from '$model/EnumConvite';
	import { goto } from '$app/navigation';

	const toast = new Toaster(getContext);

	let usuarioLogado: LoggedUser | null = $state<LoggedUser | null>(null);

	storeLogin.subscribe((value) => {
		usuarioLogado = value;
	});

	interface Props {
		projeto: Projeto;
	}
	let { projeto }: Props = $props();
	let participantes: Usuario[] | null = $state(null);
	let participantesPendentes: Usuario[] | null = $state(null);

	onMount(async () => {
		await getParticipantes();
	});
	const camposCabecalho = ['Nome', 'Função', 'Ações'];

	async function getParticipantes() {
		const participantesGerais = await UsuarioRepository.PegarTodosPorProjeto(projeto.id);
		console.log(participantesGerais);
		participantes = participantesGerais.filter((p) => p.estado == EnumConvite.Aceito);
		participantesPendentes = participantesGerais.filter((p) => p.estado == EnumConvite.Pendente);

		if (usuarioLogado) {
			const usuarioLogadoDados = participantes.filter((p) => p.id === usuarioLogado?.id)[0];

			usuarioLogado.funcao = usuarioLogadoDados.funcao;
		}
	}

	let txtNovoParticipanteEmail = $state('');

	let promiseEnvioConvite: Promise<void> | null = $state(null);

	async function adicionarParticipante() {
		if (txtNovoParticipanteEmail.length < 1) {
			return;
		}
		try {
			const response = ProjetoRepository.AdicionarUsuarioAoProjeto(
				projeto.id,
				txtNovoParticipanteEmail
			);
			promiseEnvioConvite = response;

			await response;
			toast.triggerSuccess('Usuário adicionado com sucesso!');
			txtNovoParticipanteEmail = '';
			await getParticipantes();
		} catch (error) {
			toast.triggerError('Ocorreu um erro ao tentar adicionar usuário ao projeto!');
			promiseEnvioConvite = null;
		}
	}

	async function removerParticipante(idUsuario: number) {
		try {
			const response = await ProjetoRepository.RemoverUsuarioDoProjeto(projeto.id, idUsuario);
			toast.triggerSuccess('Usuário removido com sucesso!');
			if (usuarioLogado && usuarioLogado.id === idUsuario) {
				goto('/');
				return;
			}
			await getParticipantes();
		} catch (error) {
			toast.triggerError('Ocorreu um erro ao tentar remover usuário ao projeto!');
			console.log(error);
		}
	}
</script>

<div class="m-2 mt-10 flex gap-3">
	<FormInputComponent
		label="Email"
		placeholder="email"
		tipo="text"
		bind:valor={txtNovoParticipanteEmail}
		erros={null}
		constraints={null}
	/>
	{#await promiseEnvioConvite}
		<button disabled class="btn preset-filled-success-500 mt-auto"
			><LoaderCircle class="animate-spin" />Convidando...</button
		>
	{:then}
		<button onclick={adicionarParticipante} class="btn preset-filled-success-500 mt-auto"
			><Plus />Adicionar</button
		>
	{/await}
</div>
{#if participantes?.length}
	<div class="space-y-4">
		{#each participantes as participante (participante.id)}
			<div class="preset-tonal rounded p-4 shadow-md transition-all hover:shadow-lg">
				<div class="flex items-center justify-between">
					<a href={`/usuario/${participante.id}`} class="anchor flex items-center gap-3 truncate">
						<Avatar
							classes="select-none group-hover:brightness-50 no-underline text-white"
							size="size-10"
							src={participante.ExibeImagem()}
							name={participante.nome}
						/>
						<span class="text-lg font-semibold">{participante.nome}</span>
					</a>

					{#if usuarioLogado}
						{#if usuarioLogado.funcao === EnumFuncaoUsuario.LiderProjeto && usuarioLogado.id !== participante.id}
							<button
								class="btn preset-filled-error-500 flex gap-1"
								onclick={() => removerParticipante(participante.id)}
							>
								<Ban class="h-4 w-4" /> Remover
							</button>
						{:else if usuarioLogado.id === participante.id && usuarioLogado.funcao !== EnumFuncaoUsuario.LiderProjeto}
							<button
								class="btn preset-filled-error-500 flex gap-1"
								onclick={() => removerParticipante(participante.id)}
							>
								<Ban class="h-4 w-4" /> Sair
							</button>
						{/if}
					{/if}
				</div>

				<p class="text-muted-foreground mt-2 text-sm">{participante.ExibeFuncao()}</p>
			</div>
		{/each}
	</div>
{:else}
	<!-- Skeleton loading state -->
	<div class="space-y-4">
		{#each Array(3) as _, i}
			<div class="preset-tonal animate-pulse rounded p-4 shadow-md">
				<div class="flex items-center gap-4">
					<div class="placeholder h-10 w-10 rounded-full bg-gray-300"></div>
					<div class="flex-1 space-y-2">
						<div class="h-4 w-1/2 rounded bg-gray-300"></div>
						<div class="h-3 w-1/3 rounded bg-gray-300"></div>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}

{#if participantesPendentes?.length}
	<div class="mt-6 space-y-4">
		<h3 class="text-lg font-semibold">Pendentes</h3>

		{#each participantesPendentes as participante (participante.id)}
			<div class="preset-tonal rounded p-3 shadow-sm">
				<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p class="font-medium">{participante.nome}</p>
						<p class="text-muted-foreground text-sm">{participante.email}</p>
					</div>

					{#if usuarioLogado?.funcao === EnumFuncaoUsuario.LiderProjeto && usuarioLogado.id !== participante.id}
						<button
							class="btn preset-filled-error-500 flex gap-1 self-start sm:self-auto"
							onclick={() => removerParticipante(participante.id)}
						>
							<Ban class="h-4 w-4" /> Cancelar
						</button>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}
