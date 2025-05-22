<script lang="ts">
	import { Check, XIcon } from 'lucide-svelte/icons';
	import { getContext, onMount } from 'svelte';

	import Toaster from '$lib/ToastHandler';
	import type Convite from '$model/Convite';
	import { EnumConvite } from '$model/EnumConvite';
	import type LoggedUser from '$model/LoggedUser';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import { pageName, storeLogin } from '../../stores';

	const toast = new Toaster(getContext);

	let { data } = $props();
	let usuarioLogado: LoggedUser | null = $state<LoggedUser | null>(null);
	storeLogin.subscribe((value) => {
		usuarioLogado = value;
	});

	let convites: Convite[] | null = $state(null);

	async function getConvites() {
		if (usuarioLogado && usuarioLogado.id) {
			convites = await UsuarioRepository.PegarTodosConvites(usuarioLogado?.id);
		}
	}
	onMount(async () => {
		await getConvites();
	});

	async function responderConvite(id: number, resposta: EnumConvite) {
		if (!usuarioLogado) {
			return;
		}
		try {
			await UsuarioRepository.ResponderConvite(id, resposta);
			if (resposta === EnumConvite.Aceito) {
				toast.triggerSuccess('Convite aceito com sucesso!');
			} else {
				toast.triggerSuccess('Convite rejeitado com sucesso!');
			}
		} catch (error) {
			toast.triggerError('Erro ao responder convite');
		}
		getConvites();
	}
</script>

<svelte:head>
	<title>{pageName} - Convites</title>
	<meta name="Página de Convites" content="Exibindo convites" />
</svelte:head>

{#if convites}
	<div class="preset-tonal mx-auto mt-2 grid p-3 md:w-1/2">
		<h3 class="h3">Convites Pendentes</h3>
		{#each convites as convite}
			<div class="preset-tonal m-3 flex justify-between gap-2 rounded p-2">
				<span class="my-auto font-bold">{convite.nomeProjeto}</span>
				<div class="flex gap-2">
					{#if usuarioLogado}
						<button
							onclick={() => {
								responderConvite(convite.id, EnumConvite.Aceito);
							}}
							class="btn preset-filled-success-500 flex"><Check />Aceitar</button
						>
						<button
							onclick={() => {
								responderConvite(convite.id, EnumConvite.Rejeitado);
							}}
							class="btn preset-filled-error-500 flex"><XIcon />Cancelar</button
						>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}
