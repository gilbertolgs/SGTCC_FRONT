<script lang="ts">
	import TableBaseComponent from '$components/TableBaseComponent.svelte';
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import ImageComponent from '$components/ImageComponent.svelte';
	import type Curso from '$model/Curso';
	import { EnumPapelTodosPapeis } from '$model/EnumPapel';
	import { ImagePlus, Pencil, Trash } from 'lucide-svelte';

	let { abrirModal, getCursos, cursos, curso = $bindable(), papelBusca = $bindable() } = $props();

	let papeis = $state(EnumPapelTodosPapeis);

	let cursosFiltrados = $derived(cursos);

	let pesquisa = $state({
		nomeCurso: ''
	});

	async function pesquisar() {
		await getCursos();

		const txtNomeCurso = pesquisa.nomeCurso.toLowerCase().trim();
		if (txtNomeCurso == '') {
			cursosFiltrados = cursos;
		} else {
			cursosFiltrados = cursosFiltrados.filter((cursoFiltrado: Curso) =>
				cursoFiltrado.nome.toLowerCase().includes(txtNomeCurso)
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
		bind:valor={pesquisa.nomeCurso}
		erros={null}
		constraints={[]}
	/>
	<button class="btn preset-filled-primary-500 mt-auto" onclick={pesquisar}>Pesquisar</button>
</div>

{#snippet cabecalhoCursos()}
	<thead>
		<tr>
			{#each camposCabecalho as campo}
				<td>{campo}</td>
			{/each}
		</tr>
	</thead>
{/snippet}
{#if cursosFiltrados}
	<TableBaseComponent {camposCabecalho} arrObjetosTamanho={cursosFiltrados.length}>
		{#snippet cabecalho()}
			{@render cabecalhoCursos()}
		{/snippet}
		{#snippet corpo()}
			{#each cursosFiltrados as cursoAtual}
				<tr class="even:preset-tonal">
					<td>{cursoAtual.id}</td>
					<td>
						<span class="inline-flex w-min items-center gap-1 whitespace-nowrap">
							<ImageComponent objeto={cursoAtual} />
							<span>
								{cursoAtual.nome}
							</span>
						</span>
					</td>
					<td>{cursoAtual.descricao}</td>
					<td>
						<div class="grid grid-flow-col gap-2">
							<button
								class="btn preset-filled-success-500"
								onclick={() => {
									abrirModal('Insert', cursoAtual);
								}}
							>
								<Pencil /> Editar
							</button>
							<button
								class="btn preset-filled-warning-500"
								onclick={() => {
									abrirModal('Imagem', cursoAtual);
								}}
							>
								<ImagePlus /> Editar Imagem
							</button>
							<button
								class="btn preset-filled-error-500"
								onclick={() => {
									abrirModal('Delete', cursoAtual);
								}}
							>
								<Trash /> Excluir
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
			{@render cabecalhoCursos()}
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
