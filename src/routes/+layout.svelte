<script lang="ts">
	import { ToastProvider } from '@skeletonlabs/skeleton-svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import Header from '../components/Header.svelte';

	import Cookie from '$model/Cookie';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import { storeLogin } from '../stores';
	let { children } = $props();

	async function reautenticar() {
		//WARN mudar isso
		const userEmail = Cookie.getCookie("email");
		
		if (userEmail) {
			storeLogin.subscribe(async (value) => {
				if (!value) {
					const user = await UsuarioRepository.PegarPorEmailLogin(userEmail);
					if (user) {
						storeLogin.set(user);
					}
				}
			})
		}
	}
	onMount(reautenticar);
</script>

<Header />
<ToastProvider stateInfo="bg-warning-900">
	{@render children()}
</ToastProvider>
