<script lang="ts">
	import CalendarHandler from '$lib/CalendarHandler';
	import type Projeto from '$model/Projeto';
	import { Combobox } from '@skeletonlabs/skeleton-svelte';
	import { MoveLeft, MoveRight } from 'lucide-svelte';

	interface Props {
		projeto: Projeto;
	}
	let { projeto }: Props = $props();

	let currentDate: Date = $state(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
	let selectedDate: Date | null = $state(null);
	let selectedTime: number | null = $derived((selectedDate as Date | null)?.getTime() ?? null);

	let calendarDays: { date: Date; isCurrentMonth: boolean }[] = $derived(
		CalendarHandler.getCalendarGrid(currentDate)
	);

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
		selectedDate = date;
	}

	interface ComboboxData {
		label: string;
		value: string;
	}

	const mesesData: ComboboxData[] = [];
	const anosData: ComboboxData[] = [];
	const currentYear = new Date().getFullYear();
	const endYear = currentYear + 20;

	for (let year = 1900; year <= endYear; year++) {
		const valor = year.toString();
		anosData.push({ label: valor, value: valor });
	}
	for (let mes = 0; mes < 12; mes++) {
		const valor = mes.toString();
		mesesData.push({ label: CalendarHandler.getMonthName(new Date(0, mes, 1)), value: valor });
	}
</script>

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
			<button class="hover:preset-filled-primary-500 btn">
				{CalendarHandler.getMonthName(currentDate)}
			</button>
			<button class="hover:preset-filled-primary-500 btn">
				{currentDate.getFullYear()}
			</button>
			<Combobox
				zIndex="99"
				data={mesesData}
				value={[currentDate.getMonth().toString()]}
				onValueChange={(e) => mudaMesAbsoluto(parseInt(e.value[0]))}
				placeholder="Select..."
			>
				{#snippet item(item)}
					<div class="flex w-full justify-between space-x-2">
						<span>{item.label}</span>
					</div>
				{/snippet}
			</Combobox>
			<Combobox
				zIndex="99"
				data={anosData}
				value={[currentDate.getFullYear().toString()]}
				onValueChange={(e) => mudaAno(parseInt(e.value[0]))}
				placeholder="Select..."
			>
				{#snippet item(item)}
					<div class="flex w-full justify-between space-x-2">
						<span>{item.label}</span>
					</div>
				{/snippet}
			</Combobox>
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
				class={`grid cursor-pointer rounded p-2 transition-all
                ${isCurrentMonth ? '' : 'opacity-40'} 
                ${selectedTime === date.getTime() ? 'bg-blue-600 text-white' : 'hover:bg-tertiary-500'}`}
				onclick={() => selectDate(date)}
			>
				<span>
					{date.getDate()}
				</span>
				{#if date.getDate() == 30}
					<div class="grid">
						<span class="truncate"> Atividade X </span>
						<span class="truncate"> Atividade Y </span>
					</div>
				{:else}
					<!-- Adiciona Altura nos dias vazios -->
					<span class="opacity-0 select-none">.</span>
				{/if}
			</button>
		{/each}
	</div>
</div>
