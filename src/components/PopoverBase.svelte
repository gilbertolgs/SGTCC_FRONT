<script lang="ts">
	import { Popover } from '@skeletonlabs/skeleton-svelte';

	type Posicao = 'top' | 'bottom' | 'left' | 'right';
	interface Props {
		openState: any;
		posicao: Posicao;
		classe: string;
		botao: any;
		conteudo: any;
	}
	let { openState = $bindable(), posicao = null, classe = null, botao, conteudo } = $props();
</script>

<Popover
	open={openState}
	onOpenChange={(e) => (openState = e.open)}
	positioning={{ placement: posicao ?? 'top' }}
	contentBase={classe ?? 'bg-surface-200-800 p-2 rounded'}
>
	{#snippet trigger()}
		{@render botao()}
	{/snippet}
	{#snippet content()}
		{@render conteudo()}
	{/snippet}
</Popover>
