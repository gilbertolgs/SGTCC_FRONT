<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import LoginHandler from '$lib/LoginHandler';
	import { onMount } from 'svelte';
	import { storeLogin } from '../../stores';

	onMount(async () => {
		await LoginHandler.Deslogar();
		goto('/');
	});
	// storeLogin.subscribe((value) => {
	// 	if (value == null) {
	// 		goto('/');
	// 	} else {
	// 		invalidateAll();
	// 	}
	// });
</script>
