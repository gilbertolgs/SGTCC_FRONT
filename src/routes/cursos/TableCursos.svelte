<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { Pencil, X as IconX, Trash, ImagePlus } from 'lucide-svelte';
	import type Usuario from '$model/Usuario';
	import { EnumPapel, EnumPapelTodosPapeis } from '$model/EnumPapel';
	import FormSelectComponent from '$components/FormSelectComponent.svelte';
	import FormInputComponent from '$components/FormInputComponent.svelte';

	let {
		abrirModal,
		getCursos,
		cursos,
		curso = $bindable(),
		papelBusca = $bindable()
	} = $props();

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
			cursosFiltrados = cursosFiltrados.filter((usuarioFiltrado: Usuario) =>
				usuarioFiltrado.nome.toLowerCase().includes(txtNomeCurso)
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
	<button class="btn preset-filled-primary-500 h-10" onclick={pesquisar}>Pesquisar</button>
</div>

{#snippet cabecalho()}
	<thead>
		<tr>
			{#each camposCabecalho as campo}
				<td>{campo}</td>
			{/each}
		</tr>
	</thead>
{/snippet}
{#if cursosFiltrados}
	<div class="table-wrap">
		<table class="table-striped table">
			{@render cabecalho()}
			<tbody class="[&>tr]:hover:preset-tonal-primary">
				{#each cursosFiltrados as cursoAtual}
					<tr class="even:preset-tonal">
						<td>{cursoAtual.id}</td>
						<td>
							<a
								href={`perfil/${cursoAtual.id}`}
								class="anchor inline-flex w-min items-center gap-1 whitespace-nowrap"
							>
								<img class="min-w-26 rounded" src={cursoAtual.ExibeImagem()} alt="" />
								<span>
									{cursoAtual.nome}
								</span>
							</a>
						</td>
						<td>{cursoAtual.descricao}</td>
						<td class="grid grid-flow-col gap-2">
							<button
								class="btn preset-filled-success-500"
								onclick={() => {
									abrirModal("Insert", cursoAtual);
								}}
							>
								<Pencil /> Editar
							</button>
							<button
							class="btn preset-filled-warning-500"
							onclick={() => {
								abrirModal("Imagem", cursoAtual);
							}}
						>
							<ImagePlus /> Editar Imagem
						</button>
							<button
								class="btn preset-filled-error-500"
								onclick={() => {
									abrirModal("Delete", cursoAtual);
								}}
							>
								<Trash /> Excluir
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<td colspan={camposCabecalho.length - 1}>Total</td>
					<td class="text-right">{cursosFiltrados.length} Cursos</td>
				</tr>
			</tfoot>
		</table>
	</div>
{:else}
	<div class="table-wrap">
		<table class="table-striped table">
			{@render cabecalho()}
			<tbody class="[&>tr]:hover:preset-tonal-primary">
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
			</tbody>
		</table>
	</div>
{/if}
