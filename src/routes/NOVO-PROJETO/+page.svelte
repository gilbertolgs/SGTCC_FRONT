<script lang="ts">
  import StarSolidIcon from "$icons/star-solid.svelte";
  import StarHalfStrokeSolidIcon from "$icons/star-half-stroke-solid.svelte";
  import StarRegularIcon from "$icons/star-regular.svelte";

	import { Ratings } from "@skeletonlabs/skeleton";

	let projetos = [
		{ ancora: '/projetos/1', nome: 'sgtcc', nota: 10, pontuacao: 2.5 },
		{ ancora: '/projetos/2', nome: 'inksearch', nota: 10, pontuacao: 5 },
		{ ancora: '/projetos/3', nome: 'livro', nota: 10, pontuacao: 4 },
	];
	let totalWeight = 'a';
</script>

<div></div>
<div class="table-container md:p-5">
	<!-- Native Table Element -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Nome</th>
				<th>Nota</th>
				<th>Avaliação</th>
			</tr>
		</thead>
		<tbody>
			{#each projetos as row, i}
				<tr>
					<td>
            <a class="hover:text-primary-500 underline" href={row.ancora}>
              {row.nome}
            </a>
            </td>
					<td>{row.nota}</td>
					<td>
						<Ratings value={row.pontuacao} max={5} regionIcon="w-5 md:w-10 fill-current text-primary-500">
							{#snippet empty()}
														<StarRegularIcon/>
													{/snippet}
							{#snippet half()}
														<StarHalfStrokeSolidIcon/>
													{/snippet}
							{#snippet full()}
														<StarSolidIcon />
													{/snippet}
            </Ratings>
					</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			
		</tfoot>
	</table>
</div>
