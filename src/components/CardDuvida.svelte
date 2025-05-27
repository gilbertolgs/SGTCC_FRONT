<script lang="ts">
	import type Duvida from '$model/Duvida';
	import { EnumVisibilidadeDuvida } from '$model/EnumVisibilidadeDuvida';
	import { Pencil, Trash } from 'lucide-svelte';
	import { storeLogin } from '../stores';

	let usuarioLogado = $derived($storeLogin);

	interface Props {
		abrirModal: Function;
		duvida: Duvida;
	}
	let { abrirModal, duvida }: Props = $props();
</script>

<div class="flex">
	<div class="grid">
		<p class="font-semibold">
			<button
				class="hover:text-primary-500 mb-auto ml-auto fill-current hover:underline"
				onclick={() => {
					abrirModal('Detalhes', duvida);
				}}>{duvida.texto}</button
			>
		</p>
		<p class="text-sm text-gray-500">
			Visibilidade: {EnumVisibilidadeDuvida[duvida.visibilidade]}
		</p>
	</div>
	{#if usuarioLogado && usuarioLogado.id == duvida.idUsuario}
		<div class="ml-auto flex gap-3">
			<button
				class="hover:text-primary-500 mb-auto ml-auto fill-current"
				onclick={() => {
					abrirModal('Adicionar', duvida);
				}}><Pencil /></button
			>
			<button
				class="hover:text-error-500 mb-auto ml-auto fill-current"
				onclick={() => {
					abrirModal('Apagar', duvida);
				}}><Trash /></button
			>
		</div>
	{/if}
</div>
