<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import LoginHandler from '$lib/LoginHandler';
	import { storeLogin } from '../../stores';

	LoginHandler.Deslogar();
	goto('/');
	// storeLogin.subscribe((value) => {
	// 	if (value == null) {
	// 		goto('/');
	// 	} else {
	// 		invalidateAll();
	// 	}
	// });
</script>
