<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import FormSelectComponent from '$components/FormSelectComponent.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import { EnumPapelTodosPapeis } from '$model/EnumPapel';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { _registerUserSchema } from './+page';

	let { RealizarCadastro, openState = $bindable(), usuario, cursos, data } = $props();

	const { form, errors, message, constraints, enhance } = superForm(data.form, {
		SPA: true,
		validators: zod(_registerUserSchema),
		onUpdate({ form }) {
			if (form.valid) {
				RealizarCadastro(
					form.data.nome,
					form.data.email,
					form.data.curso,
					form.data.senha,
					form.data.papel
				);
			}
		}
	});

	let papeis = $state(EnumPapelTodosPapeis);

	if (usuario) {
		$form.nome = usuario.nome;
		$form.email = usuario.email;
		$form.curso = usuario.curso;
		$form.senha = usuario.senha;
		$form.papel = usuario.papel;
	}
</script>

<ModalBase bind:openState>
	{#snippet conteudo()}
		<form
			novalidate
			method="POST"
			use:enhance
			class="card bg-surface-100-900 mx-auto space-y-5 p-1 md:w-1/2"
		>
			<fieldset class="space-y-2">
				<h2 class="h2">Cadastro</h2>
			</fieldset>
			<fieldset class="space-y-2">
				<FormSelectComponent
					label="Papel"
					placeholder="papel"
					bind:valor={$form.papel}
					erros={$errors.papel}
					constraints={$constraints.papel}
				>
					{#snippet opcoes()}
						{#each papeis as papel}
							<option value={papel.valor}>{papel.label}</option>
						{/each}
					{/snippet}
				</FormSelectComponent>
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
							{#each cursos as curso}
								<option value={curso.id}>{curso.nome}</option>
							{/each}
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
			<fieldset>
				<button type="submit" class="btn preset-filled-primary-500 w-full">Cadastrar</button>
			</fieldset>
		</form>
	{/snippet}
</ModalBase>
