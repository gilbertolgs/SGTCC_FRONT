<script lang="ts">
	import { page } from '$app/state';
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import Toaster from '$lib/ToastHandler';
	import type Usuario from '$model/Usuario';
	import AuthRepository from '$repository/AuthRepository';
	import { getContext, onMount } from 'svelte';

	const toast = new Toaster(getContext);

	const tokenAtivacao: string | null = $state(page.url.searchParams.get('token'));
	let usuario: Usuario | null = $state(null);

	let form = $state({
		senha: '',
		confirmarSenha: ''
	});
	let errors = $state({
		senha: '',
		confirmarSenha: ''
	});

	$effect(() => {
		validaCampos();
	});

	function validaCampos() {
		if (form.senha.trim() === '' && form.confirmarSenha.trim() === '') {
			errors.senha = 'Preencha todos os campos';
			errors.confirmarSenha = 'Preencha todos os campos';
		} else if (form.senha !== form.confirmarSenha) {
			errors.senha = '';
			errors.confirmarSenha = 'Senhas nao coincidem';
		} else {
			errors.confirmarSenha = '';
			errors.senha = '';
		}
	}

	onMount(async () => {
		if (tokenAtivacao) {
			usuario = await AuthRepository.AtivarConta(tokenAtivacao);
			console.log(usuario);
		}
	});

	async function RedefinirSenha() {
		try {
			if (tokenAtivacao == null || form.senha.trim() == '' || form.confirmarSenha.trim() == '') {
				throw new Error('Token nao encontrado');
			}
			const response = await AuthRepository.RedefinirSenha(tokenAtivacao, form.senha);
			if (!response) {
				toast.triggerError('ocorreu um erro ao tentar alterar a senha, tente novamente mais tarde');
			}
			console.log(response);
		} catch (error) {
			toast.triggerWarn('preencha todos os campos!');
			validaCampos();
		}
	}
</script>

{#if tokenAtivacao}
	<form
		novalidate
		class="card bg-surface-100-900 border-surface-200-800 mx-auto space-y-5 border p-5 shadow md:mt-5 md:w-1/2"
	>
		<fieldset class="space-y-2">
			<h2 class="h2">Redefinir Senha</h2>
		</fieldset>
		<fieldset class="space-y-2">
			<FormInputComponent
				label="Senha"
				placeholder="•••••••••••"
				tipo="password"
				bind:valor={form.senha}
				erros={errors.senha}
				constraints={null}
			/>
			<FormInputComponent
				label="Confirmar Senha"
				placeholder="•••••••••••"
				tipo="password"
				bind:valor={form.confirmarSenha}
				erros={errors.confirmarSenha}
				constraints={null}
			/>
		</fieldset>
		<fieldset>
			<button onclick={RedefinirSenha} type="button" class="btn preset-filled-primary-500 w-full"
				>Enviar</button
			>
		</fieldset>
	</form>
{:else}
	<p>This is not beta.</p>
{/if}
