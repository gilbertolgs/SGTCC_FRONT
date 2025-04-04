<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="justify-items-center text-center">
	<div class="">
		<h1 class="h1">{page.status}</h1>
		<p class="h3">
			{page.error?.message}
		</p>
		<a class="anchor font-bold" href="/">Retornar à página inicial.</a>
	</div>
</div>
