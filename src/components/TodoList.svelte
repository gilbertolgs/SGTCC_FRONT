<script lang="ts">
	import { receive, send } from '$lib/transition';
	import { EnumAtividade } from '$model/EnumAtividade';

	let { todos, remove, mudaEstado, abreDetalhes } = $props();
</script>

<ul class="todos">
	{#each todos as todo (todo.id)}
		<li in:receive={{ key: todo.id }} out:send={{ key: todo.id }}>
			<label
				class="preset-tonal-surface flex items-center justify-between gap-1 rounded border p-1"
			>
				<select
					class="md:w-full w-min select light:bg-surface-50"
					bind:value={todo.estado}
					onchange={() => {
						mudaEstado(todo.id, todo.estado);
					}}
				>
					<option value={EnumAtividade.Created}>A Fazer</option>
					<option value={EnumAtividade.InProgress}>Em Progresso</option>
					<option value={EnumAtividade.Finished}>Finalizado</option>
				</select>
				<button class="btn hover:preset-filled-primary-500 w-full">
					{todo.nome}
				</button>
			</label>
		</li>
	{/each}
</ul>
