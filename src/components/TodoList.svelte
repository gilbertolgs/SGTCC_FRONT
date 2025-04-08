<script>
	import { receive, send } from '$lib/transition';

	let { todos, remove } = $props();
</script>

<ul class="todos">
	{#each todos as todo (todo.id)}
		<li class={{ done: todo.estado }} in:receive={{ key: todo.id }} out:send={{ key: todo.id }}>
			<label>
				<input class="checkbox" type="checkbox" bind:checked={todo.estado} />
				<span>{todo.nome}</span>
				<button onclick={() => remove(todo)} aria-label="Remove"></button>
			</label>
		</li>
	{/each}
</ul>
