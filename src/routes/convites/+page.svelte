<script lang="ts">
	import { Check, LoaderCircle, XIcon } from 'lucide-svelte/icons';
	import { getContext, onMount } from 'svelte';

	import Toaster from '$lib/ToastHandler';
	import type Convite from '$model/Convite';
	import { EnumConvite } from '$model/EnumConvite';
	import type LoggedUser from '$model/LoggedUser';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import { pageName, storeLogin } from '../../stores';

	const toast = new Toaster(getContext);

	let { data } = $props();
	let usuarioLogado = $derived($storeLogin);

	let convites: Convite[] | null = $state(null);

	async function getConvites() {
		if (usuarioLogado && usuarioLogado.id) {
			convites = await UsuarioRepository.PegarTodosConvites(usuarioLogado?.id);
		}
	}
	onMount(async () => {
		await getConvites();
	});

	let promiseRejeitaConvite: Promise<void> | null = $state(null);
	let promiseAceitaConvite: Promise<void> | null = $state(null);
	async function responderConvite(id: number, resposta: EnumConvite) {
		if (!usuarioLogado) {
			return;
		}
		try {
			const response = UsuarioRepository.ResponderConvite(id, resposta);
			promiseAceitaConvite = response;
			promiseRejeitaConvite = response;
			if (resposta === EnumConvite.Aceito) {
				promiseRejeitaConvite = null;
				await promiseAceitaConvite;
				toast.triggerSuccess('Convite aceito com sucesso!');
			} else {
				promiseAceitaConvite = null;
				await promiseRejeitaConvite;
				toast.triggerSuccess('Convite rejeitado com sucesso!');
			}
		} catch (error) {
			toast.triggerError('Erro ao responder convite');
			promiseRejeitaConvite = null;
			promiseAceitaConvite = null;
		}
		getConvites();
	}
</script>

<svelte:head>
	<title>{pageName} - Convites</title>
	<meta name="Página de Convites" content="Exibindo convites" />
</svelte:head>

{#if convites?.length}
	<div class="mx-auto mt-6 space-y-4 md:w-1/2">
		<h3 class="text-lg font-semibold">Convites Pendentes</h3>

		{#each convites as convite (convite.id)}
			<div class="preset-tonal rounded p-4 shadow-sm transition-all hover:shadow-md">
				<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p class="text-base font-medium">{convite.nomeProjeto}</p>
						<p class="text-muted-foreground text-sm">
							Você foi convidado para participar deste projeto.
						</p>
					</div>

					{#if usuarioLogado}
						<div class="flex gap-2">
							{#await promiseAceitaConvite}
								<button class="btn preset-filled-success-500 flex items-center gap-1" disabled>
									<LoaderCircle class="animate-spin" />
									Aceitando...
								</button>
							{:then}
								<button
									class="btn preset-filled-success-500 flex items-center gap-1"
									onclick={() => responderConvite(convite.id, EnumConvite.Aceito)}
								>
									<Check class="h-4 w-4" /> Aceitar
								</button>
							{/await}
							{#await promiseRejeitaConvite}
								<button class="btn preset-filled-error-500 flex items-center gap-1" disabled>
									<LoaderCircle class="animate-spin" />
									Rejeitando...
								</button>
							{:then}
								<button
									class="btn preset-filled-error-500 flex items-center gap-1"
									onclick={() => responderConvite(convite.id, EnumConvite.Rejeitado)}
								>
									<XIcon class="h-4 w-4" /> Rejeitar
								</button>
							{/await}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div
		class="preset-tonal text-muted-foreground mx-auto mt-6 rounded p-6 text-center shadow-sm md:w-1/2"
	>
		<p>Você não tem convites pendentes no momento.</p>
	</div>
{/if}
