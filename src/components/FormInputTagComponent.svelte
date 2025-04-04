<script lang="ts">
	import { TagsInput } from '@skeletonlabs/skeleton-svelte';

	let { label, placeholder, valor = $bindable(), erros, constraints } = $props();

	$effect(() => {
		if (erros) {
			for (let i = 0; i < erros.length; i++) {
				const erro = erros[i];

				console.log(erro);
			}
		}
	});
</script>

<label class="label">
	<span class="label-text">{label}</span>
	<TagsInput
		value={valor}
		onValueChange={(e) => (valor = e.value)}
		class="input light:bg-surface-50 {erros ? 'preset-input-error' : ''}"
		{placeholder}
		autocomplete="off"
		tagBackground="preset-filled-primary-500"
		required
		{...constraints}
	/>
	{#if erros}
		{#each erros['_errors'] as erro}
			<span class="text-error-400">{erro}</span>
		{/each}
	{/if}
</label>
