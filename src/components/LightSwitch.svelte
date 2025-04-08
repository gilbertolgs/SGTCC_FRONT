<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { Moon, Sun } from 'lucide-svelte';

	let checked = $state(false);
	let globalMode: null | string = $state(null);

	$effect(() => {
		const mode = localStorage.getItem('mode') || 'light';
		checked = mode === 'dark';

		globalMode = mode;
	});

	const onCheckedChange = (event: { checked: boolean }) => {
		const mode = event.checked ? 'dark' : 'light';
		document.documentElement.setAttribute('data-mode', mode);
		localStorage.setItem('mode', mode);
		checked = event.checked;

		globalMode = mode;
	};
</script>

<svelte:head>
	<script>
		const mode = localStorage.getItem('mode') || 'light';
		document.documentElement.setAttribute('data-mode', mode);
	</script>
</svelte:head>

<div class="flex gap-1">
	<div class="">
		{#if globalMode == 'light'}
			<Sun />
		{:else if globalMode == 'dark'}
			<Moon />
		{/if}
	</div>
	<Switch {checked} {onCheckedChange}></Switch>
</div>
