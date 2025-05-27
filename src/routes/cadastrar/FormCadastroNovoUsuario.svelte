<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import { setError, superForm } from 'sveltekit-superforms';
	import { _registerUserSchema } from './+page';
	import { zod } from 'sveltekit-superforms/adapters';
	import CursoRepository from '$repository/CursoRepository';
	import Curso from '$model/Curso';
	import FormSelectComponent from '$components/FormSelectComponent.svelte';
	import { getContext, onMount } from 'svelte';
	import Usuario from '$model/Usuario';
	import { EnumPapel } from '$model/EnumPapel';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import Toaster from '$lib/ToastHandler';
	import { goto } from '$app/navigation';

	const toast = new Toaster(getContext);

	let { data } = $props();
	let cursos: Curso[] | null = $state(null);

	onMount(async () => {
		cursos = await CursoRepository.PegarTodos();
	});

	const { form, errors, message, constraints, enhance } = superForm(data.form, {
		SPA: true,
		validators: zod(_registerUserSchema),
		onUpdate({ form }) {
			if (form.valid) {
				RealizarCadastro(form.data.nome, form.data.email, form.data.curso, form.data.senha);
			}
		}
	});

	async function RealizarCadastro(nome: string, email: string, curso: number, senha: string) {
		try {
			const response = await UsuarioRepository.CriarUsuario(
				curso,
				nome,
				email,
				senha,
				EnumPapel.Aluno
			);
			toast.triggerSuccess('Usuário cadastrado com sucesso!');
			goto('/login');
		} catch (error) {
			toast.triggerError('Ocorreu um erro ao tentar cadastrar usuário!');
			console.log(error);
		}
	}
</script>

<form
	novalidate
	method="POST"
	use:enhance
	class="card bg-surface-100-900 border-surface-200-800 mx-auto space-y-5 border p-5 shadow md:mt-5 md:w-1/2"
>
	<fieldset class="space-y-2">
		<h2 class="h2">Cadastro</h2>
	</fieldset>
	<fieldset class="space-y-2">
		<FormInputComponent
			label="Nome"
			placeholder="nome"
			tipo="text"
			bind:valor={$form.nome}
			erros={$errors.nome}
			constraints={$constraints.nome}
		/>
		<FormInputComponent
			label="Email"
			placeholder="email@aedb.br"
			tipo="text"
			bind:valor={$form.email}
			erros={$errors.email}
			constraints={$constraints.email}
		/>
		{#if cursos}
			<FormSelectComponent
				label="Curso"
				placeholder="curso"
				bind:valor={$form.curso}
				erros={$errors.curso}
				constraints={$constraints.curso}
			>
				{#snippet opcoes()}
					{#if cursos}
						{#each cursos as curso}
							<option value={curso.id}>{curso.nome}</option>
						{/each}
					{/if}
				{/snippet}
			</FormSelectComponent>
		{/if}
		<FormInputComponent
			label="Senha"
			placeholder="•••••••••••"
			tipo="password"
			bind:valor={$form.senha}
			erros={$errors.senha}
			constraints={$constraints.senha}
		/>
		<FormInputComponent
			label="Confirmar Senha"
			placeholder="•••••••••••"
			tipo="password"
			bind:valor={$form.confirmarSenha}
			erros={$errors.confirmarSenha}
			constraints={$constraints.confirmarSenha}
		/>
	</fieldset>
	termos e condicoes
	<fieldset>
		<button type="submit" class="btn preset-filled-primary-500 w-full">Cadastrar</button>
	</fieldset>
	<hr class="hr" />
	<p class="text-center text-sm">
		Já tem uma conta? <a href="/login" class="anchor font-bold">Login</a>
	</p>
</form>
