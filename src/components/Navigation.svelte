<script lang="ts">
	import logo from "$icons/logo.svg";
	import CloseIcon from "$icons/xmark-solid.svelte";

	import {
		Avatar,
		getDrawerStore,
		ListBox,
		ListBoxItem,
		LightSwitch,
	} from "@skeletonlabs/skeleton";
	import { page } from "$app/stores";
	import type User from "../model/User";
	import { storeLogin } from "../routes/stores";
	import { onMount } from "svelte";
	import imgPerfil from "$lib/images/imgPerfil";
	import { enumPapel } from "$model/EnumPapel";

	const drawerStore = getDrawerStore();

	let diretorios: null | { link: string; nome: string; icon: string }[] =
		$state(null);

	$effect.pre(() => {
		diretorios = [
			{
				link: "/biblioteca",
				nome: "Biblioteca de Projetos",
				icon: "library_books",
			},
		];
	});

	let diretoriosPadrao = $derived([
		{
			link: "/biblioteca",
			nome: "Biblioteca de Projetos",
			icon: "library_books",
		},
	]);

	let diretoriosAdmin = $derived([
		{
			link: "/biblioteca",
			nome: "Biblioteca de Projetos",
			icon: "library_books",
		},
		{
			link: "/usuario/cadastrar-usuario",
			nome: "Cadastrar Usuário",
			icon: "person_add",
		},
		{
			link: "/cursos",
			nome: "Gerenciar Cursos",
			icon: "post_add",
		},
	]);

	let usuarioLogado: User | null = $state(null);

	function getData() {
		storeLogin.subscribe((value) => {
			usuarioLogado = value;

			if (usuarioLogado) {
				if (usuarioLogado.papel === enumPapel.Admin) {
					diretorios = diretoriosAdmin;
				} else {
					const diretoriosUsuario = [
						{
							link: "/biblioteca",
							nome: "Biblioteca de Projetos",
							icon: "library_books",
						},
						{
							link: "/usuario/" + usuarioLogado.id + "/projetos",
							nome: "Seus Projetos",
							icon: "menu_book",
						},
						/*{
							link: 'bancas',
							nome: 'Bancas',
							icon: 'groups'
						},*/
					];
					diretorios = diretoriosUsuario;
				}
			} else {
				diretorios = diretoriosPadrao;
			}
		});
	}

	onMount(getData);

	// let diretorios = [
	// 	{ texto: "Projetos", ancora: "/projetos" },
	// 	{ texto: "Atividades", ancora: "/atividades" },
	// 	{ texto: "Calendário", ancora: "/calendario" },
	// ];

	let classesActive = $derived((href: string) =>
		href === $page.url.pathname ? "!variant-filled-primary" : "",
	);
</script>

<div class="flex flex-col p-4 h-screen">
	<header class="flex">
		<img src={logo} alt="LOGO SGTCC" class="h-20" />
		<button
			type="button"
			class="ml-auto w-9 fill-current hover:text-primary-500 transition-all"
			onclick={() => {
				drawerStore.close();
			}}
		>
			<span><CloseIcon /></span>
		</button>
	</header>
	{#if diretorios}
		<section class="p-4">
			<nav class="list-nav">
				<ul>
					<li>
						{#each diretorios as diretorio}
							<a
								class="w-full h-full mt-2 {classesActive(
									diretorio.link,
								)}"
								href={diretorio.link}
								onclick={() => {
									drawerStore.close();
								}}
							>
								{diretorio.nome}
							</a>
						{/each}
					</li>
				</ul>
			</nav>
		</section>
	{/if}
	<footer class="mt-auto">
		<LightSwitch />
		{#if usuarioLogado != null}
			<div
				class="rounded m-2 p-2 bg-gradient-to-tr from-primary-400 to-primary-700"
			>
				<div
					class="flex p-2 rounded-xl md:w-1/2 variant-glass-surface grid"
				>
					<div class="flex m-2">
						<Avatar
							src={imgPerfil}
							width="w-8"
							rounded="rounded-full"
						/>
						<span class="my-auto m-2">{usuarioLogado.nome}</span>
					</div>
					<a
						href="/usuario/{usuarioLogado.id}"
						onclick={() => {
							drawerStore.close();
						}}
					>
						<div
							class="p-2 w-full hover:bg-primary-500 transition-all duration-300 rounded"
						>
							Perfil
						</div>
					</a>
					<hr />
					<a
						href="/usuario/logout"
						onclick={() => {
							drawerStore.close();
						}}
					>
						<div
							class="p-2 w-full hover:bg-error-500 hover:text-current transition-all duration-300 rounded text-error-500"
						>
							Sair
						</div>
					</a>
				</div>
			</div>
		{:else}
			<a
				href="/usuario/login"
				onclick={() => {
					drawerStore.close();
				}}
			>
				<div
					class="font-semibold p-2 m-2 hover:bg-primary-500 transition-all duration-300 rounded"
				>
					Realizar Login
				</div>
			</a>
		{/if}
	</footer>
</div>
