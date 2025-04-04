<script lang="ts">
	import type Curso from '$model/Curso';
	import type LoggedUser from '$model/LoggedUser';
	import type Usuario from '$model/Usuario';
	import CursoRepository from '$repository/CursoRepository';
	import UsuarioRepository from '$repository/UsuarioRepository';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { Pencil } from 'lucide-svelte';
	import { storeLogin } from '../../../stores';
	import AlterarImagemUsuario from './AlterarImagemUsuario.svelte';
	import AlterarUsuario from './ModalAlterarUsuario.svelte';

	let usuarioLogado: LoggedUser | null = $state<LoggedUser | null>(null);
	let openStateImagem = $state(false);

	storeLogin.subscribe((value) => {
		usuarioLogado = value;
	});

	interface Props {
		idUsuario: number;
		data: any;
	}
	let { idUsuario, data }: Props = $props();

	let usuario: Usuario | null = $state(null);
	let curso: Curso | null = $state(null);

	$effect(() => {
		getUsuario(idUsuario).then(() => {
			if (usuario) {
				CursoRepository.PegarPorId(usuario.idCurso).then((resposta) => {
					curso = resposta;
				});
			}
		});
	});

	async function getUsuario(id: number) {
		usuario = await UsuarioRepository.PegarPorId(id);

		if (usuarioLogado) {
			if (usuario.id === usuarioLogado.id) {
				usuarioLogado.imagem = usuario.imagem;

				storeLogin.set(usuarioLogado);
			}
		}
	}

	function abrirModal(modal: string) {
		switch (modal) {
			case 'Imagem':
				openStateImagem = !openStateImagem;
				break;

			default:
				break;
		}
	}
</script>

{#snippet avatar(usuario: LoggedUser | Usuario)}
	<Avatar
		classes="select-none group-hover:brightness-50"
		src={usuario.ExibeImagem()}
		name={usuario.nome}
	/>
{/snippet}

{#if usuario}
	<AlterarImagemUsuario bind:openState={openStateImagem} {usuario} {getUsuario} />
	<div class="preset-tonal m-3 flex items-start rounded border p-2">
		<!-- INVISIVEL -->
		<div class="hover:text-primary-500 m-2 opacity-0">
			<Pencil />
		</div>

		<div class="m-5 grid justify-items-center gap-2">
			{#if usuario.id == usuarioLogado?.id}
				<button
					class="group relative"
					onclick={() => {
						abrirModal('Imagem');
					}}
				>
					<div
						class="text-primary-500 absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100"
					>
						<Pencil />
					</div>
					{@render avatar(usuario)}
				</button>
			{:else}
				{@render avatar(usuario)}
			{/if}
			<span class="font-extrabold">{usuario.nome}</span>
			<span class="">{usuario.email}</span>
			<span class="">{usuario.ExibePapel()}</span>
			<span class="">{curso?.nome}</span>
		</div>
		<div class={usuario.id == usuarioLogado?.id ? '' : 'opacity-0'}>
			<AlterarUsuario {getUsuario} {usuario} {data} />
		</div>
	</div>
{/if}
