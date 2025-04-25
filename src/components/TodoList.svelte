<script lang="ts">
	import { receive, send } from '$lib/transition';
	import { EnumAtividade } from '$model/EnumAtividade';
	import { EnumPrioridadeAtividade } from '$model/EnumPrioridadeAtividade';
	import { CircleDot } from 'lucide-svelte';

	let { todos, remove, mudaEstado, abreDetalhes } = $props();
</script>

<ul class="todos">
	{#each todos as todo (todo.id)}
		<li in:receive={{ key: todo.id }} out:send={{ key: todo.id }}>
			<label
				class="preset-tonal-surface flex items-center justify-between gap-1 rounded border p-1"
			>
				<select
					class="select light:bg-surface-50 w-min md:w-full"
					bind:value={todo.estado}
					onchange={() => {
						mudaEstado(todo.id, todo.estado);
					}}
				>
					<option value={EnumAtividade.Created}>A Fazer</option>
					<option value={EnumAtividade.InProgress}>Em Progresso</option>
					<option value={EnumAtividade.Finished}>Finalizado</option>
				</select>
				<button
					class="btn hover:preset-filled-primary-500 w-full"
					onclick={() => {
						abreDetalhes('Detalhes', todo.id);
					}}
				>
					{todo.nome}
					{#if todo.prioridade === EnumPrioridadeAtividade.Baixa}
						<CircleDot class="fill-current text-success-500" />
					{:else if todo.prioridade === EnumPrioridadeAtividade.Media}
						<CircleDot class="fill-current text-warning-500" />
					{:else if todo.prioridade === EnumPrioridadeAtividade.Alta}
						<CircleDot class="fill-current text-error-500" />
					{/if}
				</button>
			</label>
		</li>
	{/each}
</ul>
