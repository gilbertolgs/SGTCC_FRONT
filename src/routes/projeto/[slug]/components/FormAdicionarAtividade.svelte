<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import FormInputTagComponent from '$components/FormInputTagComponent.svelte';
	import FormTextAreaComponent from '$components/FormTextAreaComponent.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import { getContext } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { _addActivitySchema } from '../+page';

	const toast = new Toaster(getContext);

	let { AdicionarAtividade, openState = $bindable(), atividade, data } = $props();

	const { form, errors, message, constraints, enhance } = superForm(data.activityForm, {
		SPA: true,
		validators: zod(_addActivitySchema),
		onUpdate({ form }) {
			if (form.valid) {
				AdicionarAtividade(form.data.id, form.data.nome, form.data.descricao);
			}
		}
	});
	$effect(() => {
		if (atividade) {
			$form.id = atividade.id;
			$form.nome = atividade.nome.trim();
			$form.descricao = atividade.descricao.trim();
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
				<h2 class="h2">Adicionar</h2>
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
				<button type="submit" class="btn preset-filled-primary-500 w-full"> Cadastrar </button>
			</fieldset>
		</form>
	{/snippet}
</ModalBase>
