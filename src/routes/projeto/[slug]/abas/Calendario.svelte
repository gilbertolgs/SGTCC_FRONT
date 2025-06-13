<script lang="ts">
	import PopoverBase from '$components/PopoverBase.svelte';
	import CalendarHandler from '$lib/CalendarHandler';
	import type Atividade from '$model/Atividade';
	import type Projeto from '$model/Projeto';
	import AtividadeRepository from '$repository/AtividadeRepository';
	import { MoveLeft, MoveRight } from 'lucide-svelte';
	import DetalhesDia from '../components/DetalhesDia.svelte';
	import DataFormatHandler from '$lib/DataFormatHandler';

	interface Props {
		projeto: Projeto;
		atividades: Atividade[] | null;
	}

	let { projeto, atividades }: Props = $props();

	let atividadesPorDia = $derived(
		(atividades as Atividade[] | null)?.reduce((mapa, atividade) => {
			return mapeiaAtividades(atividade, mapa);
		}, new Map<number, Atividade[]>())
	);
	let diaSelecionado = $state(0);
	let atividadesDiaSelecionado = $derived(atividadesPorDia?.get(diaSelecionado) ?? null);

	let currentDate: Date = $state(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

	let openStateMes = $state(false);
	let openStateAno = $state(false);
	let openStateDetalhes = $state(false);

	const hoje = DataFormatHandler.FormatDate(new Date().toString());

	$effect(() => {
		// AtividadeRepository.PegarAtividadesPorProjeto(projeto.id).then((atividades) => {
		// 	if (atividades && atividades.length > 0) {
		// 		atividadesPorDia = atividades.reduce(
		// 			(mapa: Map<number, Atividade[]>, atividade: Atividade) => {
		// 				return mapeiaAtividades(atividade, mapa);
		// 			},
		// 			new Map<number, Atividade[]>()
		// 		);
		// 	}
		// });
		if (atividades && atividades.length > 0) {
			atividadesPorDia = atividades.reduce(
				(mapa: Map<number, Atividade[]>, atividade: Atividade) => {
					return mapeiaAtividades(atividade, mapa);
				},
				new Map<number, Atividade[]>()
			);
		}
	});

	let calendarDays: { date: Date; isCurrentMonth: boolean }[] = $derived(
		CalendarHandler.getCalendarGrid(currentDate)
	);

	function mapeiaAtividades(atividade: Atividade, mapa: Map<number, Atividade[]>) {
		if (!atividade.dataEntrega) {
			return mapa;
		}

		const key = new Date(atividade.dataEntrega).getTime();

		if (!mapa.has(key)) {
			mapa.set(key, []);
		}
		mapa.get(key)?.push(atividade);

		return mapa;
	}

	function mudaMesRelativo(mesRelativo: number): void {
		currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + mesRelativo, 1);
	}

	function mudaMesAbsoluto(mes: number): void {
		currentDate = new Date(currentDate.getFullYear(), mes, 1);
	}

	function mudaAno(ano: number): void {
		currentDate = new Date(ano, currentDate.getMonth(), 1);
	}

	function selectDate(date: Date): void {
		openStateDetalhes = true;
		diaSelecionado = date.getTime();
	}

	interface ComboboxData {
		label: string;
		value: string;
	}

	const mesesData: ComboboxData[] = [];
	const anosData: ComboboxData[] = [];
	const currentYear = new Date().getFullYear();
	const endYear = currentYear + 20;

	for (let year = 2000; year <= endYear; year++) {
		const valor = year.toString();
		anosData.push({ label: valor, value: valor });
	}
	for (let mes = 0; mes < 12; mes++) {
		const valor = mes.toString();
		mesesData.push({ label: CalendarHandler.getMonthName(new Date(0, mes, 1)), value: valor });
	}
</script>

<h3 class="h3 my-5">Calendário</h3>

<DetalhesDia
	bind:openState={openStateDetalhes}
	atividades={atividadesDiaSelecionado}
	dia={diaSelecionado}
/>

<div class="preset-tonal mx-auto rounded-lg border p-4 shadow-md">
	<div class="mb-4 flex items-center justify-between">
		<button
			class="hover:preset-filled-primary-500 btn"
			onclick={() => {
				mudaMesRelativo(-1);
			}}
		>
			<MoveLeft />
		</button>
		<h2 class="text-lg font-semibold">
			{#snippet scrollConteudo(valores: ComboboxData[], funcao: Function, valorAtual: number)}
				{#each valores as valor}
					{#if valorAtual.toString() === valor.value}
						<button class="bg-secondary-500 flex w-full justify-between space-x-2 p-2" disabled>
							<span>{valor.label}</span>
						</button>
					{:else}
						<button
							class="hover:bg-primary-500 flex w-full justify-between space-x-2 p-2 px-3"
							onclick={() => {
								openStateMes = false;
								openStateAno = false;
								funcao(valor.value);
							}}
						>
							<span>{valor.label}</span>
						</button>
					{/if}
				{/each}
			{/snippet}
			<PopoverBase
				bind:openState={openStateMes}
				posicao="bottom"
				classe="overflow-auto rounded bg-surface-200-800 grid h-[30vh]"
			>
				{#snippet botao()}
					<button class="hover:preset-filled-primary-500 btn" onclick={() => {}}>
						{CalendarHandler.getMonthName(currentDate)}
					</button>
				{/snippet}
				{#snippet conteudo()}
					{@render scrollConteudo(mesesData, mudaMesAbsoluto, currentDate.getMonth())}
				{/snippet}
			</PopoverBase>
			<PopoverBase
				bind:openState={openStateAno}
				posicao="bottom"
				classe="overflow-auto rounded bg-surface-200-800 grid h-[30vh]"
			>
				{#snippet botao()}
					<button class="hover:preset-filled-primary-500 btn">
						{currentDate.getFullYear()}
					</button>
				{/snippet}
				{#snippet conteudo()}
					{@render scrollConteudo(anosData, mudaAno, currentDate.getFullYear())}
				{/snippet}
			</PopoverBase>
		</h2>
		<button
			class="hover:preset-filled-primary-500 btn"
			onclick={() => {
				mudaMesRelativo(1);
			}}
		>
			<MoveRight />
		</button>
	</div>

	<div class="grid grid-cols-7 gap-1 text-center text-sm">
		{#each ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'] as dayName}
			<div class="font-medium">{dayName}</div>
		{/each}

		{#each calendarDays as { date, isCurrentMonth }}
			<button
				class={`hover:bg-tertiary-500 grid cursor-pointer rounded p-2 transition-all md:min-h-[4rem]
                ${isCurrentMonth ? '' : 'opacity-40'} 
				${DataFormatHandler.FormatDate(new Date(date).toString()) == hoje ? 'bg-primary-500' : ''}
                `}
				onclick={() => selectDate(date)}
			>
				<span>
					{date.getDate()}
				</span>
				{#if atividadesPorDia}
					{#each atividadesPorDia.get(date.getTime()) ?? [] as atividade}
						<div class="flex gap-1 overflow-hidden">
							<span class="rounded p-1 {atividade.CorPrioridade()}">
								{atividade.nome}
							</span>
						</div>
					{/each}
				{/if}
			</button>
		{/each}
	</div>
</div>
