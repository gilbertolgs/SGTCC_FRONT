<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { Menu, X as IconX } from 'lucide-svelte';
	import LightSwitch from './LightSwitch.svelte';
	import PerfilHeader from './PerfilHeader.svelte';

	let { logo, rota, links, usuarioLogado = $bindable() } = $props();

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
					{@render rota(label, href)}
				{/each}
			</div>

			<div class="grid items-center">
				<div class="grid gap-2">
					<LightSwitch />
					<PerfilHeader {usuarioLogado} />
				</div>
			</div>
		</article>
	{/snippet}
</Modal>
