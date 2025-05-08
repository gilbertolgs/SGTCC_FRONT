<script lang="ts">
	import type LoggedUser from '$model/LoggedUser';
	import Usuario from '$model/Usuario';
	import { Avatar, Popover } from '@skeletonlabs/skeleton-svelte';
	import { ChevronsUpDown, CircleUser, X as IconX, LogOut } from 'lucide-svelte';

	let openState = $state(false);

	function popoverClose() {
		openState = false;
	}

	interface Props {
		usuarioLogado: LoggedUser | null;
		imagemDoUsuario: string | undefined;
	}

	let { usuarioLogado, imagemDoUsuario }: Props = $props();
</script>

{#snippet nomeUsuario(usuario: LoggedUser | Usuario)}
	<Avatar size="size-8" classes="text-xs select-none" src={imagemDoUsuario} name={usuario.nome} />
	<span class="text-xl font-normal">{usuario.nome}</span>
{/snippet}

{#if usuarioLogado == null}
	<a href="/login" class="btn preset-filled-primary-500">
		<CircleUser />
		Login
	</a>
{:else}
	<Popover
		open={openState}
		onOpenChange={(e) => (openState = e.open)}
		positioning={{ placement: 'top' }}
		triggerBase="btn preset-tonal py-2"
		contentBase="card bg-surface-200-800 p-4 space-y-4 max-w-[320px] mt-5"
	>
		{#snippet trigger()}
			{@render nomeUsuario(usuarioLogado)}
			<ChevronsUpDown />
		{/snippet}
		{#snippet content()}
			<div class="flex items-center justify-between gap-1">
				{@render nomeUsuario(usuarioLogado)}
				<button class="btn-icon hover:preset-tonal" onclick={popoverClose}><IconX /></button>
			</div>
			<ul class="grid justify-items-start gap-2">
				<a
					href="/usuario/{usuarioLogado.id}"
					class="hover:text-primary-500 hover:bg-surface-50-950 w-full rounded p-2 hover:underline"
				>
					<li class="ml-0 flex gap-2">
						<CircleUser />
						Perfil
					</li>
				</a>
				<a
					href="/logout"
					class="hover:text-error-500 hover:bg-surface-50-950 w-full rounded p-2 hover:underline"
				>
					<li class="ml-0 flex gap-2">
						<LogOut />
						Log out
					</li>
				</a>
			</ul>
		{/snippet}
	</Popover>
{/if}
