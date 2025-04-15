<script lang="ts">
	import TableBaseComponent from '$components/TableBaseComponent.svelte';
	import DataFormatHandler from '$lib/DataFormatHandler';
	import type Arquivo from '$model/Arquivo';
	import { onMount } from 'svelte';

	interface Props {
		arquivos: Arquivo[] | null;
		selecionaLinha: Function;
		linhaSelecionada: number;
	}
	let { arquivos, selecionaLinha, linhaSelecionada }: Props = $props();
	let tamanhoTotal = $state('0');

	$effect(() => {
		if (arquivos) {
			const tamanhoTotalBytes = arquivos.reduce((acc, file) => acc + file.tamanho, 0);
			tamanhoTotal = DataFormatHandler.FormatBytes(tamanhoTotalBytes, 1);
		}
	});

	const camposCabecalho = ['Extensão', 'Nome', 'Ultima Alteração', 'Tamanho'];
</script>

{#snippet cabecalhoArquivos()}
	<thead>
		<tr>
			{#each camposCabecalho as campo}
				<td>{campo}</td>
			{/each}
		</tr>
	</thead>
{/snippet}
{#if arquivos}
	<TableBaseComponent
		{camposCabecalho}
		arrObjetosTamanho={arquivos.length}
		labelObjeto="Arquivos, {tamanhoTotal} Utilizados"
	>
		{#snippet cabecalho()}
			{@render cabecalhoArquivos()}
		{/snippet}
		{#snippet corpo()}
			{#if arquivos}
				{#each arquivos as arquivo}
					<tr
						class=" {linhaSelecionada === arquivo.idExterno
							? 'preset-filled-primary-500'
							: 'even:preset-tonal'} hover:cursor-pointer"
						onclick={() => {
							selecionaLinha(arquivo);
						}}
					>
						<td>{arquivo.extensao}</td>
						<td>{arquivo.nomeOriginal}</td>
						<td>{arquivo.ExibeUltimaAlteracao()}</td>
						<td>{DataFormatHandler.FormatBytes(arquivo.tamanho, 1)}</td>
					</tr>
				{/each}
			{/if}
		{/snippet}
	</TableBaseComponent>
{:else}
	<TableBaseComponent
		{camposCabecalho}
		arrObjetosTamanho={1}
		labelObjeto="Arquivos, {tamanhoTotal} Utilizados"
	>
		{#snippet cabecalho()}
			{@render cabecalhoArquivos()}
		{/snippet}
		{#snippet corpo()}
			<tr class="">
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
