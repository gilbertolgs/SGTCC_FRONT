<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { storeLogin } from "../routes/stores";
	import type User from "$model/User";

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

	let usuarioLogado: User | null;

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
	let classesActive = $derived((href: string) =>
		href === $page.url.pathname
			? "dark:!text-secondary-500 !text-primary-500"
			: "",
	);
</script>

{#if diretorios}
	<ul class="grid grid-flow-col gap-6">
		{#each diretorios as diretorio}
			<li class="">
				<a
					href={diretorio.link}
					class="dark:hover:text-secondary-500 hover:text-primary-500 transition-all duration-300 whitespace-nowrap {classesActive(
						diretorio.link,
					)}"
				>
					<span>{diretorio.nome}</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}
