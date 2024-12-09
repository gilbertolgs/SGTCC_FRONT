<script lang="ts">
	import {
		AppShell,
		AppBar,
		initializeStores,
		getDrawerStore,
		getToastStore,
		storePopup,
		Toast,
		Drawer,
		Avatar,
		Modal,
		popup,
		setInitialClassState,
		autoModeWatcher,
		LightSwitch,
		ListBox,
		ListBoxItem,
		type DrawerSettings,
		type PopupSettings,
	} from "@skeletonlabs/skeleton";

	import {
		computePosition,
		autoUpdate,
		offset,
		shift,
		flip,
		arrow,
	} from "@floating-ui/dom";

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	import "../app.postcss";

	import HamburguerIcon from "$icons/bars-solid.svelte";
	import logo from "$lib/images/logoVazia.png";
	import Titulo from "$icons/titulo.svelte";
	import LogoBranca from "$icons/logo-branca.svelte";
	import Seta from "$icons/seta.svelte";

	import Nav from "$components/Nav.svelte";

	import Navigation from "$components/Navigation.svelte";
	import type User from "../model/User";
	import { connectionError, storeLogin } from "./stores";
	import Api from "$repository/axiosInstance";
	import Cookie from "$model/Cookie";
	import ConnectionError from "./errors/+page.svelte";
	import { onMount } from "svelte";
	import imgPerfil from "$lib/images/imgPerfil";
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	initializeStores();

	const drawerStore = getDrawerStore();

	const sideBar: DrawerSettings = {
		id: "sideBar-1",
		position: "right",
		bgDrawer: "bg-surface-100 dark:bg-surface-500",
		bgBackdrop: "bg-gradient-to-tr from-primary-400/50 to-secondary-800/50",
		width: "w-screen md:w-[480px]",
		padding: "p-r-4",
		rounded: "rounded-l-xl",
	};

	let connectionErrorValue: number;

	connectionError.subscribe((value) => {
		connectionErrorValue = value;
	});

	async function getData() {
		const userEmail = Cookie.getCookie("email");
		if (userEmail) {
			const user = await Api.get("usuarios/email", { email: userEmail });
			if (user) {
				storeLogin.set(user);
			}
		}
	}
	onMount(getData);

	let usuarioLogado: User | null = $state(null);

	storeLogin.subscribe((value) => {
		usuarioLogado = value;
	});

	let comboboxValue: string;

	const popupCombobox: PopupSettings = {
		event: "click",
		target: "popupCombobox",
		placement: "bottom",
		closeQuery: ".listbox-item",
	};
</script>

<svelte:head>
	{@html "<script>(" + setInitialClassState.toString() + ")();</script>"}
</svelte:head>

<Toast />
<Modal />

<Drawer>
	<Navigation></Navigation>
</Drawer>
<AppShell>
	{#snippet header()}
	
			<AppBar
				gridColumns="grid-cols-3"
				slotDefault="place-self-center"
				slotTrail="place-content-end"
			>
				{#snippet lead()}
					
						<a href="/" class="grid grid-flow-col">
							<div
								class="fill-current transition-all hover:text-primary-500 duration-300"
							>
								<div class="hidden md:block h-10">
									<Titulo />
								</div>
								<div class="md:hidden h-10">
									<LogoBranca />
								</div>
							</div>
							<!-- <img src="{titulo}" alt="Logo" class="h-10 fill-current text-primary-500"> -->
						</a>
						<!--
						<button
							type="button"
							class="md:w-9 w-6 fill-current hover:text-primary-500 hover:cursor-pointer hover:scale-110 transition-all"
							on:click={() => {
								drawerStore.open(sideBar);
							}}
						>
							<span>
								<HamburguerIcon />
							</span>
						</button>
						-->
					
					{/snippet}
				{#snippet trail()}
					
						<div class="hidden md:grid grid-flow-col gap-3">
							<div class="my-auto grid grid-flow-col gap-2">
								<Nav/>
								<LightSwitch />
							</div>
							{#if usuarioLogado != null}
								<button
									class="flex p-2 rounded-xl fill-current hover:text-primary-500 transition-all ease-linear duration-300"
									use:popup={popupCombobox}
								>
									<Avatar
										src={imgPerfil}
										width="w-8"
										rounded="rounded-full"
									/>
									<div class="my-auto mx-1 flex">
										<span class="capitalize whitespace-nowrap">{usuarioLogado.nome}</span>
										<span class="w-5 mt-auto">
											<Seta/>
										</span>
									</div>
								</button>
			
								<div
									class="card md:w-20 shadow-xl py-2"
									data-popup="popupCombobox"
								>
									<a
										href="/usuario/{usuarioLogado.id}">
										<div class="p-2 w-full hover:bg-primary-500 transition-all duration-300">
											Perfil
										</div>
										</a>
									<hr/>
									<a
										href="/usuario/logout">
										<div class="p-2 w-full hover:bg-error-500 hover:text-current transition-all duration-300 text-error-500">
											Sair
										</div>
										</a>
					
									<div class="arrow bg-surface-100-800-token"></div>
								</div>
							{:else}
								<a
									href="/usuario/login"
									class="btn variant-filled-primary font-semibold leading-6 hover:brightness-110"
									>Realizar Login</a
								>
							{/if}
						</div>
						<button class="block md:hidden h-10 fill-current hover:text-primary-500"
						onclick={() => {
					drawerStore.open(sideBar);
				}}>
							<HamburguerIcon/>
						</button>
					
					{/snippet}
			</AppBar>
		
	{/snippet}
	{@render children?.()}
</AppShell>
