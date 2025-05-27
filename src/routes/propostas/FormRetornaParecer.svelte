<script lang="ts">
	import FormTextAreaComponent from '$components/FormTextAreaComponent.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import type Proposta from '$model/Proposta';
	import { getContext } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { _proposalFeedback } from './+page';
	import FormSelectComponent from '$components/FormSelectComponent.svelte';
	import { EnumParecerPropostaTodosPapeis } from '$model/EnumParecerProposta';

	const toast = new Toaster(getContext);

	interface Props {
		RetornarParecer: Function;
		openState: any;
		proposta: Proposta | null;
		data: any;
	}
	let { RetornarParecer, openState = $bindable(), proposta, data }: Props = $props();
	let textoModal = $state('Parecer');

	const { form, errors, message, constraints, enhance } = superForm(data.proposalFeedbackForm, {
		SPA: true,
		validators: zod(_proposalFeedback),
		onUpdate({ form }) {
			if (form.valid) {
				RetornarParecer(form.data.id, form.data.sugestao, form.data.parecer);
			}
		}
	});
	$effect(() => {
		if (proposta) {
			$form.id = proposta.id;
			$form.sugestao = proposta.sugestao?.trim();
			$form.parecer = proposta.parecer;
		} else {
			$form.id = 0;
			$form.sugestao = '';
			$form.parecer = 0;
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
						label="Sugestão"
						placeholder="Sugestão"
						tipo="text"
						bind:valor={$form.sugestao}
						erros={$errors.sugestao}
						constraints={$constraints.sugestao}
					/>
					<FormSelectComponent
						label="Parecer"
						placeholder="Parecer"
						bind:valor={$form.parecer}
						erros={$errors.parecer}
						constraints={$constraints.parecer}
					>
						{#snippet opcoes()}
							{#each EnumParecerPropostaTodosPapeis as opcoes}
								<option value={opcoes.valor}>{opcoes.label}</option>
							{/each}
						{/snippet}
					</FormSelectComponent>
				</div>
			</fieldset>
			<fieldset>
				<button type="submit" class="btn preset-filled-primary-500 w-full"> Enviar </button>
			</fieldset>
		</form>
	{/snippet}
</ModalBase>
