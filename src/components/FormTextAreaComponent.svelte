<script lang="ts">
    let {label, placeholder, valor = $bindable(), erros, constraints, tipo} = $props();
</script>

<label class="label">
    <span class="label-text">{label}</span>
    <textarea
        bind:value={valor}
        class="resize-none input light:bg-surface-50 {erros ? 'preset-input-error' : ''}"
        placeholder="{placeholder}"
        autocomplete="off"
        required
        {...constraints}
    ></textarea>
    {#if erros}<span class="text-error-400">{erros}</span>{/if}
</label>