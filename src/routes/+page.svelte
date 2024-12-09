<script lang="ts">
	import { pageName } from "./stores";
	import CheckIcon from "$icons/check.svelte";
	import logo from "$lib/images/logoVazia.png";
	import LogoIcon from "$icons/logo.svg";

	const mockdata = [
		{
			title: "Extreme performance",
			description:
				"This dust is actually a powerful poison that will even make a pro wrestler sick, Regice cloaks itself with frigid air of -328 degrees Fahrenheit",
			icon: "IconGauge",
		},
		{
			title: "Privacy focused",
			description:
				"People say it can run at the same speed as lightning striking, Its icy body is so cold, it will not melt even if it is immersed in magma",
			icon: "IconGauge",
		},
		{
			title: "No third parties",
			description:
				"They’re popular, but they’re rare. Trainers who show them off recklessly may be targeted by thieves",
			icon: "IconGauge",
		},
		{
			icon: "IconGauge",
			title: "Secure by default",
			description:
				"Although it still can’t fly, its jumping power is outstanding, in Alola the mushrooms on Paras don’t grow up quite right",
		},
	];
</script>

<svelte:head>
	<title>{pageName} - Página Inicial</title>
	<meta name="Inicio" content="Página inicial do sistema" />
</svelte:head>

<div
	class="grid bg-gradient-to-b dark:from-surface-700 dark:to-primary-500 from-surface-200 to-primary-500 h-full w-full"
>
	<div class="mx-auto grid md:grid-cols-2">
		<div class="space-y-4 p-10">
			<h1 class="text-3xl md:text-5xl font-bold">
				<!-- Um <span class="relative px-1 md:px-3 py-1 bg-surface-300-600-token">Sistema</span> de gestão para TCCs -->
				Um
				<span
					class="relative px-1 md:px-3 py-1 bg-surface-300-600-token"
					>TCC</span
				> para todos Gerenciar
			</h1>
			<p class="max-w-xl opacity-60">
				Sistema para gestão de Trabalhos de Conclusão de Curso que
				simplifica o processo de elaboração, acompanhamento e entrega do
				seu trabalho, com o objetivo de facilitar a comunicação entre
				alunos e orientadores, organizar prazos e recursos, e garantir
				que você esteja sempre no caminho certo.
			</p>
			<ul class="grid gap-2">
				<li class="flex">
					<div class="w-12 h-auto"><span><CheckIcon /></span></div>
					<span>
						<b>Painel de Controle Intuitivo</b> – Acesse todas as informações
						do seu TCC em um só lugar.
					</span>
				</li>
				<li class="flex">
					<div class="w-12 h-auto"><span><CheckIcon /></span></div>
					<span>
						<b>Calendário de Prazos</b> – Marque datas importantes e
						receba lembretes para não perder nenhuma entrega.
					</span>
				</li>
				<li class="flex">
					<div class="w-12 h-auto"><span><CheckIcon /></span></div>
					<span>
						<b>Relatórios de Progresso</b> – Acompanhe o status do seu
						TCC e visualize seu avanço.
					</span>
				</li>
			</ul>
			<div class="flex flex-wrap gap-4 mt-auto">
				<a
					class="btn md:btn-lg w-full md:w-fit variant-filled-primary"
					href="/usuario/login">Comece já</a
				>
			</div>
		</div>

		<!-- <img src={logo} alt="Logo do Sistema" class="w-auto h-3/4 mx-auto p-6 hidden md:block" /> -->
		<img
			src={LogoIcon}
			alt="Logo do Sistema"
			class="w-auto h-3/4 mx-auto p-6 hidden md:block"
		/>
	</div>

	<!-- <div class="container mx-auto max-w-screen-lg">
		<div class="grid grid-cols-1 md:grid-cols-12">
			<div class="space-y-4 md:col-span-4 p-4">
				<div class="text-xl md:text-3xl font-bold">
					Integrate effortlessly with any technology stack
				</div>
				<p class="max-w-xl opacity-60 mx-auto">
					Every once in a while, you’ll see a Golbat that’s missing
					some fangs. This happens when hunger drives it to try biting
					a Steel-type Pokémon.
				</p>
				<button class="btn md:btn-lg variant-filled-tertiary"
					>Get Started</button
				>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-8">
				{#each mockdata as feature}
					<div class="p-4 space-y-2">
						<div
							class="variant-filled-tertiary text-2xl p-2 w-fit rounded-token"
						>
							<img src="{feature.icon}" alt="">
						</div>

						<div class="font-semibold">
							{feature.title}
						</div>
						<div class="text-sm opacity-60">
							{feature.description}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div> -->
</div>
