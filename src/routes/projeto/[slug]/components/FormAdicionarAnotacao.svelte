<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import FormSelectComponent from '$components/FormSelectComponent.svelte';
	import FormTextAreaComponent from '$components/FormTextAreaComponent.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import type Atividade from '$model/Atividade';
	import type Usuario from '$model/Usuario';
	import { getContext } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { _addNoteSchema } from '../+page';
	import type Anotacao from '$model/Anotacao';

	const toast = new Toaster(getContext);

	interface Props {
		AdicionarAnotacao: Function;
		openState: any;
		anotacao: Anotacao | null;
		data: any;
	}
	let { AdicionarAnotacao, openState = $bindable(), anotacao, data }: Props = $props();
	let textoModal = $state('Adicionar');

	const { form, errors, message, constraints, enhance } = superForm(data.activityForm, {
		SPA: true,
		validators: zod(_addNoteSchema),
		onUpdate({ form }) {
			if (form.valid) {
				if (form.data.dataEntrega && form.data.dataEntrega.trim() === '') {
					form.data.dataEntrega = null;
				}
				AdicionarAnotacao(form.data.id, form.data.titulo, form.data.descricao);
			}
		}
	});
	$effect(() => {
		if (anotacao) {
			$form.id = anotacao.id;
			$form.titulo = anotacao.titulo.trim();
			$form.descricao = anotacao.descricao?.trim();

			textoModal = 'Alterar';
		} else {
			$form.id = 0;
			$form.titulo = '';
			$form.descricao = '';

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
						label="Titulo"
						placeholder="titulo"
						tipo="text"
						bind:valor={$form.titulo}
						erros={$errors.titulo}
						constraints={$constraints.titulo}
					/>
					<FormTextAreaComponent
						label="Descrição"
						placeholder="descrição"
						tipo="text"
						bind:valor={$form.descricao}
						erros={$errors.descricao}
						constraints={$constraints.descricao}
					/>
				</div>
			</fieldset>
			<fieldset>
				<button type="submit" class="btn preset-filled-primary-500 w-full"> Cadastrar </button>
			</fieldset>
		</form>
	{/snippet}
</ModalBase>
