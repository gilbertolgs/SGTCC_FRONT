<script lang="ts">
	import type Duvida from '$model/Duvida';
	import { EnumVisibilidadeDuvida } from '$model/EnumVisibilidadeDuvida';
	import { Pencil, Trash } from 'lucide-svelte';
	import { storeLogin } from '../stores';

	let usuarioLogado = $derived($storeLogin);

	interface Props {
		abrirModal: Function;
		duvida: Duvida;
	}
	let { abrirModal, duvida }: Props = $props();
</script>

<div class="preset-tonal rounded p-3 shadow-md transition-all hover:shadow-lg">
	<div class="flex items-center justify-between">
		<h3 class="truncate text-lg font-semibold">{duvida.texto}</h3>
		<button
			class="btn preset-outlined-primary-500"
			onclick={() => abrirModal('Detalhes', duvida)}
		>
			Ver detalhes
		</button>
	</div>

	<div class="text-muted-foreground mt-2 text-sm">
		<p>Visibilidade: {EnumVisibilidadeDuvida[duvida.visibilidade]}</p>
	</div>

	{#if usuarioLogado && usuarioLogado.id == duvida.idUsuario}
		<div class="mt-3 flex gap-3">
			<button
				class="btn preset-outlined-primary-500"
				onclick={() => abrirModal('Adicionar', duvida)}
			>
				<Pencil class="h-4 w-4 mr-1" />
				Editar
			</button>
			<button
				class="btn preset-outlined-error-500"
				onclick={() => abrirModal('Apagar', duvida)}
			>
				<Trash class="h-4 w-4 mr-1" />
				Excluir
			</button>
		</div>
	{/if}
</div>
