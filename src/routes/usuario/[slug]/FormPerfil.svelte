<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import { setError, superForm } from 'sveltekit-superforms';
	import { _alterUserSchema } from './+page';
	import { zod } from 'sveltekit-superforms/adapters';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import { getContext } from 'svelte';
	import Toaster from '$lib/ToastHandler';

	const toast = new Toaster(getContext);

	let { getUsuario, openState = $bindable(), usuario, data } = $props();

	const { form, errors, message, constraints, enhance } = superForm(data.form, {
		SPA: true,
		validators: zod(_alterUserSchema),
		onUpdate({ form }) {
			if (!form.data.email.includes('@aedb.br')) {
				setError(form, 'email', 'Emails devem ter o dominio @aedb.br.');
			} else if (form.valid) {
				alteraUsuario(form.data.nome, form.data.email);
			}
		}
	});
	$form.nome = usuario.nome;
	$form.email = usuario.email;

	async function alteraUsuario(nome: string, email: string) {
		try {
			const response = await UsuarioRepository.AtualizarUsuario(usuario.id, nome, email);
			openState = false;
			toast.triggerSuccess('Usuário alterado com sucesso!');

			getUsuario(usuario.id);
		} catch (error) {
			openState = false;
			toast.triggerError('Ocorreu um erro ao tentar alterar usuário!');
			console.log(error);
		}
	}
</script>

<form
	novalidate
	method="POST"
	use:enhance
	class="card bg-surface-100-900 mx-auto space-y-5 p-1 md:w-1/2"
>
	<fieldset class="space-y-2">
		<h2 class="h2">Alterar Cadastro</h2>
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
	</fieldset>
	<fieldset>
		<button type="submit" class="btn preset-filled-primary-500 w-full">Alterar</button>
	</fieldset>
</form>
