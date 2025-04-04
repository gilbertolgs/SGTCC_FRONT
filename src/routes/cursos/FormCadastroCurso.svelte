<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import { setError, superForm } from 'sveltekit-superforms';
	import { _registerCourseSchema } from './+page';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getContext, onMount } from 'svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import FormTextAreaComponent from '$components/FormTextAreaComponent.svelte';

	const toast = new Toaster(getContext);

	let { RealizarCadastro, openState = $bindable(), curso = $bindable(), data } = $props();

	const { form, errors, message, constraints, enhance } = superForm(data.form, {
		SPA: true,
		validators: zod(_registerCourseSchema),
		onUpdate({ form }) {
			if (form.valid) {
				RealizarCadastro(form.data.nome, form.data.descricao, form.data.id);
			}
		}
	});

	$effect(() => {
		if (curso) {
			$form.id = curso.id;
			$form.nome = curso.nome;
			$form.descricao = curso.descricao;
		} else {
			$form.id = 0;
			$form.nome = '';
			$form.descricao = '';
		}
	});
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
				<FormInputComponent
					label="Nome"
					placeholder="nome"
					tipo="text"
					bind:valor={$form.nome}
					erros={$errors.nome}
					constraints={$constraints.nome}
				/>
				<FormTextAreaComponent
					label="Descrição"
					placeholder="descrição"
					tipo="text"
					bind:valor={$form.descricao}
					erros={$errors.descricao}
					constraints={$constraints.descricao}
				/>
			</fieldset>
			<fieldset>
				<button type="submit" class="btn preset-filled-primary-500 w-full">
					{#if $form.id == 0}
						Cadastrar
					{:else}
						Alterar
					{/if}
				</button>
			</fieldset>
		</form>
	{/snippet}
</ModalBase>
