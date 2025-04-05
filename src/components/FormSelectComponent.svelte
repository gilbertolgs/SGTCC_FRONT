<script lang="ts">
	let {
		classe = null,
		label,
		placeholder,
		valor = $bindable(),
		erros,
		constraints,
		opcoes
	} = $props();
</script>

<label class="label {classe}">
	<span class="label-text">{label}</span>
	<select
		bind:value={valor}
		class="select light:bg-surface-50 {erros ? 'preset-input-error' : ''}"
		{placeholder}
		autocomplete="off"
		required
		{...constraints}
	>
		{@render opcoes()}
	</select>
	{#if erros}<span class="text-error-400">{erros}</span>{/if}
</label>
