<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import FormTextAreaComponent from '$components/FormTextAreaComponent.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import type Relatorio from '$model/Relatorio';
	import { getContext } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { _addRelatorioSchema } from '../+page';

	const toast = new Toaster(getContext);

	interface Props {
		AdicionarRelatorio: Function;
		openState: any;
		relatorio: Relatorio | null;
		data: any;
	}

	let { AdicionarRelatorio, openState = $bindable(), relatorio, data }: Props = $props();
	let textoModal = $state('Adicionar');

	const { form, errors, message, constraints, enhance } = superForm(data.relatorioForm, {
		SPA: true,
		validators: zod(_addRelatorioSchema),
		onUpdate({ form }) {
			if (form.valid) {
				AdicionarRelatorio(
					form.data.id,
					form.data.titulo,
					form.data.descricao,
					form.data.duracaoEncontro,
					form.data.dataRealizacao
				);
			}
		}
	});

	$effect(() => {
		if (relatorio) {
			$form.id = relatorio.id;
			$form.titulo = relatorio.titulo?.trim() ?? '';
			$form.descricao = relatorio.descricao?.trim() ?? '';
			$form.duracaoEncontro = relatorio.duracaoEncontro;
			$form.dataRealizacao = relatorio.dataRealizacao;

			textoModal = 'Alterar';
		} else {
			$form.id = 0;
			$form.titulo = '';
			$form.descricao = '';
			$form.duracaoEncontro = 1;
			$form.dataRealizacao = new Date().toISOString();

			textoModal = 'Adicionar';
		}
	});
</script>

<ModalBase bind:openState>
	{#snippet conteudo()}
		<form novalidate method="POST" use:enhance class="card bg-surface-100-900 space-y-5 p-1">
			<fieldset class="space-y-2">
				<h2 class="h2">{textoModal} Relatório</h2>
			</fieldset>

			<fieldset class="grid gap-5 md:grid-cols-2">
				<FormInputComponent
					label="Título"
					placeholder="Informe um título"
					tipo="text"
					bind:valor={$form.titulo}
					erros={$errors.titulo}
					constraints={$constraints.titulo}
				/>

				<FormInputComponent
					label="Duração do encontro (horas)"
					placeholder="Ex: 2"
					tipo="number"
					bind:valor={$form.duracaoEncontro}
					erros={$errors.duracaoEncontro}
					constraints={$constraints.duracaoEncontro}
				/>

				<FormInputComponent
					label="Data de realização"
					placeholder="YYYY-MM-DD"
					tipo="datetime-local"
					bind:valor={$form.dataRealizacao}
					erros={$errors.dataRealizacao}
					constraints={$constraints.dataRealizacao}
				/>
			</fieldset>

			<FormTextAreaComponent
				label="Descrição"
				placeholder="Descreva o que foi discutido"
				bind:valor={$form.descricao}
				erros={$errors.descricao}
				constraints={$constraints.descricao}
			/>

			<fieldset>
				<button type="submit" class="btn preset-filled-primary-500 w-full">
					{textoModal} Relatório
				</button>
			</fieldset>
		</form>
	{/snippet}
</ModalBase>
