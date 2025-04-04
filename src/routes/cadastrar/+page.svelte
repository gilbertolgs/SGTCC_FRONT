<script lang="ts">
	import FormCadastro from './FormCadastroNovoUsuario.svelte';

	let { data } = $props();
</script>

<FormCadastro {data} />
