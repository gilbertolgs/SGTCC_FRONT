<script lang="ts">
    import { onMount } from "svelte";
    import Card from "$components/Card.svelte";
    import { pageName, storeLogin } from "../../stores";
    import Usuario from "$model/Usuario";
    import Api from "$repository/axiosInstance";
    import type Curso from "$model/Curso";
    import type Projeto from "$model/Projeto";
    import type User from "$model/User";

    import imgPerfil from "$lib/images/imgPerfil";

    import PencilIcon from "$icons/pencil.svelte";
    import SimpleCheckIcon from "$icons/simple-check.svelte";
    import XmarkIcon from "$icons/xmark.svelte";
    import { enumPapel, textoEnumPapel } from "$model/EnumPapel";

    // Pega Usuario Logado
    let usuarioLogado: User | null = $state(null);
    storeLogin.subscribe((value) => {
        usuarioLogado = value;
    });

    // Inicializa valores base
    let { data } = $props();
    function updateQueryString() {
        return parseInt(data.slug);
    }

    async function getData() {
        const idUsuario = updateQueryString();
        cursos = await Api.get(`cursos`);
        usuarioDoPerfil = await Api.get(`usuarios/${idUsuario}`);
        projetosDeUsuario = await Api.get(
            `projetos/projetosNaoCancelados/${idUsuario}`,
        );

        updateCamposTexto();
    }

    onMount(getData);

    // ------- SCRIPTS --------

    let projetosDeUsuario: Projeto[] = $state([]);
    let usuarioDoPerfil: Usuario | null = $state(null);

    let cursos: Curso[] = $state([]);

    let txtNome: string = $state("");
    let txtEmail: string = $state("");

    function updateCamposTexto() {
        if (!usuarioDoPerfil) return;

        txtNome = usuarioDoPerfil.nome;
        txtEmail = usuarioDoPerfil.email;
    }

    let editandoPerfil = $state(false);
    function editarPerfil() {
        editandoPerfil = !editandoPerfil;
        updateCamposTexto();
    }

    async function salvarPerfil() {
        if (!usuarioDoPerfil) return;

        const data = {
            id: usuarioLogado?.id,
            nome: txtNome,
            email: usuarioDoPerfil.email,
        };

        if (checarCampos()) {
            await Api.put(
                `usuarios/${usuarioDoPerfil.id}/atualizarUsuario`,
                data,
            );

            getData();
            editandoPerfil = !editandoPerfil;
        } else {
            alert("Errou!");
        }
    }

    function checarCampos() {
        if (txtNome == "") {
            return false;
        }
        return true;
    }
</script>

<svelte:head>
    <title>{pageName} - {usuarioDoPerfil?.nome}</title>
    <meta name="Perfil" content="Perfil do usuario {usuarioDoPerfil?.nome}" />
</svelte:head>

{#if usuarioDoPerfil}
    <div class="grid justify-items-center">
        <div
            class="md:flex w-full md:m-8 md:w-3/4 items-center bg-base-100 shadow-2xl rounded p-3 border border-surface-500 text-sm"
        >
            <img
                src={imgPerfil}
                alt="imagem de perfil"
                class="h-40 md:h-20 w-auto rounded border border-surface-500 mx-auto"
            />
            <div class="flex w-full m-2">
                <div class="font-bold">
                    {#if editandoPerfil}
                        Nome de Usuario: <input
                            type="text"
                            bind:value={txtNome}
                            placeholder={usuarioDoPerfil.nome}
                            class="input input-bordered"
                        />
                        E-mail:
                        <input
                            type="text"
                            bind:value={txtEmail}
                            placeholder={usuarioDoPerfil.email}
                            disabled
                            class="input input-bordered"
                        />
                        Curso:
                        <select
                            name=""
                            id=""
                            class="input input-bordered px-5 py-2"
                            disabled
                        >
                            {#each cursos as curso}
                                <option value={curso.id}>{curso.nome}</option>
                            {/each}
                        </select>
                        Papel:
                        <input
                            type="text"
                            value={textoEnumPapel[usuarioDoPerfil.papel]}
                            disabled
                            class="input input-bordered"
                        />
                    {:else}
                        Nome de Usuario: {usuarioDoPerfil.nome} <br />
                        E-mail: {usuarioDoPerfil.email} <br />
                        Curso: {usuarioDoPerfil.nomeCurso
                            ? usuarioDoPerfil.nomeCurso
                            : "Sem Curso"} <br />
                        Papel: {textoEnumPapel[usuarioDoPerfil.papel]} <br />
                    {/if}
                </div>
                <div class="mb-auto ml-auto grid gap-2">
                    {#if editandoPerfil}
                        <button
                            onclick={salvarPerfil}
                            class="hover:text-success-500 btn-variant-ghost flex p-3 duration-300"
                        >
                            <SimpleCheckIcon />
                            Salvar
                        </button>
                        <button
                            onclick={editarPerfil}
                            class="hover:text-error-500 btn-variant-ghost flex p-3 duration-300"
                        >
                            <XmarkIcon />
                            Cancelar
                        </button>
                    {:else if usuarioLogado?.id == usuarioDoPerfil.id}
                        <button
                            onclick={editarPerfil}
                            class="hover:text-primary-500 btn-variant-ghost flex duration-300"
                        >
                            <PencilIcon />
                            Editar Perfil
                        </button>
                    {/if}
                </div>
            </div>
        </div>
        <div class="grid m-2 p-4 w-full md:3/4">
            <div class="font-bold text-xl gap-2 md:flex grid">
                <!-- <button class="btn bg-primary-500">
                Sobre
            </button>
            <button class="btn bg-primary-500">
                Projetos
            </button> -->
            </div>
            <div class="grid md:grid-cols-3 variant-glass-surface m-4">
                {#each projetosDeUsuario as projeto}
                    <Card item={projeto} tipo="projeto" />
                {/each}
            </div>
        </div>
    </div>
{/if}
