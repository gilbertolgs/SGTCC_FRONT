<script lang="ts">
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import Toaster from '$lib/ToastHandler';
	import { EnumEstadoProjeto } from '$model/EnumEstadoProjeto';
	import type Projeto from '$model/Projeto';
	import SeminarioApiRepository from '$repository/openapi/SeminarioApiRepository';
	import ProjetoRepository from '$repository/ProjetoRepository';
	import { Check, X as IconX, ImagePlus, Pencil } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import AlterarImagemProjeto from '../components/AlterarImagemProjeto.svelte';
	import FormAlterarProjeto from '../components/FormAlterarProjeto.svelte';

	const toast = new Toaster(getContext);

	interface Props {
		projeto: Projeto;
		getProjeto: Function;
		data: any;
	}
	let { projeto, getProjeto, data }: Props = $props();

	let openStateFinalizar = $state(false);
	let openStateCancelar = $state(false);
	let openStateImagem = $state(false);
	let openStateAlterar = $state(false);

	function abrirModal(modal: string, argumentos: any = null) {
		switch (modal) {
			case 'Finalizar':
				openStateFinalizar = !openStateFinalizar;
				break;
			case 'Cancelar':
				openStateCancelar = !openStateCancelar;
				break;
			case 'Imagem':
				openStateImagem = !openStateImagem;
				break;
			case 'Alterar':
				openStateAlterar = !openStateAlterar;
				break;

			default:
				break;
		}
	}

	async function alterarProjeto(
		idProjeto: number,
		nome: string,
		descricao: string,
		justificativa: string,
		tags: string[]
	) {
		console.log('tags', tags);

		try {
			const response = await ProjetoRepository.AlterarProjeto(
				idProjeto,
				nome,
				descricao,
				justificativa,
				tags
			);
			openStateAlterar = false;
			toast.triggerSuccess('Projeto alterado com sucesso!');
			await getProjeto();
		} catch (error) {
			openStateAlterar = false;
			toast.triggerError('Ocorreu um erro ao tentar alterar projeto!');
			console.log(error);
		}
	}

	async function finalizarProjeto() {
		try {
			const response = await ProjetoRepository.FinalizarProjeto(projeto.id);
			openStateFinalizar = false;
			toast.triggerSuccess('Projeto Finalizado com sucesso!');
			await getProjeto();
		} catch (error) {
			toast.triggerError('Ocorreu um erro ao tentar finalizar projeto!');
			console.log(error);
		}
	}

	async function cancelarProjeto() {
		try {
			const response = await ProjetoRepository.CancelarProjeto(projeto.id);
			openStateCancelar = false;
			toast.triggerSuccess('Projeto Cancelado com sucesso!');
			await getProjeto();
		} catch (error) {
			toast.triggerError('Ocorreu um erro ao tentar cancelar projeto!');
			console.log(error);
		}
	}

	SeminarioApiRepository.PegarPorId(1).then((data)=> {
		console.log('data');
		console.log(data);
	});
</script>

<ConfirmDialog
	bind:openState={openStateFinalizar}
	titulo="Tem certeza que deseja finalizar esse projeto?"
	texto="Projeto: {projeto.nome}"
	funcao={finalizarProjeto}
/>

<ConfirmDialog
	bind:openState={openStateCancelar}
	titulo="Tem certeza que deseja cancelar esse projeto?"
	texto="Projeto: {projeto.nome}"
	funcao={cancelarProjeto}
/>

<AlterarImagemProjeto bind:openState={openStateImagem} {projeto} {getProjeto} />
<FormAlterarProjeto
	AlterarCadastro={alterarProjeto}
	bind:openState={openStateAlterar}
	{projeto}
	{data}
/>

<div>
	<div class="grid md:flex md:justify-center">
		<div class="preset-tonal flex w-full rounded-lg p-6 shadow-md">
			<div>
				<div class="mb-4">
					<span class="text-surface-700-300 font-bold">Nome:</span>
					<p class="">{projeto.nome}</p>
				</div>

				<div class="mb-4">
					<span class="text-surface-700-300 font-bold">Descrição:</span>
					<p class="">{projeto.descricao}</p>
				</div>

				<div class="mb-4">
					<span class="text-surface-700-300 font-bold">Justificativa:</span>
					<p class="">{projeto.justificativa}</p>
				</div>

				<div class="mb-4">
					<span class="text-surface-700-300 font-bold">Data de Início:</span>
					<p class="">{DataFormatHandler.FormatDate(projeto.dataInicio)}</p>
				</div>

				{#if projeto.tags && projeto.tags.length > 0}
					<div class="mb-4">
						<span class="text-surface-700-300 font-bold">Tags:</span>
						<div class="flex flex-wrap gap-2">
							{#each projeto.tags as tag}
								<span class="chip preset-filled-primary-500 flex flex-wrap">{tag.nome}</span>
							{/each}
						</div>
					</div>
				{/if}

				<div class="mb-4">
					<span class="text-surface-700-300 font-bold">Estado:</span>
					<p class="">{projeto.ExibeStatus()}</p>
				</div>
			</div>
			{#if projeto.estado == EnumEstadoProjeto.EmProgresso || projeto.estado == EnumEstadoProjeto.Criado}
				<div class="mb-auto ml-auto grid gap-2">
					<button
						onclick={() => {
							abrirModal('Alterar');
						}}
						class="btn preset-outlined-primary-500"><Pencil /> Alterar Projeto</button
					>
					<button
						onclick={() => {
							abrirModal('Imagem');
						}}
						class="btn preset-outlined-primary-500"><ImagePlus /> Alterar Imagem</button
					>
					<button
						onclick={() => {
							abrirModal('Finalizar');
						}}
						class="btn preset-outlined-primary-500 mt-3"><Check /> Finalizar Projeto</button
					>
					<button
						onclick={() => {
							abrirModal('Cancelar');
						}}
						class="btn preset-outlined-error-500"><IconX /> Cancelar Projeto</button
					>
				</div>
			{/if}
		</div>
	</div>
	<img class="m-2 mx-auto w-[90%] rounded md:w-1/2" src={projeto.ExibeImagem()} alt="" />
</div>
