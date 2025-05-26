<script lang="ts">
	import FormTextAreaComponent from '$components/FormTextAreaComponent.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import type Duvida from '$model/Duvida';
	import { getContext } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { _addDuvidaSchema } from '../+page';
	import FormSelectComponent from '$components/FormSelectComponent.svelte';
	import { EnumVisibilidadeDuvidaTodosPapeis } from '$model/EnumVisibilidadeDuvida';

	const toast = new Toaster(getContext);

	interface Props {
		AdicionarDuvida: Function;
		openState: any;
		duvida: Duvida | null;
		data: any;
	}

	let { AdicionarDuvida, openState = $bindable(), duvida, data }: Props = $props();
	let textoModal = $state('Adicionar');

	const { form, errors, message, constraints, enhance } = superForm(data.activityForm, {
		SPA: true,
		validators: zod(_addDuvidaSchema),
		onUpdate({ form }) {
			if (form.valid) {
				AdicionarDuvida(form.data.id, form.data.texto, form.data.visibilidade, form.data.atendida);
			}
		}
	});

	$effect(() => {
		if (duvida) {
			$form.id = duvida.id;
			$form.texto = duvida.texto.trim();
			$form.visibilidade = duvida.visibilidade;

			textoModal = 'Alterar';
		} else {
			$form.id = 0;
			$form.texto = '';
			$form.visibilidade = '';

			textoModal = 'Adicionar';
		}
	});
</script>

<ModalBase bind:openState>
	{#snippet conteudo()}
		<form novalidate method="POST" use:enhance class="card bg-surface-100-900 space-y-5 p-1">
			<fieldset class="space-y-2">
				<h2 class="h2">{textoModal} Dúvida</h2>
			</fieldset>

			<fieldset class="grid h-[50vh] gap-5 overflow-auto md:grid-flow-col">
				<div>
					<FormTextAreaComponent
						label="Texto"
						placeholder="Digite sua dúvida"
						tipo="text"
						bind:valor={$form.texto}
						erros={$errors.texto}
						constraints={$constraints.texto}
					/>

					<FormSelectComponent
						label="Visibilidade"
						placeholder="Visibilidade"
						bind:valor={$form.visibilidade}
						erros={null}
						constraints={null}
					>
						{#snippet opcoes()}
							{#each EnumVisibilidadeDuvidaTodosPapeis as visibilidade}
								<option value={visibilidade.valor}>{visibilidade.label}</option>
							{/each}
						{/snippet}
					</FormSelectComponent>
				</div>
			</fieldset>
			<fieldset>
				<button type="submit" class="btn preset-filled-primary-500 w-full">
					{textoModal} Dúvida
				</button>
			</fieldset>
		</form>
	{/snippet}
</ModalBase>
