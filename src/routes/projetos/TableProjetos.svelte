<script lang="ts">
	import TableBaseComponent from '$components/TableBaseComponent.svelte';
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import ImageComponent from '$components/ImageComponent.svelte';
	import type Projeto from '$model/Projeto';
	import { Globe } from 'lucide-svelte';

	let { abrirModal, getProjetos, projetos, papelBusca = $bindable() } = $props();

	let projetosFiltrados = $derived(projetos);

	let pesquisa = $state({
		nomeProjeto: ''
	});

	async function pesquisar() {
		await getProjetos();

		const txtNomeProjeto = pesquisa.nomeProjeto.toLowerCase().trim();
		if (txtNomeProjeto == '') {
			projetosFiltrados = projetos;
		} else {
			projetosFiltrados = projetosFiltrados.filter((projetoFiltrado: Projeto) =>
				projetoFiltrado.nome.toLowerCase().includes(txtNomeProjeto)
			);
		}
	}
	const camposCabecalho = ['ID', 'Nome', 'Descrição', 'Ações'];
</script>

<div class="m-2 flex items-end gap-2">
	<FormInputComponent
		label="Nome"
		placeholder="nome"
		tipo="text"
		bind:valor={pesquisa.nomeProjeto}
		erros={null}
		constraints={[]}
	/>
	<button class="btn preset-filled-primary-500 mt-auto" onclick={pesquisar}>Pesquisar</button>
</div>

{#snippet cabecalhoProjetos()}
	<thead>
		<tr>
			{#each camposCabecalho as campo}
				<td>{campo}</td>
			{/each}
		</tr>
	</thead>
{/snippet}
{#if projetosFiltrados}
	<TableBaseComponent {camposCabecalho} arrObjetosTamanho={projetosFiltrados.length}>
		{#snippet cabecalho()}
			{@render cabecalhoProjetos()}
		{/snippet}
		{#snippet corpo()}
			{#each projetosFiltrados as projetoAtual}
				<tr class="even:preset-tonal">
					<td>{projetoAtual.id}</td>
					<td>
						<span class="inline-flex w-min items-center gap-1 whitespace-nowrap">
							<ImageComponent objeto={projetoAtual} />
							<span>
								{projetoAtual.nome}
							</span>
						</span>
					</td>
					<td>{projetoAtual.descricao}</td>
					<td>
						<div class="grid grid-flow-col gap-2">
							<button
								class="btn preset-filled-success-500"
								onclick={() => {
									abrirModal('Insert', projetoAtual);
								}}
							>
								<Globe /> Publicar
							</button>
						</div>
					</td>
				</tr>
			{/each}
		{/snippet}
	</TableBaseComponent>
{:else}
	<TableBaseComponent {camposCabecalho} arrObjetosTamanho={1}>
		{#snippet cabecalho()}
			{@render cabecalhoProjetos()}
		{/snippet}
		{#snippet corpo()}
			<tr class="">
				<td class="">
					<div class="placeholder animate-pulse"></div>
				</td>
				<td class="flex items-center gap-2">
					<div class="placeholder h-15 min-w-26 animate-pulse"></div>
					<div class="placeholder h-2 w-full animate-pulse"></div>
				</td>
				<td class="">
					<div class="placeholder animate-pulse"></div>
				</td>
				<td class="">
					<div class="placeholder animate-pulse"></div>
				</td>
				<td class="">
					<div class="placeholder animate-pulse"></div>
				</td>
			</tr>
		{/snippet}
	</TableBaseComponent>
{/if}
