<script lang="ts">
	import { Avatar, Modal } from '@skeletonlabs/skeleton-svelte';
	import { CircleUser, X as IconX, LogOut, Menu } from 'lucide-svelte';
	import LightSwitch from './LightSwitch.svelte';
	import PerfilHeader from './PerfilHeader.svelte';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import type LoggedUser from '$model/LoggedUser';

	let { logo, rota, links, usuarioLogado = $bindable() } = $props();

	let imagemDoUsuario: string = $derived(
		(usuarioLogado as LoggedUser | null)?.ExibeImagem?.() ?? ''
	);

	let drawerState = $state(false);

	function drawerClose() {
		drawerState = false;
	}
</script>

<!--
  Tips for Drawer modals:
  - Use `contentBase` to set styles, including height/width
  - Set justify-start to align to the left
  - Clear the align and padding styles
  - Use `positionerClasses` to set the
  - Set transition.x values that matches content width in pixels
  -->

<Modal
	open={drawerState}
	onOpenChange={(e) => (drawerState = e.open)}
	triggerBase="btn preset-tonal"
	contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-full h-screen"
	positionerJustify="justify-start"
	positionerAlign=""
	positionerPadding=""
	transitionsPositionerIn={{ x: -480, duration: 200 }}
	transitionsPositionerOut={{ x: -480, duration: 200 }}
>
	{#snippet trigger()}<Menu />{/snippet}
	{#snippet content()}
		<header class="flex justify-between">
			{@render logo()}
			<button
				type="button"
				class="btn hover:preset-tonal hover:text-error-500"
				onclick={drawerClose}><IconX /></button
			>
		</header>
		<article class="grid h-full grid-rows-[auto_1fr_auto]">
			<div class="my-3 grid gap-2">
				<hr />
				{#each links as { label, href }}
					{@render rota(label, href, drawerClose)}
				{/each}
			</div>

			<div class="grid items-center">
				<div class="preset-tonal grid gap-2 p-2">
					<LightSwitch />
					{#if usuarioLogado}
						<div class="flex gap-2">
							<Avatar
								size="size-8"
								classes="text-xs select-none"
								src={imagemDoUsuario}
								name={DataFormatHandler.FormatName(usuarioLogado.nome)}
							/>
							<span class="text-xl font-normal"
								>{DataFormatHandler.FormatName(usuarioLogado.nome)}</span
							>
						</div>
						<ul class="grid justify-items-start gap-2">
							<a
								href="/usuario/{usuarioLogado.id}"
								class="hover:text-primary-500 hover:bg-surface-50-950 w-full rounded p-2 hover:underline"
								onclick={drawerClose}
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
					{:else}
						<a href="/login" class="btn preset-filled-primary-500" onclick={drawerClose}>
							<CircleUser />
							Login
						</a>
					{/if}
				</div>
			</div>
		</article>
	{/snippet}
</Modal>
