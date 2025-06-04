<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import FormInputTagComponent from '$components/FormInputTagComponent.svelte';
	import FormTextAreaComponent from '$components/FormTextAreaComponent.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import { getContext } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { _alterProjectSchema } from '../+page';

	const toast = new Toaster(getContext);

	let { AlterarCadastro, openState = $bindable(), projeto, data } = $props();

	const { form, errors, message, constraints, enhance } = superForm(data.alterProjectForm, {
		SPA: true,
		validators: zod(_alterProjectSchema),
		onUpdate({ form }) {
			if (form.valid) {
				AlterarCadastro(
					projeto.id,
					form.data.nome,
					form.data.descricao,
					form.data.justificativa,
					form.data.tags
				);
			}
		}
	});
	$effect(() => {
		if (projeto) {
			$form.id = projeto.id;
			$form.nome = projeto.nome.trim();
			$form.descricao = projeto.descricao.trim();
			$form.justificativa = projeto.justificativa.trim();
			const tags: string[] = projeto.tags.map((tag: { nome: string }) => tag.nome);
			$form.tags = tags;
		} else {
			$form.id = 0;
			$form.nome = '';
			$form.descricao = '';
			$form.justificativa = '';
			$form.tags = [];
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
				<h2 class="h2">Alterar</h2>
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
					bind:valor={$form.descricao}
					erros={$errors.descricao}
					constraints={$constraints.descricao}
				/>
				<FormTextAreaComponent
					label="Justificativa"
					placeholder="justificativa"
					bind:valor={$form.justificativa}
					erros={$errors.justificativa}
					constraints={$constraints.justificativa}
				/>
				<FormInputTagComponent
					label="Tags"
					placeholder="tags"
					bind:valor={$form.tags}
					erros={$errors.tags}
					constraints={$constraints.tags}
				/>
			</fieldset>
			<fieldset>
				<button type="submit" class="btn preset-filled-primary-500 w-full"> Cadastrar </button>
			</fieldset>
		</form>
	{/snippet}
</ModalBase>
