<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';
	import ModalBase from '$components/ModalBase.svelte';
	import type Atividade from '$model/Atividade';
	import AtividadeRepository from '$repository/AtividadeRepository';

	let { openState = $bindable(), idAtividade } = $props();
	let atividade: Atividade | null = $derived(null);
	let txtComentario: string = $state('');

	$effect(() => {
		console.log(idAtividade);
		if (idAtividade !== 0) {
			pegaAtividade();
		}
	});

	async function pegaAtividade() {
		atividade = await AtividadeRepository.PegarAtividadePorId(idAtividade);
		console.log(atividade);
	}
</script>

<ModalBase
	bind:openState
	classe="card grid bg-surface-100-900 p-4 space-y-4 shadow-xl w-full md:w-3/4"
>
	{#snippet conteudo()}
		{#if atividade}
			<div class="flex flex-col">
				<h3 class="h3">{atividade.nome}</h3>
				<span>{atividade.descricao}</span>
				<ul class="preset-tonal h-1/2">
					<li></li>
				</ul>
				<div class="flex gap-2">
					<FormInputComponent
						classe="col-span-3"
						label="Comentário"
						placeholder="comentário"
						tipo="text"
						bind:valor={txtComentario}
						erros={null}
						constraints={null}
					/>
					<button class="btn preset-filled-primary-500 mt-auto">Enviar</button>
				</div>
			</div>
		{/if}
	{/snippet}
</ModalBase>
