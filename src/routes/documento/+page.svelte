<script lang="ts">
	import DocumentoApiRepository from '$repository/openapi/DocumentoApiRepository';
	import ModalBase from '$components/ModalBase.svelte';
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
	import { Trash, Pencil, Plus } from 'lucide-svelte';
	import Toaster from '$lib/ToastHandler';
	import { getContext } from 'svelte';

	type CampoDocumento = {
		id: number;
		campo: string;
		idCategoria: number;
	};

	type CategoriaDocumento = {
		id: number;
		valor: string;
	};

	const toast = new Toaster(getContext);

	let categorias: CategoriaDocumento[] = $state([]);
	let campos: CampoDocumento[] = $state([]);

	let nomeNovaCategoria: string = $state('');
	let nomeNovoCampo: string = $state('');
	let categoriaSelecionada: number = $state(0);
	let campoSelecionado: CampoDocumento | null = $state(null);
	let categoriaEditando: CategoriaDocumento | null = $state(null);

	let openStateAdicionarCategoria = $state(false);
	let openStateAdicionarCampo = $state(false);
	let openStateConfirmarRemocao = $state(false);

	let tipoRemocao: 'campo' | 'categoria' = 'campo';
	let idRemocao: number = 0;

	async function getCategorias() {
		categorias = await DocumentoApiRepository.PegarCategorias();
		await getCampos();
	}

	async function getCampos() {
		campos = await DocumentoApiRepository.PegarTodos();
	}

	$effect(() => {
		getCategorias();
	});

	async function adicionarCategoria() {
		if (!nomeNovaCategoria.trim()) return;
		if (categoriaEditando) {
			await DocumentoApiRepository.AtualizarCategoria(categoriaEditando.id, nomeNovaCategoria);
		} else {
			await DocumentoApiRepository.CriarCategoria(nomeNovaCategoria);
		}
		nomeNovaCategoria = '';
		categoriaEditando = null;
		openStateAdicionarCategoria = false;
		getCategorias();
	}

	async function adicionarCampo() {
		if (!nomeNovoCampo.trim() || !categoriaSelecionada) return;
		if (campoSelecionado) {
			await DocumentoApiRepository.Atualizar(campoSelecionado.id, nomeNovoCampo, campoSelecionado.idCategoria);
			console.log('tafuk');
			
		} else {
			await DocumentoApiRepository.Criar(nomeNovoCampo, categoriaSelecionada);
		}
			console.log('asda');
		nomeNovoCampo = '';
		campoSelecionado = null;
		categoriaSelecionada = 0;
		openStateAdicionarCampo = false;
		getCampos();
	}

	function abrirModal(modal: string, categoriaId: number = 0, item: any = null) {
		switch (modal) {
			case 'categoria':
				categoriaEditando = item;
				nomeNovaCategoria = item ? item.valor : '';
				openStateAdicionarCategoria = true;
				break;
			case 'campo':
				campoSelecionado = item;
				nomeNovoCampo = item ? item.valor : '';
				categoriaSelecionada = item ? item.idCategoria : categoriaId;
				openStateAdicionarCampo = true;
				break;
		}
	}

	function abrirModalApagar(tipo: 'campo' | 'categoria', id: number) {
		tipoRemocao = tipo;
		idRemocao = id;
		openStateConfirmarRemocao = true;
	}

	async function removerConfirmado() {
		try {
			if (tipoRemocao === 'campo') {
				await DocumentoApiRepository.Apagar(idRemocao);
				await getCampos();
			} else {
				await DocumentoApiRepository.ApagarCategoria(idRemocao);
				await getCategorias();
			}
			toast.triggerSuccess('Remoção realizada com sucesso.');
		} catch (e) {
			toast.triggerError('Erro ao tentar remover.');
		}
		openStateConfirmarRemocao = false;
	}
</script>

<div class="mb-6 flex grid w-full justify-between md:flex">
	<h1 class="text-xl font-semibold">Campos por Categoria</h1>
	<button onclick={() => abrirModal('categoria')} class="btn bg-success-500">
		<Plus class="h-4 w-4" /> Nova Categoria
	</button>
</div>

<div class="grid gap-6 md:flex md:flex-col md:items-center">
	{#if categorias.length > 0}
		{#each categorias as categoria}
			<div class="preset-tonal w-full rounded-lg p-6 shadow-md md:w-3/4">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-lg font-bold">{categoria.valor}</h2>
					<div class="flex gap-2">
						<button
							onclick={() => abrirModal('categoria', 0, categoria)}
							class="btn preset-outlined-primary-500"
						>
							<Pencil class="h-4 w-4" />
						</button>
						<button
							onclick={() => abrirModalApagar('categoria', categoria.id)}
							class="btn preset-outlined-error-500"
						>
							<Trash class="h-4 w-4" />
						</button>
						<button
							onclick={() => abrirModal('campo', categoria.id)}
							class="btn preset-outlined-primary-500"
						>
							<Plus class="h-4 w-4" /> Adicionar Campo
						</button>
					</div>
				</div>

				<ul class="space-y-2">
					{#each campos.filter((c) => c.idCategoria === categoria.id) as campo}
						<li class="preset-tonal flex items-center justify-between rounded p-3">
							<span>{campo.campo}</span>
							<div class="flex gap-2">
								<button
									onclick={() => abrirModal('campo', categoria.id, campo)}
									class="hover:text-primary-500"
								>
									<Pencil class="h-4 w-4" />
								</button>
								<button
									onclick={() => abrirModalApagar('campo', campo.id)}
									class="hover:text-error-500"
								>
									<Trash class="h-4 w-4" />
								</button>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	{/if}
</div>

<!-- Modal Criar/Editar Categoria -->
<ModalBase bind:openState={openStateAdicionarCategoria}>
	{#snippet conteudo()}
		<div class="space-y-4 p-4">
			<h3 class="text-xl font-semibold">
				{categoriaEditando ? 'Editar Categoria' : 'Nova Categoria'}
			</h3>
			<input bind:value={nomeNovaCategoria} class="input w-full" placeholder="Nome da categoria" />
			<button onclick={adicionarCategoria} class="btn preset-filled-primary-500 w-full">
				Salvar
			</button>
		</div>
	{/snippet}
</ModalBase>

<!-- Modal Criar/Editar Campo -->
<ModalBase bind:openState={openStateAdicionarCampo}>
	{#snippet conteudo()}
		<div class="space-y-4 p-4">
			<h3 class="text-xl font-semibold">{campoSelecionado ? 'Editar Campo' : 'Novo Campo'}</h3>
			<input bind:value={nomeNovoCampo} class="input w-full" placeholder="Nome do campo" />
			<button onclick={adicionarCampo} class="btn preset-filled-primary-500 w-full">
				Salvar
			</button>
		</div>
	{/snippet}
</ModalBase>

<!-- Confirmar Remoção -->
<ConfirmDialog
	bind:openState={openStateConfirmarRemocao}
	titulo="Tem certeza que deseja apagar?"
	texto="Essa ação não poderá ser desfeita."
	funcao={removerConfirmado}
/>
