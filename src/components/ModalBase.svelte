<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';

	import { X as IconX } from 'lucide-svelte';

	let { conteudo, openState = $bindable(), classe = null } = $props();

	function modalClose() {
		openState = false;
	}
</script>

<Modal
	open={openState}
	onEscapeKeyDown={modalClose}
	onFocusOutside={modalClose}
	onInteractOutside={modalClose}
	triggerBase="btn preset-filled-primary-500"
	contentBase={classe ?? "card grid bg-surface-100-900 p-4 shadow-xl w-full md:w-1/2"}
	backdropClasses="backdrop-blur-sm brightness-50"
>
	{#snippet content()}
		<button class="btn hover:text-error-500 ml-auto" onclick={modalClose}>
			<IconX />
		</button>
		{@render conteudo()}
	{/snippet}
</Modal>
