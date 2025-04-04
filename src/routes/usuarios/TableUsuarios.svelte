<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import FormSelectComponent from '$components/FormSelectComponent.svelte';
	import { EnumPapel, EnumPapelTodosPapeis } from '$model/EnumPapel';
	import type Usuario from '$model/Usuario';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { Pencil, Trash } from 'lucide-svelte';

	let {
		getUsuarios,
		usuarios,
		usuario = $bindable(),
		openState = $bindable(),
		papelBusca = $bindable()
	} = $props();

	let placeholderSkeleton = $state(true);
	let papeis = $state(EnumPapelTodosPapeis);

	let usuariosFiltrados = $derived(usuarios);

	let pesquisa = $state({
		papel: EnumPapel.Aluno,
		nomeAluno: ''
	});

	function abrirModal(usuarioSelecionado: Usuario) {
		usuario = usuarioSelecionado;
		openState = !openState;
	}

	async function pesquisar() {
		papelBusca = pesquisa.papel;
		await getUsuarios();

		const txtNomeAluno = pesquisa.nomeAluno.toLowerCase().trim();
		if (txtNomeAluno == '') {
			usuariosFiltrados = usuarios;
		} else {
			usuariosFiltrados = usuariosFiltrados.filter((usuarioFiltrado: Usuario) =>
				usuarioFiltrado.nome.toLowerCase().includes(txtNomeAluno)
			);
		}
	}

	const camposCabecalho = ['ID', 'Nome', 'Email', 'Papel'];
</script>

<div class="m-2 flex items-end gap-2">
	<FormSelectComponent
		label="Papel"
		placeholder="papel"
		bind:valor={pesquisa.papel}
		erros={null}
		constraints={[]}
	>
		{#snippet opcoes()}
			{#each papeis as papel}
				<option value={papel.valor}>{papel.label}</option>
			{/each}
		{/snippet}
	</FormSelectComponent>
	<FormInputComponent
		label="Nome"
		placeholder="nome"
		tipo="text"
		bind:valor={pesquisa.nomeAluno}
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
{#if usuariosFiltrados}
	<div class="table-wrap">
		<table class="table-striped table">
			{@render cabecalho()}
			<tbody class="[&>tr]:hover:preset-tonal-primary">
				{#each usuariosFiltrados as usuarioAtual}
					<tr class="even:preset-tonal">
						<td>{usuarioAtual.id}</td>
						<td>
							<a
								href={`/usuario/${usuarioAtual.id}`}
								class="inline-flex w-min items-center gap-1 whitespace-nowrap"
							>
								<Avatar
									classes="select-none group-hover:brightness-50"
									size="size-10"
									src={usuarioAtual.ExibeImagem()}
									name={usuarioAtual.nome}
								/>
								<span class="anchor">
									{usuarioAtual.nome}
								</span>
							</a>
						</td>
						<td>{usuarioAtual.email}</td>
						<td>{usuarioAtual.ExibePapel()}</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<td colspan={camposCabecalho.length - 1}>Total</td>
					<td class="text-right">{usuariosFiltrados.length} Usuários</td>
				</tr>
			</tfoot>
		</table>
	</div>
	<!-- {:else if placeholderSkeleton} -->
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
						<div class="placeholder-circle size-10 animate-pulse"></div>
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
