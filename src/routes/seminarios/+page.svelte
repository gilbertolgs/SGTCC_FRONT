<script lang="ts">
	import SeminarioApiRepository from '$repository/openapi/SeminarioApiRepository';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import ModalBase from '$components/ModalBase.svelte';
	import Toaster from '$lib/ToastHandler';
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import FormSelectComponent from '$components/FormSelectComponent.svelte';
	import { Plus } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import type Projeto from '$model/Projeto';
	import { storeLogin } from '../../stores';
	import FormTextAreaComponent from '$components/FormTextAreaComponent.svelte';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import DetalhesSeminario from './DetalhesSeminario.svelte';

	type Seminario = {
		id: number;
		idUsuario: number;
		requisitos: string;
		data: string;
	};

	const toast = new Toaster(getContext);
	let usuarioLogado = $derived($storeLogin);

	let seminarios: Seminario[] = $state([]);
	let openStateAdicionar = $state(false);
	let openStateDetalhes = $state(false);

	let seminarioSelecionado: Seminario | null = $state(null);
	let projetos: Projeto[] | null = $state(null);

	let form: Partial<Seminario> = $state({
		idUsuario: 0,
		requisitos: '',
		data: ''
	});

	$effect(() => {
		carregarSeminarios();
		carregarProjetos();
	});

	async function carregarSeminarios() {
		seminarios = await SeminarioApiRepository.PegarTodosSeminarios();
	}

	async function carregarProjetos() {
		if (!usuarioLogado) return;
		projetos = await ProjetoRepository.PegarPorCurso(usuarioLogado.idCurso);
	}

	function abrirModal(seminario: Seminario | null = null) {
		if (!usuarioLogado) return;
		seminarioSelecionado = seminario;
		if (seminario) {
			form = { ...seminario, requisitos: seminario.requisitos.trim(), data: seminario.data.split('T')[0] };
		} else {
			form = {
				idUsuario: usuarioLogado.id,
				requisitos: '',
				data: ''
			};
		}
		openStateAdicionar = true;
	}

	async function salvarSeminario(e: Event) {
		e.preventDefault();
		try {
			if (seminarioSelecionado) {
				await SeminarioApiRepository.AtualizarSeminario(
					form.id!,
					form.idUsuario!,
					form.requisitos!,
					form.data!
				);
			} else {
				await SeminarioApiRepository.CriarSeminario(form.idUsuario!, form.requisitos!, form.data!);
			}
			openStateAdicionar = false;
			await carregarSeminarios();
			toast.triggerSuccess('Seminário salvo com sucesso!');
		} catch {
			toast.triggerError('Erro ao salvar seminário.');
		}
	}
</script>

<div class="mb-6 flex grid w-full justify-between md:flex">
	<h1 class="text-xl font-semibold">Gerenciar Seminários</h1>
	<button onclick={() => abrirModal()} class="btn bg-success-500">
		<Plus class="h-4 w-4" /> Novo Seminário
	</button>
</div>

{#if seminarios.length > 0}
	<div class="grid gap-6 md:flex md:flex-col md:items-center">
		{#each seminarios as seminario}
			<div class="preset-tonal w-full rounded-lg p-6 shadow-md md:w-3/4">
				<div class="mb-2 flex items-center justify-between">
					<div>
						<p><strong>Requisitos:</strong> {seminario.requisitos}</p>
						<p><strong>Data:</strong> {DataFormatHandler.FormatDate(seminario.data)}</p>
					</div>
					<button
						class="btn preset-outlined-primary-500"
						onclick={() => {
							openStateDetalhes = true;
							seminarioSelecionado = seminario;
						}}>Ver Detalhes</button
					>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p class="text-center text-gray-500">Nenhum seminário cadastrado.</p>
{/if}

<ModalBase bind:openState={openStateAdicionar}>
	{#snippet conteudo()}
		<form
			method="POST"
			novalidate
			onsubmit={salvarSeminario}
			class="card bg-surface-100-900 space-y-5 p-1"
		>
			<h2 class="h2">{seminarioSelecionado ? 'Editar Seminário' : 'Novo Seminário'}</h2>
			<FormInputComponent
				label="Data"
				placeholder="Data do Seminário"
				tipo="date"
				bind:valor={form.data}
				erros={null}
				constraints={null}
			/>
			<FormTextAreaComponent
				label="Requisitos"
				placeholder="Descreva os requisitos"
				bind:valor={form.requisitos}
				erros={null}
				constraints={null}
			/>
			<button type="submit" class="btn preset-filled-primary-500 w-full">
				{seminarioSelecionado ? 'Atualizar' : 'Cadastrar'}
			</button>
		</form>
	{/snippet}
</ModalBase>

<DetalhesSeminario
	bind:openState={openStateDetalhes}
	seminario={seminarioSelecionado}
	onAction={salvarSeminario}
	alterar={abrirModal}
	getSeminarios={carregarSeminarios}
></DetalhesSeminario>
