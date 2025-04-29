<script lang="ts">
	import { page } from '$app/state';
	import type Usuario from '$model/Usuario';
	import AuthRepository from '$repository/AuthRepository';
	import { onMount } from 'svelte';

	const tokenAtivacao: string | null = $state(page.url.searchParams.get('ativarConta'));
	let usuario: Usuario | null = $state(null);

	onMount(async () => {
		if (tokenAtivacao) {
			usuario = await AuthRepository.AtivarConta(tokenAtivacao);
			console.log(usuario);
		}
	});
</script>

{#if tokenAtivacao}
	{#if usuario}
		<span>Bem vindo {usuario.nome}</span>
	{/if}
{:else}
	<p>This is not beta.</p>
{/if}
