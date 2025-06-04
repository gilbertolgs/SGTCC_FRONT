<script lang="ts">
	import { page } from '$app/state';
	import LogoMono from '$images/LogoMono.svelte';
	import { NavigationLinks } from '$lib/Navigation';
	import type LoggedUser from '$model/LoggedUser';
	import { storeLogin } from '../stores';
	import HeaderMobile from './HeaderMobile.svelte';
	import LightSwitch from './LightSwitch.svelte';
	import PerfilHeader from './PerfilHeader.svelte';

	// let usuarioLogado: LoggedUser | null = $state<LoggedUser | null>(null);
	let usuarioLogado = $derived($storeLogin);
	//Gambiarra pro Typescript não reclamar
	let imagemDoUsuario: string = $derived(
		(usuarioLogado as LoggedUser | null)?.ExibeImagem?.() ?? ''
	);

	// storeLogin.subscribe((value) => {
	// 	usuarioLogado = value;

	// 	if (usuarioLogado) {
	// 		imagemDoUsuario = usuarioLogado.ExibeImagem();
	// 	}
	// });

	let links = $derived(new NavigationLinks(usuarioLogado).PegarLinks());

	function nomeRotaEIgualPaginaAtual(nome: string, pagina: string) {
		if (nome.includes('projeto') && pagina.includes('projeto')) return true;
		if (nome.includes('banca') && pagina.includes('banca')) return true;

		return nome === pagina;
	}
</script>

{#snippet rota(label: string, href: string, fechaCabecalho: Function | null = null)}
	<a
		{href}
		class="btn text-sm font-semibold {nomeRotaEIgualPaginaAtual(page.url.pathname, href)
			? 'preset-filled-primary-500'
			: 'hover:preset-tonal'}"
		onclick={() => {
			if (fechaCabecalho) fechaCabecalho();
		}}
	>
		{label}
	</a>
{/snippet}
{#snippet logo()}
	<a
		href="/"
		class="hover:text-primary-500 flex gap-3 fill-current font-sans text-5xl font-extrabold transition-all select-none"
	>
		<span class="w-10">
			<LogoMono />
		</span>
		<span class="my-auto text-3xl antialiased"> SGTCC </span>
	</a>
{/snippet}

<header
	class="sticky top-0 z-100 grid w-full flex-col space-y-4 p-4 shadow backdrop-blur-3xl md:hidden"
>
	<HeaderMobile {logo} {rota} {links} bind:usuarioLogado />
</header>

<header
	class="sticky top-0 z-100 hidden w-full flex-col space-y-4 p-4 shadow backdrop-blur-3xl md:flex"
	role="toolbar"
	data-testid="app-bar"
>
	<section
		class="flex grid-cols-[auto_1fr_auto] items-center justify-between gap-4"
		data-testid="app-bar-toolbar"
	>
		<div class="flex space-x-4 rtl:space-x-reverse">
			{@render logo()}
			<nav class="flex items-center">
				{#each links as { label, href }}
					{@render rota(label, href)}
				{/each}
			</nav>
		</div>
		<div class="grid grid-flow-col items-center gap-5">
			<LightSwitch />
			<PerfilHeader {usuarioLogado} {imagemDoUsuario} />
		</div>
	</section>
</header>
