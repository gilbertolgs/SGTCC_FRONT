<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';

	import { X as IconX, Pencil } from 'lucide-svelte';
	import FormPerfil from './FormPerfil.svelte';

	let { getUsuario, usuario, data } = $props();

	let openState = $state(false);

	function modalClose() {
		openState = false;
	}
</script>

<Modal
	open={openState}
	onOpenChange={(e) => (openState = e.open)}
	triggerBase="btn hover:text-primary-500"
	contentBase="card grid bg-surface-100-900 p-4 shadow-xl w-full md:w-1/2"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet trigger()}<Pencil />{/snippet}
	{#snippet content()}
		<button class="btn hover:text-error-500 ml-auto" onclick={modalClose}>
			<IconX />
		</button>
		<!-- <FormPerfil  {usuario} {errors} {form} {constraints} {message} {enhance} /> -->
		<FormPerfil bind:openState {getUsuario} {usuario} {data} />
	{/snippet}
</Modal>
