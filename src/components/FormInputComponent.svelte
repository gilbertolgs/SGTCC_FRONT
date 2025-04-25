<script lang="ts">
	let {
		classe = null,
		label,
		placeholder,
		valor = $bindable(),
		erros,
		constraints,
		tipo,
		min = null,
		changeEvent = null
	} = $props();
</script>

<label class="label {classe}">
	<span class="label-text">{label}</span>
	<input
		bind:value={valor}
		class="input light:bg-surface-50 {erros ? 'preset-input-error' : ''}"
		type={tipo}
		{placeholder}
		autocomplete="off"
		required
		{...constraints}
		{min}
		onchange={changeEvent}
	/>
	{#if erros}<span class="text-error-400">{erros}</span>{/if}
</label>
