<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { ListBox, ListBoxItem, popup, focusTrap } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	/**
	 * @type {any[]}
	 */
	let days = $state([]);
	let currentMonth = $state(new Date().getMonth());
	let currentYear = $state(new Date().getFullYear());
	let monthNames = [
		'Janeiro',
		'Fevereiro',
		'Março',
		'Abril',
		'Maio',
		'Junho',
		'Julho',
		'Agosto',
		'Setembro',
		'Outubro',
		'Novembro',
		'Dezembro'
	];

	function getDaysInMonth(month, year) {
		return new Array(new Date(year, month + 1, 0).getDate()).fill(null).map((_, i) => i + 1);
	}

	function generateCalendar() {
		const firstDay = new Date(currentYear, currentMonth, 1).getDay();
		const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

		const weeks = [];
		let week = Array(firstDay).fill(null);

		for (let day = 1; day <= lastDay; day++) {
			week.push(day);
			if (week.length === 7) {
				weeks.push(week);
				week = [];
			}
		}

		if (week.length > 0) {
			weeks.push(week);
		}

		days = weeks;
	}

  function pickMonth(month: number) {
    currentMonth = month;
    generateCalendar();
  }

	function changeMonth(offset: number) {
		currentMonth += offset;
		if (currentMonth > 11) {
			currentMonth = 0;
			currentYear++;
		} else if (currentMonth < 0) {
			currentMonth = 11;
			currentYear--;
		}
		generateCalendar();
	}

	onMount(() => {
		generateCalendar();
	});

	run(() => {
		generateCalendar();
	}); // re-generate calendar when month/year changes

	let comboboxValue: string = monthNames[currentMonth];

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};
</script>

<div>
	<div class="flex justify-between">
		<button
			class="hover:brightness-50 hover:text-primary-500 transition-all bg-secondary-500 p-2 rounded m-2"
			onclick={() => changeMonth(-1)}>&lt</button
		>
		<div class="bg-surface-500 p-2 rounded px-10 my-2">
      <div class="card w-48 shadow-xl p-4 mt-2 h-1/2 overflow-y-scroll" data-popup="popupCombobox">
        <ListBox rounded="rounded">
          {#each monthNames as month, index}
            <ListBoxItem bind:group={currentMonth} name="medium" value="{month}"
            on:click={() => {pickMonth(index)}}>{month}</ListBoxItem>
          {/each}
        </ListBox>
        <div class="arrow bg-surface-100-800-token"></div>
      </div>

			<button type="button" class="hover:text-primary-500 transition-all" use:popup={popupCombobox}>
				{monthNames[currentMonth]}
			</button>
			<button type="button" class="hover:text-primary-500 transition-all">
				{currentYear}
			</button>
		</div>
		<button
			class="hover:brightness-50 hover:text-primary-500 transition-all bg-secondary-500 p-2 rounded m-2"
			onclick={() => changeMonth(1)}>&gt</button
		>
	</div>
	<div class="calendar grid grid-cols-7 gap-0.5">
		<div class="text-center p-3 rounded border-2 border-surface-500 bg-secondary-500">Dom</div>
		<div class="text-center p-3 rounded border-2 border-surface-500 bg-secondary-500">Seg</div>
		<div class="text-center p-3 rounded border-2 border-surface-500 bg-secondary-500">Ter</div>
		<div class="text-center p-3 rounded border-2 border-surface-500 bg-secondary-500">Qua</div>
		<div class="text-center p-3 rounded border-2 border-surface-500 bg-secondary-500">Qui</div>
		<div class="text-center p-3 rounded border-2 border-surface-500 bg-secondary-500">Sex</div>
		<div class="text-center p-3 rounded border-2 border-surface-500 bg-secondary-500">Sab</div>

		{#each days as week}
			{#each week as day}
				{#if day}
					<div
						class="hover:bg-primary-500 hover:cursor-pointer text-center p-3 rounded border-2 border-surface-500 transition-all ease-out duration-500"
					>
						{day}
					</div>
				{:else}
					<div class="p-3 rounded border-2 border-surface-500 opacity-50"></div>
				{/if}
			{/each}
		{/each}
	</div>
</div>
