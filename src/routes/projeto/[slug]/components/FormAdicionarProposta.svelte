<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import FormTextAreaComponent from '$components/FormTextAreaComponent.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import type Proposta from '$model/Proposta';
	import { getContext } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { _addProposalSchema } from '../+page';

	const toast = new Toaster(getContext);

	interface Props {
		AdicionarProposta: Function;
		openState: any;
		proposta: Proposta | null;
		data: any;
	}
	let { AdicionarProposta, openState = $bindable(), proposta, data }: Props = $props();
	let textoModal = $state('Adicionar');

	const { form, errors, message, constraints, enhance } = superForm(data.proposalForm, {
		SPA: true,
		validators: zod(_addProposalSchema),
		onUpdate({ form }) {
			if (form.valid) {
				AdicionarProposta(
					form.data.id,
					form.data.atividadesPropostas,
					form.data.contribuicaoAgenda,
					form.data.sugestao
				);
			}
		}
	});
	$effect(() => {
		if (proposta) {
			$form.id = proposta.id;
			$form.atividadesPropostas = proposta.atividadesPropostas.trim();
			$form.contribuicaoAgenda = proposta.contribuicaoAgenda?.trim();
			$form.sugestao = proposta.sugestao?.trim();

			textoModal = 'Alterar';
		} else {
			$form.id = 0;
			$form.atividadesPropostas = '';
			$form.contribuicaoAgenda = '';
			$form.sugestao = '';

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
					<FormTextAreaComponent
						label="Atividades Propostas"
						placeholder="Atividades Propostas"
						tipo="text"
						bind:valor={$form.atividadesPropostas}
						erros={$errors.atividadesPropostas}
						constraints={$constraints.atividadesPropostas}
					/>
					<FormTextAreaComponent
						label="Contribuição Agenda"
						placeholder="Contribuição Agenda"
						tipo="text"
						bind:valor={$form.contribuicaoAgenda}
						erros={$errors.contribuicaoAgenda}
						constraints={$constraints.contribuicaoAgenda}
					/>
				</div>
			</fieldset>
			<fieldset>
				<button type="submit" class="btn preset-filled-primary-500 w-full"> Cadastrar </button>
			</fieldset>
		</form>
	{/snippet}
</ModalBase>
