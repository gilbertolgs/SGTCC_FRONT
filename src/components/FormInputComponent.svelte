<script lang="ts">
    let {label, placeholder, valor = $bindable(), erros, constraints, tipo} = $props();
</script>

<label class="label">
    <span class="label-text">{label}</span>
    <input
        bind:value={valor}
        class="input light:bg-surface-50 {erros ? 'preset-input-error' : ''}"
        type="{tipo}"
        placeholder="{placeholder}"
        autocomplete="off"
        required
        {...constraints}
    />
    {#if erros}<span class="text-error-400">{erros}</span>{/if}
</label>