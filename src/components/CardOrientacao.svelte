<script lang="ts">
	import DataFormatHandler from '$lib/DataFormatHandler';
	import type Relatorio from '$model/Relatorio';
	import { CalendarDays, Clock } from 'lucide-svelte';

	interface Props {
		relatorio: Relatorio;
		abrirModal: Function;
	}

	let { relatorio, abrirModal }: Props = $props();
</script>

<div class="preset-tonal rounded p-3 shadow-md transition-all hover:shadow-lg">
	<div class="flex items-start justify-between">
		<!-- Question Text + Metadata -->
		<div class="flex flex-col gap-1 max-w-xl">
			<h3 class="text-lg font-semibold truncate">
				<button
					class="hover:underline text-left"
					on:click={() => abrirModal('Detalhes', duvida)}
				>
					{duvida.texto}
				</button>
			</h3>
			<p class="text-sm text-muted-foreground">
				Visibilidade: <span class="font-medium">{EnumVisibilidadeDuvida[duvida.visibilidade]}</span>
			</p>
		</div>

		<!-- Action Buttons (Edit/Delete) -->
		{#if usuarioLogado && usuarioLogado.id === duvida.idUsuario}
			<div class="ml-4 flex gap-2">
				<button
					class="btn-icon hover:opacity-80 transition"
					on:click={() => abrirModal('Adicionar', duvida)}
					title="Editar dúvida"
				>
					<Pencil class="w-5 h-5" />
				</button>
				<button
					class="btn-icon hover:opacity-80 transition"
					on:click={() => abrirModal('Apagar', duvida)}
					title="Apagar dúvida"
				>
					<Trash class="w-5 h-5" />
				</button>
			</div>
		{/if}
	</div>
</div>
