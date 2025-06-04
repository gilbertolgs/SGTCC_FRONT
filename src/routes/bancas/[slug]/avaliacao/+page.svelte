<script lang="ts">
	import { onMount } from 'svelte';
	import DocumentoApiRepository from '$repository/openapi/DocumentoApiRepository';
	import NotaApiRepository from '$repository/openapi/NotaApiRepository';
	import { EnumTipoNota } from '$model/EnumTipoNota';

	let { data } = $props();
	const idBanca = data.idBanca;

	let idProjeto: number;
	let idAluno: number;
	let idAvaliadorBanca: number;

	// Fetched Data
	let categorias: any[] = [];
	let camposPorCategoria: Record<string, any[]> = {};
	let notas: Record<number, number> = {};

	let carregando = true;

	onMount(async () => {
		try {
			const categoriasResponse = await DocumentoApiRepository.PegarCategorias();
			categorias = categoriasResponse;

			for (const cat of categorias) {
				const campos = await DocumentoApiRepository.PegarPorCategoria(cat.id);
				camposPorCategoria[cat.valor] = campos;
			}
		} catch (error) {
			console.error(error);
		} finally {
			carregando = false;
		}
	});

	async function salvarNotas() {
		for (const categoria in camposPorCategoria) {
			for (const campo of camposPorCategoria[categoria]) {
				const nota = notas[campo.id];
				if (nota != null) {
					await NotaApiRepository.CriarNotaDocumentoAluno(
						idAvaliadorBanca,
						campo.id,
						idAluno,
						nota,
						EnumTipoNota.QuantoAoProjeto
					);
				}
			}
		}
		alert('Notas salvas com sucesso!');
	}
</script>

{#if carregando}
	<p>Carregando campos...</p>
{:else}
	<div class="space-y-8">
		{#each categorias as categoria}
			<div class="rounded border bg-gray-100 p-4 shadow">
				<h2 class="mb-4 text-xl font-semibold">{categoria.valor}</h2>
				<div class="space-y-4">
					{#each camposPorCategoria[categoria.valor] as campo}
						<div class="flex items-center justify-between">
							<label class="font-medium">{campo.campo}</label>
							<input
								type="number"
								min="0"
								max="10"
								step="0.1"
								class="input w-24"
								bind:value={notas[campo.id]}
							/>
						</div>
					{/each}
				</div>
			</div>
		{/each}

		<div class="text-center">
			<button class="btn preset-filled-success-500 mt-4 w-full md:w-1/2" on:click={salvarNotas}>
				Salvar Avaliação
			</button>
		</div>
	</div>
{/if}
