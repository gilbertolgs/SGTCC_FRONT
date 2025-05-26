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

	function RealizarLogin(email: string, senha: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			if (email === '' || senha === '') {
				toast.triggerWarn('Complete os campos para realizar o login');
				return reject(new Error('Campos vazios'));
			}
			try {
				await LoginHandler.FazerLogin(email, senha);
				toast.triggerSuccess('Login realizado com sucesso!');
				goto('/biblioteca');
				resolve();
			} catch (error) {
				toast.triggerError('Ocorreu um erro ao tentar realizar o login!');
				reject(error);
			}
		});
	}

	let { data } = $props();

	const { form, errors, message, constraints, enhance } = superForm(data.form, {
		SPA: true,
		validators: zod(_userSchema),
		onUpdate({ form }) {
			if (!form.data.email.includes('@aedb.br')) {
				setError(form, 'email', 'Emails devem ter o dominio @aedb.br.');
			} else if (form.valid) {
				loginPromise = RealizarLogin(form.data.email, form.data.senha);
			}
		}
	});

	let loginPromise: Promise<void> | null = $state(null);
</script>

<svelte:head>
	<title>{pageName} - Login</title>
	<meta name="Realizar Login" content="Pagina para realização de login" />
</svelte:head>

<FormLogin {loginPromise} {errors} {form} {constraints} {message} {enhance} />
