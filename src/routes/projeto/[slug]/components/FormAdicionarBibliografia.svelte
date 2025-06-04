<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import FormTextAreaComponent from '$components/FormTextAreaComponent.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import type Bibliografia from '$model/Bibliografia';
	import { getContext } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { _addBibliographySchema } from '../+page';

	const toast = new Toaster(getContext);

	interface Props {
		AdicionarAnotacao: Function;
		openState: any;
		referencia: Bibliografia | null;
		data: any;
	}
	let { AdicionarAnotacao, openState = $bindable(), referencia, data }: Props = $props();
	let textoModal = $state('Adicionar');

	const { form, errors, message, constraints, enhance } = superForm(data.activityForm, {
		SPA: true,
		validators: zod(_addBibliographySchema),
		onUpdate({ form }) {
			if (form.valid) {
				AdicionarAnotacao(
					form.data.id,
					form.data.autores,
					form.data.referencia,
					form.data.acessadoEm
				);
			}
		}
	});
	$effect(() => {
		if (referencia) {
			$form.id = referencia.id;
			$form.autores = referencia.autores.trim();
			$form.referencia = referencia.referencia.trim();
			$form.acessadoEm = referencia.acessadoEm.substring(0, 10);

			textoModal = 'Alterar';
		} else {
			$form.id = 0;
			$form.autores = '';
			$form.referencia = '';
			$form.acessadoEm = '';

			textoModal = 'Adicionar';
		}
	});
</script>

<ModalBase bind:openState>
	{#snippet conteudo()}
		<form novalidate method="POST" use:enhance class="card bg-surface-100-900 space-y-5 p-1">
			<fieldset class="space-y-2">
				<h2 class="h2">{textoModal}</h2>
			</fieldset>
			<fieldset class="grid h-[50vh] gap-5 overflow-auto md:grid-flow-col">
				<div>
					<FormInputComponent
						label="Autores"
						placeholder="autores"
						tipo="text"
						bind:valor={$form.autores}
						erros={$errors.autores}
						constraints={$constraints.autores}
					/>
					<FormTextAreaComponent
						label="Referência"
						placeholder="referencia"
						bind:valor={$form.referencia}
						erros={$errors.referencia}
						constraints={$constraints.referencia}
					/>
					<FormInputComponent
						label="Acessado Em"
						placeholder="acessadoEm"
						tipo="date"
						bind:valor={$form.acessadoEm}
						erros={$errors.dataInicio}
						constraints={$constraints.dataInicio}
					/>
				</div>
			</fieldset>
			<fieldset>
				<button type="submit" class="btn preset-filled-primary-500 w-full"> Cadastrar </button>
			</fieldset>
		</form>
	{/snippet}
</ModalBase>
