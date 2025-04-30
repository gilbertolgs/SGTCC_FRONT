<script lang="ts">
	import FormInputComponent from '$components/FormInputComponent.svelte';

	const LogoGoogle: string =
		'https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw';

	let { errors, form, constraints, message, enhance } = $props();
</script>

{#snippet imagem(imagem: string)}
	<img src={imagem} alt="" class="h-5" />
{/snippet}
<form
	novalidate
	method="POST"
	use:enhance
	class="card bg-surface-100-900 border-surface-200-800 mx-auto space-y-5 border p-5 shadow md:mt-5 md:w-1/2"
>
	<!-- {#if $message}<h3>{$message}</h3>{/if} -->
	<fieldset class="space-y-2">
		<h2 class="h2">Login</h2>
	</fieldset>
	<fieldset class="space-y-2">
		<FormInputComponent
			label="Email"
			placeholder="email@aedb.br"
			tipo="text"
			bind:valor={$form.email}
			erros={$errors.email}
			constraints={$constraints.email}
		/>
		<FormInputComponent
			label="Senha"
			placeholder="•••••••••••"
			tipo="password"
			bind:valor={$form.senha}
			erros={$errors.senha}
			constraints={null}
		/>
	</fieldset>
	<fieldset>
		<button type="submit" class="btn preset-filled-primary-500 w-full">Login</button>
		<a href="/resetarSenha/requisicao" class="anchor font-bold">Esqueceu a Senha?</a>
	</fieldset>
	<hr class="hr" />
	<fieldset class="space-y-5">
		<button
			type="button"
			class="btn preset-outlined-primary-500 hover:preset-filled-primary-500 w-full"
		>
			{@render imagem(LogoGoogle)} Entrar com Google
		</button>
		<p class="text-center text-sm">
			Não possui cadastro? <a href="/cadastrar" class="anchor font-bold">Criar conta</a>
		</p>
	</fieldset>
</form>
