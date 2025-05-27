<script lang="ts">
	import { page } from '$app/state';
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import Toaster from '$lib/ToastHandler';
	import type Usuario from '$model/Usuario';
	import AuthRepository from '$repository/AuthRepository';
	import { LoaderCircle } from 'lucide-svelte';
	import { getContext, onMount } from 'svelte';

	const toast = new Toaster(getContext);

	const tokenAtivacao: string | null = $state(page.url.searchParams.get('token'));
	let usuario: Usuario | null = $state(null);

	let form = $state({
		email: ''
	});
	let errors = $state({
		email: ''
	});

	function validaCampos() {
		if (form.email.trim() === '') {
			errors.email = 'Preencha o Email';
		}
	}

	onMount(async () => {});

	async function EnviarEmail() {
		return new Promise<void>(async (resolve, reject) => {
			try {
				if (form.email.trim() == '') {
					throw new Error('Email não encontrado');
				}
				const response = await AuthRepository.PedirRedefinicaoDeSenha(form.email);
				if (!response) {
					toast.triggerError('Email não encontrado');
				}
				console.log(response);
				toast.triggerSuccess('Email Enviado!');
				resolve();
			} catch (error) {
				toast.triggerWarn('preencha todos os campos!');
				validaCampos();
				reject();
			}
		});
	}

	let envioPromise: Promise<void> | null = $state(null);
	function envia(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		envioPromise = EnviarEmail();
	}
</script>

<form
	novalidate
	class="card bg-surface-100-900 border-surface-200-800 mx-auto space-y-5 border p-5 shadow md:mt-5 md:w-1/2"
>
	<fieldset class="space-y-2">
		<h2 class="h2">Redefinir Senha</h2>
	</fieldset>
	<fieldset class="space-y-2">
		<FormInputComponent
			label="Email"
			placeholder="email@aedb.br"
			tipo="text"
			bind:valor={form.email}
			erros={errors.email}
			constraints={null}
		/>
	</fieldset>
	<fieldset>
		<button onclick={envia} type="button" class="btn preset-filled-primary-500 w-full">
			{#await envioPromise}
				<LoaderCircle class="animate-spin" />
				<span class="inline-flex items-center justify-center">
					<span class="loader mr-2"></span> Enviando...
				</span>
			{:then}
				Enviar
			{:catch}
				Enviar
			{/await}
		</button>
	</fieldset>
</form>
