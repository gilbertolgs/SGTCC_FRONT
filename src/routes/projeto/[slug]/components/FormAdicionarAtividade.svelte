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
	import { _addActivitySchema } from '../+page';

	const toast = new Toaster(getContext);

	interface Props {
		AdicionarAtividade: Function;
		openState: any;
		atividade: Atividade | null;
		usuariosDisponiveis: Usuario[] | null;
		data: any;
	}
	let {
		AdicionarAtividade,
		openState = $bindable(),
		atividade,
		usuariosDisponiveis,
		data
	}: Props = $props();
	let textoModal = $state('Adicionar');

	const { form, errors, message, constraints, enhance } = superForm(data.activityForm, {
		SPA: true,
		validators: zod(_addActivitySchema),
		onUpdate({ form }) {
			if (form.valid) {
				if (form.data.dataEntrega && form.data.dataEntrega.trim() === '') {
					form.data.dataEntrega = null;
				}
				AdicionarAtividade(
					form.data.id,
					form.data.nome,
					form.data.descricao,
					form.data.idUsuario,
					form.data.prioridade,
					form.data.duracaoEstimada,
					form.data.dataInicio,
					form.data.dataEntrega
				);
			}
		}
	});
	$effect(() => {
		if (atividade) {
			$form.id = atividade.id;
			$form.nome = atividade.nome.trim();
			$form.descricao = atividade.descricao?.trim();
			$form.idUsuario = atividade.idUsuario;
			$form.prioridade = atividade.prioridade;
			$form.duracaoEstimada = atividade.duracaoEstimada;
			if (atividade.dataInicio.length > 11) {
				$form.dataInicio = atividade.dataInicio.substring(0, 10);
			}
			if (atividade.dataEntrega && atividade.dataEntrega.length > 11) {
				$form.dataEntrega = atividade.dataEntrega.substring(0, 10);
			}

			textoModal = 'Alterar';
		} else {
			$form.id = 0;
			$form.nome = '';
			$form.descricao = '';
			$form.idUsuario = 0;
			$form.prioridade = 0;
			$form.duracaoEstimada = 0;
			$form.dataInicio = null;
			$form.dataEntrega = null;

			textoModal = 'Adicionar';
		}
	});

	function checaDataFim() {
		if ($form.dataEntrega < $form.dataInicio) {
			$form.dataEntrega = null;
		}
	}
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
				</div>
				<div>
					{#if usuariosDisponiveis !== null}
						<FormSelectComponent
							label="Usuário Encarregado"
							placeholder="usuário"
							bind:valor={$form.idUsuario}
							erros={$errors.idUsuario}
							constraints={$constraints.idUsuario}
						>
							{#snippet opcoes()}
								{#each usuariosDisponiveis as usuario}
									<option value={usuario.id}>{usuario.nome}</option>
								{/each}
							{/snippet}
						</FormSelectComponent>
					{/if}
					<!-- <input type="text" hidden bind:value={$form.idUsuario} />
					<FormInputComponent
						label="Usuário Encarregado"
						placeholder="usuário"
						tipo="text"
						bind:valor={$form.usuarioEncarregado}
						erros={$errors.usuarioEncarregado}
						constraints={$constraints.usuarioEncarregado}
					/> -->
					<FormInputComponent
						label="Duração Estimada em Horas"
						placeholder="duração estimada"
						tipo="number"
						bind:valor={$form.duracaoEstimada}
						erros={$errors.duracaoEstimada}
						constraints={$constraints.duracaoEstimada}
					/>
					<FormSelectComponent
						label="Prioridade"
						placeholder="prioridade"
						bind:valor={$form.prioridade}
						erros={$errors.prioridade}
						constraints={$constraints.prioridade}
					>
						{#snippet opcoes()}
							<option value={0}>Baixa</option>
							<option value={1}>Média</option>
							<option value={2}>Alta</option>
						{/snippet}
					</FormSelectComponent>
					<FormInputComponent
						label="Data Início"
						placeholder="data inicio"
						tipo="date"
						bind:valor={$form.dataInicio}
						erros={$errors.dataInicio}
						constraints={$constraints.dataInicio}
						changeEvent={() => checaDataFim()}
					/>
					<FormInputComponent
						label="Data Fim"
						placeholder="data fim"
						tipo="date"
						bind:valor={$form.dataEntrega}
						erros={$errors.dataEntrega}
						constraints={$constraints.dataEntrega}
						min={$form.dataInicio}
					/>
				</div>
			</fieldset>
			<fieldset>
				<button type="submit" class="btn preset-filled-primary-500 w-full"> Cadastrar </button>
			</fieldset>
		</form>
	{/snippet}
</ModalBase>
