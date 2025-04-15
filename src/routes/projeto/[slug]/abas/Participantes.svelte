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
	import { Ban, Plus } from 'lucide-svelte';
	import { getContext, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { storeLogin } from '../../../../stores';

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

	onMount(async () => {
		await getParticipantes();
	});
	const camposCabecalho = ['Nome', 'Função', 'Ações'];

	async function getParticipantes() {
		participantes = await UsuarioRepository.PegarTodosPorProjeto(projeto.id);

		if (usuarioLogado) {
			const usuarioLogadoDados = participantes.filter((p) => p.id === usuarioLogado?.id)[0];

			usuarioLogado.funcao = usuarioLogadoDados.funcao;
		}
	}

	let txtNovoParticipanteEmail = $state('');

	async function adicionarParticipante() {
		if (txtNovoParticipanteEmail.length < 1) {
			return;
		}
		try {
			const response = await ProjetoRepository.AdicionarUsuarioAoProjeto(
				projeto.id,
				txtNovoParticipanteEmail
			);
			toast.triggerSuccess('Usuário adicionado com sucesso!');
			await getParticipantes();
			txtNovoParticipanteEmail = '';
		} catch (error) {
			toast.triggerError('Ocorreu um erro ao tentar adicionar usuário ao projeto!');
			console.log(error);
		}
	}

	async function removerParticipante(idUsuario: number) {
		try {
			const response = await ProjetoRepository.RemoverUsuarioAoProjeto(projeto.id, idUsuario);
			toast.triggerSuccess('Usuário removido com sucesso!');
			await getParticipantes();
		} catch (error) {
			toast.triggerError('Ocorreu um erro ao tentar remover usuário ao projeto!');
			console.log(error);
		}
	}
</script>

<div class="m-2 flex gap-3 mt-10">
	<FormInputComponent
		label="Email"
		placeholder="email"
		tipo="text"
		bind:valor={txtNovoParticipanteEmail}
		erros={null}
		constraints={null}
	/>
	<button onclick={adicionarParticipante} class="btn preset-filled-success-500 mt-auto"
		><Plus />Adicionar</button
	>
</div>
{#snippet cabecalhoCursos()}
	<thead>
		<tr>
			{#each camposCabecalho as campo}
				<td>{campo}</td>
			{/each}
		</tr>
	</thead>
{/snippet}
{#if participantes}
	<TableBaseComponent
		{camposCabecalho}
		arrObjetosTamanho={participantes.length}
		labelObjeto="Participantes"
	>
		{#snippet cabecalho()}
			{@render cabecalhoCursos()}
		{/snippet}
		{#snippet corpo()}
			{#if participantes}
				{#each participantes as participante}
					<tr out:fade={{ duration: 400 }} in:fade={{ duration: 400 }}>
						<td>
							<a
								href={`/usuario/${participante.id}`}
								class="inline-flex w-min items-center gap-1 whitespace-nowrap"
							>
								<Avatar
									classes="select-none group-hover:brightness-50"
									size="size-10"
									src={participante.ExibeImagem()}
									name={participante.nome}
								/>
								<span class="anchor">
									{participante.nome}
								</span>
							</a>
						</td>
						<td>{participante.ExibeFuncao()}</td>
						<td>
							{#if usuarioLogado && usuarioLogado.funcao === EnumFuncaoUsuario.LiderProjeto && usuarioLogado.id !== participante.id}
								<button
									onclick={() => {
										removerParticipante(participante.id);
									}}
									class="btn preset-filled-error-500 flex"><Ban />Remover</button
								>
							{:else if usuarioLogado && usuarioLogado.id === participante.id && usuarioLogado.funcao !== EnumFuncaoUsuario.LiderProjeto}
								<button
									onclick={() => {
										removerParticipante(participante.id);
									}}
									class="btn preset-filled-error-500 flex"><Ban />Sair</button
								>
							{/if}
						</td>
					</tr>
				{/each}
			{/if}
		{/snippet}
	</TableBaseComponent>
{:else}
	<TableBaseComponent {camposCabecalho} arrObjetosTamanho={1} labelObjeto="Participantes">
		{#snippet cabecalho()}
			{@render cabecalhoCursos()}
		{/snippet}
		{#snippet corpo()}
			<tr class="">
				<td class="flex items-center gap-2">
					<div class="placeholder h-15 min-w-26 animate-pulse"></div>
					<div class="placeholder h-2 w-full animate-pulse"></div>
				</td>
				<td class="">
					<div class="placeholder animate-pulse"></div>
				</td>
				<td class="">
					<div class="placeholder animate-pulse"></div>
				</td>
				<td class="">
					<div class="placeholder animate-pulse"></div>
				</td>
			</tr>
		{/snippet}
	</TableBaseComponent>
{/if}
