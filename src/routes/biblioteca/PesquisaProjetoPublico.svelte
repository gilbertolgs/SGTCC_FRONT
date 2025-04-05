<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import FormSelectComponent from '$components/FormSelectComponent.svelte';
	import { EnumTipoFiltro, EnumTipoFiltroTodosTipos } from '$model/EnumTipoFiltro';
	import { EnumTipoOrdenacao, EnumTipoOrdenacaoTodosOrdenacoes } from '$model/EnumTipoOrdenacao';
	import { getContext } from 'svelte';

	import Toaster from '$lib/ToastHandler';
	const toast = new Toaster(getContext);

	let { getProjetos } = $props();

	let arrTipoFiltro = $state(EnumTipoFiltroTodosTipos);
	let arrTipoOrdenacao = $state(EnumTipoOrdenacaoTodosOrdenacoes);

	let txtFiltro = $state('');
	let cmbTipoFiltro = $state(EnumTipoFiltro.NomeProjeto);
	let cmbTipoOrdenacao = $state(EnumTipoOrdenacao.Recentes);

	const anoAtual = new Date().getFullYear().toString();
	let txtAno = $state(anoAtual);

	function estaVazio(str: string) {
		return str.trim() === '';
	}

	function pesquisaProjeto() {
		if (estaVazio(txtFiltro) && estaVazio(txtAno)) {
			toast.triggerWarn("FILTRO ou ANO devem estar preenchidos!");
			return
		}
		getProjetos(cmbTipoFiltro, txtFiltro, cmbTipoOrdenacao, txtAno);
	}
</script>

<div class="m-2 flex flex-col gap-2">
	<div class="grid grid-cols-4 gap-2">
		<FormInputComponent
			classe="col-span-3"
			label="Filtro"
			placeholder="filtro"
			tipo="text"
			bind:valor={txtFiltro}
			erros={null}
			constraints={null}
		/>
		<button class="btn preset-filled-primary-500 mt-auto" onclick={pesquisaProjeto}>
			Pesquisar
		</button>
	</div>
	<div class="m-2 ml-auto flex gap-2 md:w-1/3">
		<FormInputComponent
			label="Ano"
			placeholder="ano"
			tipo="text"
			bind:valor={txtAno}
			erros={null}
			constraints={null}
		/>
		<FormSelectComponent
			label="Tipo Filtro"
			placeholder="Tipo Filtro"
			bind:valor={cmbTipoFiltro}
			erros={null}
			constraints={null}
		>
			{#snippet opcoes()}
				{#each arrTipoFiltro as filtro}
					<option value={filtro.valor}>{filtro.label}</option>
				{/each}
			{/snippet}
		</FormSelectComponent>
		<FormSelectComponent
			label="Tipo Ordenação"
			placeholder="tipo ordenação"
			bind:valor={cmbTipoOrdenacao}
			erros={null}
			constraints={null}
		>
			{#snippet opcoes()}
				{#each arrTipoOrdenacao as ordenacao}
					<option value={ordenacao.valor}>{ordenacao.label}</option>
				{/each}
			{/snippet}
		</FormSelectComponent>
	</div>
</div>
