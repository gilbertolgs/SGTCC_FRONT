<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';

	import { X as IconX } from 'lucide-svelte';

	let { conteudo, openState = $bindable(), classe = null } = $props();

	function drawerClose() {
		openState = false;
	}
</script>

<Modal
	open={openState}
	onEscapeKeyDown={drawerClose}
	onFocusOutside={drawerClose}
	onInteractOutside={drawerClose}
	onOpenChange={(e) => (openState = e.open)}
	contentBase={classe ?? 'bg-surface-100-900 p-4 space-y-4 shadow-xl w-[480px] h-screen'}
	positionerJustify="justify-end"
	positionerAlign=""
	positionerPadding=""
	transitionsPositionerIn={{ x: 480, duration: 200 }}
	transitionsPositionerOut={{ x: 480, duration: 200 }}
>
	{#snippet content()}
		<div class="flex flex-col">
			<button class="hover:text-error-500 ml-auto m-1" onclick={drawerClose}>
				<IconX />
			</button>
			{@render conteudo()}
		</div>
	{/snippet}
</Modal>
