<script lang="ts">
	import { pageName } from '../../stores';
	import { superForm, setMessage, setError } from 'sveltekit-superforms';
	import { _userSchema } from './+page.js';
	import { zod } from 'sveltekit-superforms/adapters';

	import FormLogin from './FormLogin.svelte';
	import Toaster from '$lib/ToastHandler';
	import LoginHandler from '$lib/LoginHandler';
	import { goto } from '$app/navigation';
	import { getContext } from 'svelte';
	const toast = new Toaster(getContext);

	async function RealizarLogin(email: string, senha: string) {
		if (email == '' || senha == '') {
			toast.triggerWarn('Complete os campos para realizar o login');
			return;
		}

		try {
			const usuarioLogado = await LoginHandler.FazerLogin(email, senha);
			toast.triggerSuccess('Login realizado com sucesso!');
			goto('/biblioteca');
		} catch (error) {
			toast.triggerError('Ocorreu um erro ao tentar realizar o login!');
		}
	}

	let { data } = $props();

	const { form, errors, message, constraints, enhance } = superForm(data.form, {
		SPA: true,
		validators: zod(_userSchema),
		onUpdate({ form }) {
			if (!form.data.email.includes('@aedb.br')) {
				setError(form, 'email', 'Emails devem ter o dominio @aedb.br.');
			} else if (form.valid) {
				RealizarLogin(form.data.email, form.data.senha);
				// setMessage(form, 'Valid data!');
			}
		}
	});	
</script>

<svelte:head>
	<title>{pageName} - Login</title>
	<meta name="Realizar Login" content="Pagina para realização de login" />
</svelte:head>

<FormLogin {errors} {form} {constraints} {message} {enhance} />
