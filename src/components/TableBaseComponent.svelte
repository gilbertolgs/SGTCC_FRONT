<script lang="ts">
	let { camposCabecalho, arrObjetosTamanho, cabecalho, corpo } = $props();
</script>

<div class="table-wrap">
	<table class="table-striped table">
		{@render cabecalho()}
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{@render corpo()}
		</tbody>
		<tfoot>
			<tr>
				<td colspan={camposCabecalho.length - 1}>Total</td>
				<td class="text-right">{arrObjetosTamanho} Cursos</td>
			</tr>
		</tfoot>
	</table>
</div>
