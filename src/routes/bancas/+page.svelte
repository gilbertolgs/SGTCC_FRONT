<script lang="ts">
	import BancaApiRepository from '$repository/openapi/BancaApiRepository';
	import ModalBase from '$components/ModalBase.svelte';
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
	import Toaster from '$lib/ToastHandler';
	import { Trash, Pencil, Plus } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import FormSelectComponent from '$components/FormSelectComponent.svelte';
	import type Projeto from '$model/Projeto';
	import { storeLogin } from '../../stores';
	import ProjetoRepository from '$repository/ProjetoRepository';

	type Banca = {
		id: number;
		idProjeto: number;
		dataSeminario: string;
		observacaoNotaProjeto?: string | null;
		observacaoAluno?: string | null;
		recomendacao?: string | null;
	};

	const toast = new Toaster(getContext);

	let usuarioLogado = $derived($storeLogin);

	let projetos: Projeto[] | null = $state(null);
	let bancas: Banca[] = $state([]);
	let bancaSelecionada: Banca | null = $state(null);

	let openModalBanca = $state(false);
	let openConfirmarRemocao = $state(false);
	let idParaRemocao: number = 0;

	let form: Partial<Banca> = $state({
		idProjeto: 0,
		dataSeminario: '',
		observacaoNotaProjeto: '',
		observacaoAluno: '',
		recomendacao: ''
	});

	$effect(() => {
		carregarBancas();
		pegarProjetos();
	});

	async function carregarBancas() {
		bancas = await BancaApiRepository.PegarTodasBancas();
	}

	function abrirModal(banca: Banca | null = null) {
		bancaSelecionada = banca;
		if (banca) {
			form = { ...banca };
		} else {
			form = {
				idProjeto: 0,
				dataSeminario: '',
				observacaoNotaProjeto: '',
				observacaoAluno: '',
				recomendacao: ''
			};
		}
		openModalBanca = true;
	}

	async function salvarBanca(e: any) {
		e.preventDefault();
		try {
			if (bancaSelecionada) {
				await BancaApiRepository.AtualizarBanca(form);
			} else {
				await BancaApiRepository.CriarBanca(form as any);
			}
			openModalBanca = false;
			await carregarBancas();
			toast.triggerSuccess('Banca salva com sucesso!');
		} catch {
			toast.triggerError('Erro ao salvar banca.');
		}
	}

	function confirmarRemocao(id: number) {
		idParaRemocao = id;
		openConfirmarRemocao = true;
	}

	async function removerBanca() {
		try {
			await BancaApiRepository.DeletarBanca(idParaRemocao);
			await carregarBancas();
			toast.triggerSuccess('Banca removida com sucesso!');
		} catch {
			toast.triggerError('Erro ao remover banca.');
		}
		openConfirmarRemocao = false;
	}

	async function pegarProjetos() {
		if (!usuarioLogado) return;

		projetos = await ProjetoRepository.PegarPorCurso(usuarioLogado.idCurso);
	}
</script>

<div class="mb-6 flex grid w-full justify-between md:flex">
	<h1 class="text-xl font-semibold">Gerenciar Bancas</h1>
	<button onclick={() => abrirModal()} class="btn bg-success-500">
		<Plus class="h-4 w-4" /> Nova Banca
	</button>
</div>

{#if bancas.length > 0}
	<div class="grid gap-6 md:flex md:flex-col md:items-center">
		{#each bancas as banca}
			<div class="preset-tonal w-full rounded-lg p-6 shadow-md md:w-3/4">
				<div class="mb-2 flex items-center justify-between">
					<div>
						<p><strong>ID Projeto:</strong> {banca.idProjeto}</p>
						<p><strong>Data:</strong> {banca.dataSeminario}</p>
					</div>
					<div class="flex gap-2">
						<button onclick={() => abrirModal(banca)} class="btn preset-outlined-primary-500">
							<Pencil class="h-4 w-4" />
						</button>
						<button
							onclick={() => confirmarRemocao(banca.id)}
							class="btn preset-outlined-error-500"
						>
							<Trash class="h-4 w-4" />
						</button>
					</div>
				</div>
				{#if banca.observacaoNotaProjeto}
					<p class="text-sm"><strong>Obs. Nota:</strong> {banca.observacaoNotaProjeto}</p>
				{/if}
				{#if banca.observacaoAluno}
					<p class="text-sm"><strong>Obs. Aluno:</strong> {banca.observacaoAluno}</p>
				{/if}
				{#if banca.recomendacao}
					<p class="text-sm"><strong>Recomendação:</strong> {banca.recomendacao}</p>
				{/if}
			</div>
		{/each}
	</div>
{:else}
	<p class="text-center text-gray-500">Nenhuma banca cadastrada.</p>
{/if}

<ModalBase bind:openState={openModalBanca}>
	{#snippet conteudo()}
		<form
			novalidate
			method="POST"
			onsubmit={salvarBanca}
			class="card bg-surface-100-900 space-y-5 p-1"
		>
			<fieldset class="space-y-2">
				<h2 class="h2">{bancaSelecionada ? 'Editar Banca' : 'Nova Banca'}</h2>
			</fieldset>

			<fieldset class="grid h-[50vh] gap-5 overflow-auto md:grid-flow-col">
				<div class="space-y-4">
					<FormSelectComponent
						label="Projeto"
						placeholder="Selecione um projeto"
						bind:valor={form.idProjeto}
						erros={null}
						constraints={null}
					>
						{#snippet opcoes()}
							{#if projetos}
								{#each projetos as projeto}
									<option value={projeto.id}>{projeto.nome}</option>
								{/each}
							{:else}
								<option>Sem Projetos!</option>
							{/if}
						{/snippet}
					</FormSelectComponent>

					<FormInputComponent
						label="Data do Seminário"
						placeholder="Data do Seminário"
						tipo="date"
						bind:valor={form.dataSeminario}
						erros={null}
						constraints={null}
					/>

			</fieldset>

			<fieldset>
				<button type="submit" class="btn preset-filled-primary-500 w-full">
					{bancaSelecionada ? 'Atualizar' : 'Cadastrar'}
				</button>
			</fieldset>
		</form>
	{/snippet}
</ModalBase>

<!-- Confirmação de remoção -->
<ConfirmDialog
	bind:openState={openConfirmarRemocao}
	titulo="Deseja remover esta banca?"
	texto="Essa ação não poderá ser desfeita."
	funcao={removerBanca}
/>
