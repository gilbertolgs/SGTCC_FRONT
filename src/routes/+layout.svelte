<script lang="ts">
	import { ToastProvider } from '@skeletonlabs/skeleton-svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import Header from '../components/Header.svelte';

	import Cookie from '$model/Cookie';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import { storeLogin } from '../stores';
	import { onNavigate } from '$app/navigation';
	let { children } = $props();

	async function reautenticar() {
		//WARN mudar isso
		const userEmail = Cookie.getCookie("email");
		
		if (userEmail) {
			storeLogin.subscribe(async (value) => {
				if (!value) {
					const user = await UsuarioRepository.PegarPorEmailLogin(userEmail);
					if (user) {
						storeLogin.update(value => user);
					}
				}
			})
		}
	}
	onMount(reautenticar);

	onNavigate((navigation) => {
		if (!document.startViewTransition) return

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve()
				await navigation.complete
			})
		})
	});
</script>

<Header />
<ToastProvider stateInfo="bg-warning-900">
	{@render children()}
</ToastProvider>
