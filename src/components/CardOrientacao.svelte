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
	<div class="flex items-center justify-between">
		<h3 class="truncate text-lg font-semibold">{relatorio.titulo || 'Sem título'}</h3>
		<button
			class="btn preset-outlined-primary-500"
			onclick={() => abrirModal('Detalhes', relatorio)}
		>
			Ver detalhes
		</button>
	</div>

	<div class="text-muted-foreground mt-2 text-sm">
		<p class="line-clamp-2">{relatorio.descricao || 'Sem descrição.'}</p>
	</div>

	<div class="text-muted-foreground mt-3 flex items-center gap-4 text-sm">
		<div class="flex items-center gap-1">
			<CalendarDays class="h-4 w-4" />
			<span>{DataFormatHandler.FormatDate(relatorio.dataRealizacao)}</span>
		</div>
		<div class="flex items-center gap-1">
			<Clock class="h-4 w-4" />
			<span>{relatorio.duracaoEncontro} Horas</span>
		</div>
	</div>
</div>
