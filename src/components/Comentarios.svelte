<script lang="ts">
    import PencilIcon from "$icons/pencil.svelte";
    import CrossIcon from "$icons/xmark.svelte";
    import CheckIcon from "$icons/simple-check.svelte";
    import imgPerfil from "$lib/images/imgPerfil";

    import { onMount } from "svelte";
    import DropDown from "./DropDown.svelte";

    import Comentario from "$model/Comentario";
    import type Projeto from "$model/Projeto";
    import Api from "$repository/axiosInstance";
    import type User from "$model/User";
    import { storeLogin } from "../routes/stores";

    import { popup, type PopupSettings } from "@skeletonlabs/skeleton";

    let comboboxValue: string;

    const popupCombobox2: PopupSettings = {
        event: "click",
        target: "popupCombobox2",
        placement: "bottom",
        closeQuery: ".listbox-item",
    };

    interface Props {
        projeto: Projeto;
    }

    let { projeto }: Props = $props();
    let campoComentario: string = $state("");
    let comentarios: Comentario[] = $state([]);
    let editandoComentario: number = $state(0);
    let txtEditandoComentarioConteudo: string = $state("");

    let usuarioLogado: User | null = $state(null);
    storeLogin.subscribe((value) => {
        usuarioLogado = value;
    });

    function formatRelativeDate(isoDate: string) {
        const now = new Date();
        const targetDate = new Date(isoDate);

        const diffInSeconds = Math.round((now.getTime() - targetDate.getTime()) / 1000);

        const units = [
            { unit: "year", seconds: 31536000 },
            { unit: "month", seconds: 2592000 },
            { unit: "week", seconds: 604800 },
            { unit: "day", seconds: 86400 },
            { unit: "hour", seconds: 3600 },
            { unit: "minute", seconds: 60 },
            { unit: "second", seconds: 1 },
        ];

        for (const { unit, seconds } of units) {
            const interval = Math.floor(diffInSeconds / seconds);
            if (Math.abs(interval) >= 1) {
                const rtf = new Intl.RelativeTimeFormat("pt-BR", {
                    numeric: "auto",
                });
                return rtf.format(-interval, unit);
            }
        }

        return "agora mesmo"; // Caso seja quase idêntico ao tempo atual
    }

    async function getData() {
        comentarios = await Api.get(
            "comentariosprojeto/comentariosPorProjeto",
            {
                projetoId: projeto.id,
            },
        );

        // TODO arrumar isso no back
        const usuarios = await Promise.all(
            comentarios.map((comentario) =>
                Api.get(`usuarios/${comentario.idUsuario}`),
            ),
        );

        // Attach user data to comments
        comentarios = comentarios.map((comentario, index) => ({
            ...comentario,
            usuario: usuarios[index] || { nome: "Usuario Excluido" },
        }));
    }

    onMount(getData);

    async function comentar() {
        if (usuarioLogado) {
            const comentario = {
                idUsuario: usuarioLogado.id,
                idProjeto: projeto.id,
                comentario: campoComentario,
            };

            await Api.post("comentariosprojeto/criarComentario", comentario);

            campoComentario = "";
            getData();
        }
    }

    const opcoesComentario = {
        admin: [
            {
                nome: "Excluir Comentario",
                botao: (comentarioId: number) =>
                    excluirComentario(comentarioId),
            },
        ],
        aluno: [
            {
                nome: "Editar Comentario",
                botao: (comentarioId: number) => editarComentario(comentarioId),
            },
            {
                nome: "Excluir Comentario",
                botao: (comentarioId: number) =>
                    excluirComentario(comentarioId),
            },
        ],
    };

    async function salvarComentario(id: number) {
        if (usuarioLogado) {
            const comentario = {
                idUsuario: usuarioLogado.id,
                idProjeto: projeto.id,
                comentario: txtEditandoComentarioConteudo,
            };
            await Api.put(
                `comentariosprojeto/${id}/atualizarComentario`,
                comentario,
            );

            editarComentario(id);
        }
        getData();
    }

    function editarComentario(id: number) {
        const conteudoComentario = comentarios.find(
            (comentario) => comentario.id == id,
        )?.comentario;
        if (conteudoComentario) {
            txtEditandoComentarioConteudo = conteudoComentario;
        }
        editandoComentario = id == editandoComentario ? 0 : id;
    }

    async function excluirComentario(id: number) {
        await Api.delete(`comentariosprojeto/${id}/deletarComentario`);
        getData();
    }
</script>

<h1>Comentarios:</h1>
{#if usuarioLogado != null}
    <div class="flex flex-col my-2 border border-surface-500 p-3 rounded-lg">
        <textarea
            name=""
            bind:value={campoComentario}
            id=""
            cols="30"
            rows="4"
            class="textarea textarea-bordered resize-none border-2"
        ></textarea>
        <button onclick={comentar} class="btn bg-primary-500 w-20 mt-2 ml-auto"
            >Comentar</button
        >
    </div>
{/if}
<ul class="mt-5">
    {#each comentarios as comentario}
        <li
            class="flex flex-col mb-3 border border-surface-500 p-3 rounded-lg relative"
        >
            <div class="flex">
                <img
                    src={imgPerfil}
                    alt="imagem de perfil"
                    class="h-5 md:h-10 w-auto rounded-full border border-surface-500 m-2"
                />
                <a
                    href="/usuario/{comentario.idUsuario}"
                    class="hover:text-primary-500 underline transition-all duration-300 my-auto"
                >
                    {comentario.usuario?.nome}
                </a>
                <span class="my-auto ml-2">
                    • {formatRelativeDate(
                        comentario.editadoEm ?? comentario.criadoEm,
                    )}
                </span>
            </div>
            {#if editandoComentario == comentario.id}
                <div class="grid grid-flow-col">
                    <textarea
                        bind:value={txtEditandoComentarioConteudo}
                        placeholder={comentario.comentario}
                        class="textarea textarea-bordered col-span-5 resize-none"
></textarea>
                    <div class="ml-auto mb-auto">
                        <button
                            onclick={() => {
                                salvarComentario(comentario.id);
                            }}
                            class="hover:text-success-500 flex p-3 duration-300"
                        >
                            <CheckIcon />
                            Salvar
                        </button>
                        <button
                            onclick={() => {
                                editarComentario(comentario.id);
                            }}
                            class="hover:text-error-500 flex p-3 duration-300"
                        >
                            <CrossIcon />
                            Cancelar
                        </button>
                    </div>
                </div>
            {:else}
                {#if comentario.idUsuario == usuarioLogado?.id || usuarioLogado?.papel == 3}
                    <button
                        onclick={() => editarComentario(comentario.id)}
                        class="hover:text-primary-500 flex duration-300 top-5 right-5 absolute"
                    >
                        <PencilIcon />
                        Editar Comentario
                    </button>
                    <!-- <button
                        class="flex p-2 rounded-xl fill-current hover:text-primary-500 transition-all ease-linear duration-300"
                        use:popup={popupCombobox2}
                    >
                        <button
                            on:click={() => editarComentario(comentario.id)}
                        >
                            Editar Comentario
                        </button>
                        <button
                            on:click={() => excluirComentario(comentario.id)}
                        >
                            Excluir Comentario
                        </button>
                    </button> -->
                {/if}
                {comentario.comentario}
            {/if}
        </li>
    {/each}
</ul>
