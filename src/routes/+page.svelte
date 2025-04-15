<script>
	import BoxReveal from '$components/animation/BoxReveal.svelte';
	import CommentCard from '$components/CommentCard.svelte';
	import Marquee from '$components/Marquee.svelte';
	import ImgLandingPage from '$images/img_landing_page3x.png';
	import LogoMono from '$images/LogoMono.svelte';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { File, FolderOpen, ListTodo, User } from 'lucide-svelte';
	import { pageName } from '../stores';

	const reviews = [
		{
			name: 'Carla Souza',
			body: 'O SGTCC facilitou demais o acompanhamento dos meus orientandos. Interface intuitiva e prática.',
			img: 'https://avatar.vercel.sh/carla'
		},
		{
			name: 'Ricardo Lima',
			body: 'Excelente sistema! Automatizou todo o fluxo de entrega e correção dos TCCs.',
			img: 'https://avatar.vercel.sh/ricardo'
		},
		{
			name: 'Juliana Mendes',
			body: 'Como aluna, achei incrível ter tudo organizado em um só lugar. Parabéns pelo sistema!',
			img: 'https://avatar.vercel.sh/juliana'
		},
		{
			name: 'Marcos Tavares',
			body: 'O SGTCC resolveu muitos dos nossos problemas de comunicação entre alunos e orientadores.',
			img: 'https://avatar.vercel.sh/marcos'
		},
		{
			name: 'Ana Clara',
			body: 'Além de funcional, o sistema é bonito e leve. Dá gosto de usar!',
			img: 'https://avatar.vercel.sh/ana'
		}
	];

	let firstRow = reviews.slice(0, reviews.length / 2);
	let secondRow = reviews.slice(reviews.length / 2);

	const funcionalidades = [
		{
			icone: FolderOpen,
			titulo: 'Armazenamento e Compartilhamento de Documentos',
			descricao: 'Armazene e compartilhe seus documentos diretamente na plataforma.'
		},
		{
			icone: ListTodo,
			titulo: 'Acompanhamento do Andamento',
			descricao: 'Visualize o progresso do seu TCC em tempo real.'
		},
		{
			icone: File,
			titulo: 'Suporte a Diversos Formatos de Arquivos',
			descricao: 'Envie e receba arquivos nos formatos mais comuns.'
		},
		{
			icone: User,
			titulo: 'Acesso Fácil e Intuitivo',
			descricao:
				'A interface intuitiva permite que alunos e orientadores se adaptem rapidamente ao sistema.'
		}
	];
</script>

<svelte:head>
	<title>{pageName}</title>
	<meta name="Página principal" content="página principal" />
</svelte:head>

<section class="body-font">
	<div
		class="justify-items-between container mx-auto flex flex-col items-center px-5 py-24 md:flex-row"
	>
		<div class="h-full w-full max-w-[32rem] items-center justify-center overflow-hidden pt-8">
			<BoxReveal boxColor={'#5046e6'} duration={0.5}>
				<p class="text-[3.5rem] font-semibold">
					SGTCC<span class="text-tertiary-500">.</span>
				</p>
			</BoxReveal>

			<BoxReveal boxColor={'#5046e6'} duration={0.5}>
				<h2 class="text-even">
					O projeto SGTCC visa otimizar e simplificar os processos de elaboração de Trabalhos de
					Conclusão de Curso. Com uma abordagem centralizada, a plataforma oferece um ambiente
					integrado para alunos, orientadores e coordenadores, permitindo acesso a informações
					relevantes e atualizadas em tempo real. O SGTCC melhora a comunicação, promove maior
					transparência e aumenta a eficiência em todas as etapas do TCC.
				</h2>
			</BoxReveal>

			<BoxReveal boxColor={'#5046e6'} duration={0.5}>
				<div class="grid grid-flow-col gap-2">
					<a href="/login" class="btn preset-filled-primary-500"> Comece Já </a>
				</div>
			</BoxReveal>
		</div>
		<img
			class="m-5 rounded object-cover object-center md:w-1/2"
			alt="SGTCC plataforma"
			src={ImgLandingPage}
		/>
	</div>
</section>
<section class="body-font border-t border-gray-200 text-gray-700">
	<div class="container mx-auto flex flex-wrap px-5 py-24">
		<div
			class="preset-tonal text-primary-500 mb-10 w-full overflow-hidden rounded border bg-gradient-to-r fill-current p-5 md:w-1/2"
		>
			<LogoMono />
		</div>
		<div class="-mb-10 flex flex-col flex-wrap text-center lg:w-1/2 lg:py-6 lg:pl-12 lg:text-left">
			<div class="justify-items-between grid h-full items-center lg:items-start">
				{#snippet descricaoFuncoes(
					/** @type {{ icone: any; titulo: string; descricao: string; }} */ funcionalidade
				)}
					<div class="h-full">
						<div
							class="bg-primary-100 text-primary-500 flex items-center justify-start gap-2 rounded-full"
						>
							<funcionalidade.icone />
							<h2 class="title-font text-tertiary-500 text-2xl font-medium">
								{funcionalidade.titulo}
							</h2>
						</div>
						<div class="flex-grow">
							<p class=" leading-relaxed text-3xl">
								{funcionalidade.descricao}
							</p>
						</div>
					</div>
				{/snippet}
				{#each funcionalidades as funcionalidade}
					{@render descricaoFuncoes(funcionalidade)}
				{/each}
			</div>
		</div>
	</div>
</section>
<!-- <section class="body-font border-t border-gray-200 text-gray-700">
	<hr class="hr" />
	<div class="container mx-auto px-5 py-24">
		<div class="mb-5 text-center">
			<h1 class="title-font text-tertiary-500 mb-4 text-2xl font-medium sm:text-3xl">
				Recursos do SGTCC
			</h1>
			<p class="mx-auto text-base leading-relaxed lg:w-3/4 xl:w-2/4">
				O SGTCC oferece uma série de funcionalidades que tornam a gestão de TCCs mais simples,
				eficiente e integrada para todos os envolvidos no processo acadêmico.
			</p>
		</div>
		<div class="-m-4 flex flex-wrap">
			{#snippet cardFeatured(/** @type {{ icone: any; titulo: string; descricao: string; }} */ funcionalidade)}
				<div class="p-4 md:w-1/2 xl:w-1/3">
					<div class="preset-tonal rounded-lg border border-gray-300 p-6">
						<div
							class="bg-primary-100 mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-indigo-500"
						>
							<funcionalidade.icone />
						</div>
						<h2 class="title-font text-tertiary-500 mb-2 text-lg font-medium">
							{funcionalidade.titulo}
						</h2>
						<p class="text-base leading-relaxed">
							{funcionalidade.descricao}
						</p>
					</div>
				</div>
			{/snippet}
			{#each funcionalidades as funcionalidade}
				{@render cardFeatured(funcionalidade)}
			{/each}
		</div>
	</div>
</section> -->
<section
	class="bg-background relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border py-20 md:shadow-xl"
>
	<Marquee pauseOnHover class="[--duration:20s]">
		{#each firstRow as item}
			<CommentCard {...item} />
		{/each}
	</Marquee>
	<Marquee reverse pauseOnHover class="[--duration:20s]">
		{#each secondRow as item}
			<CommentCard {...item} />
		{/each}
	</Marquee>
	<div
		class="dark:from-background pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white"
	></div>
	<div
		class="dark:from-background pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white"
	></div>
</section>
<!-- <section class="body-font text-gray-700">
	<hr class="hr" />
	<div class="container mx-auto px-5 py-24">
		<div class="mb-12 text-center">
			<h1 class="title-font text-tertiary-500 mb-4 text-2xl font-medium sm:text-3xl">
				O que dizem sobre o SGTCC
			</h1>
			<p class="mx-auto text-base leading-relaxed lg:w-3/4 xl:w-2/4">
				Professores, alunos e coordenadores compartilham suas experiências com o sistema.
			</p>
		</div>
		<div class="grid grid-cols-3 gap-3">
			{#snippet cardComment(
				/** @type {string} */ img,
				/** @type {string} */ nome,
				/** @type {string} */ data,
				/** @type {string} */ texto
			)}
				<div class="card preset-tonal p-6">
					<div class="flex items-start gap-4">
						<div>
							<Avatar name={nome} src={img} />
						</div>
						<div class="space-y-1">
							<div>{nome}</div>
							<div class="text-sm opacity-60">{data}</div>
							<div class="pt-4">
								{texto}
							</div>
						</div>
					</div>
				</div>
			{/snippet}
			{@render cardComment(
				'',
				'Prof. Ana Cláudia',
				'20/01/2025',
				'Com o SGTCC, conseguimos organizar todas as etapas do TCC de forma clara e eficiente. Reduzi a carga de e-mails e planilhas manuais pela metade!'
			)}
			{@render cardComment(
				'',
				'Lucas Ferreira',
				'20/01/2025',
				'Ter um lugar só para acompanhar orientações, prazos e enviar meus arquivos fez toda a diferença. Recomendo muito para outros cursos!'
			)}
			{@render cardComment(
				'',
				'Prof. Marcos Silva',
				'20/01/2025',
				'O sistema é intuitivo e agiliza muito a comunicação com os alunos. Também gosto dos alertas de prazos — ajudam bastante a manter tudo em dia.'
			)}
		</div>
	</div>
</section> -->
<section class="body-font">
	<div class="container mx-auto flex flex-col items-center px-5 py-12 text-center">
		<h2 class="text-tertiary-500 mb-4 text-2xl font-semibold">
			Pronto para transformar a gestão do TCC na sua instituição?
		</h2>
		<p class="mb-6 max-w-xl leading-relaxed text-gray-700">
			O SGTCC já está ajudando cursos a economizar tempo, melhorar a organização e facilitar a
			comunicação entre alunos, orientadores e coordenação.
		</p>
		<a href="/login" class="btn preset-filled-primary-500 p-5 px-10"> Iniciar Agora </a>
	</div>
</section>
<section class="body-font relative text-gray-700">
	<div class="absolute inset-0 bg-gray-300">
		<iframe
			width="100%"
			height="100%"
			frameborder="0"
			marginheight="0"
			marginwidth="0"
			title="map"
			scrolling="no"
			src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5372.54636724733!2d-44.47288931335006!3d-22.482309958432083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1spt-BR!2sbr!4v1744560060345!5m2!1spt-BR!2sbr"
			style="filter: grayscale(1) contrast(1.2) opacity(0.4);"
		></iframe>
	</div>
	<div class="h-100"></div>
</section>
<footer class="body-font text-gray-700">
	<div class="">
		<div class="container mx-auto flex flex-col flex-wrap px-5 py-4 sm:flex-row">
			<p class="text-center text-sm text-gray-500 sm:text-left">© 2025 SGTCC - Sistema de Gestão de Trabalhos de Conclusão de Curso</p>
		</div>
	</div>
</footer>
