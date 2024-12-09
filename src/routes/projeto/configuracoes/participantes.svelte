<script lang="ts">
    import { getToastStore, getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    const modalStore = getModalStore();

    import alert from "$components/Alert";
    const toastStore = getToastStore();
    const Alert = new alert(toastStore);

    import type Projeto from "$model/Projeto";
    import type User from "$model/User";
    import Api from "$repository/axiosInstance";
    import { error } from "@sveltejs/kit";
    import { onMount } from "svelte";
    import { storeLogin } from "../../stores";
    import { get } from "svelte/store";
    import DadosAlert from "$model/DadosAlert";

    import XmarkIcon from "$icons/xmark.svelte";

    import imgPerfil from "$lib/images/imgPerfil";
    import { goto } from "$app/navigation";

    interface Props {
        projeto: Projeto;
    }

    let { projeto }: Props = $props();

    let pessoas = $state([
        {
            id: 0,
            nome: "",
        },
    ]);
    pessoas = [];

    let convidados = $state([
        {
            id: 0,
            nome: "",
        },
    ]);
    convidados = [];

    let participantes = $state([
        {
            id: 0,
            nome: "",
        },
    ]);
    participantes = [];
    let estaParticipando = $state(false);

    let txtParticipante = $state("");
    let txtMensagem = "";
    let participante: any = $state();
    let cboPapel = $state("Aluno");

    //Usuario Logado
    let usuarioLogado: User | null = $state(null);

    //TrocarAki
    storeLogin.subscribe((value) => {
        usuarioLogado = value;
    });

    async function getData() {
        usuarioLogado = get(storeLogin);

        participantes = await Api.get("usuarios/userByProject", {
            id: projeto.id,
        });

        estaParticipando = usuarioEParticipante(usuarioLogado?.id, participantes);
    }

    onMount(getData);

    function openModal(titulo: string, mensagem: string, idUsuario: number) {
        const modal: ModalSettings = {
            type: "confirm",
            // Data
            title: titulo,
            body: mensagem,
            buttonTextConfirm: "Confirmar",
            buttonTextCancel: "Cancelar",
            // TRUE if confirm pressed, FALSE if cancel pressed
            response: (r: boolean) => removerDoProjeto(idUsuario, r),
        };

        modalStore.trigger(modal);
    }

    async function atualizaLista() {
        if (txtParticipante.length < 3) {
            pessoas = [];
        } else if (txtParticipante.length == 3 || txtParticipante.length > 5) {
            const query = {
                Papel: cboPapel,
                Nome: txtParticipante,
            };

            pessoas = await Api.get("usuarios/findUsers", query);
        }
    }

    async function selecionaParticipante(usuario: any) {
        if (usuario) {
            participante = await Api.get("usuarios/email", {
                email: usuario.email,
            });
        } else {
            participante = null;
        }
        txtParticipante = "";
        atualizaLista();
    }

    async function enviarConvite() {
        const convite = {
            idUsuario: participante.id,
            idProjeto: projeto.id,
            funcao: 1
        };
        await Api.post("usuariosProjeto", convite);

        selecionaParticipante(null);

        txtMensagem = "";
        Alert.display(
                    "Convite enviado!",
                    "variant-filled-success",
                );
        getData();
    }

    function removerConvite(idConvite: number) {
        //recusar convite
    }

    async function removerDoProjeto(idUsuario: number, r: boolean) {
        if(r === false) return;
        const remocao = {
            IdUsuario: idUsuario,
            IdProjeto: projeto.id
        };
        await Api.delete("usuariosProjeto/RemoverUsuarioDeProjeto", remocao);

        if(idUsuario === usuarioLogado?.id && projeto.estado !== 4) {
            goto("/biblioteca");
        }

        Alert.display(
                    "Usuário Removido!",
                    "variant-filled-success",
                );
        getData();
    }

    // TODO remover isso
    function usuarioEParticipante(id: number | undefined, participantes: any) {
        if (isNaN(id as any)) {
            return false;
        }

        let res = participantes.some((pes: any) => pes.id === id);

        return res;
    }
</script>

<div class="h-max mx-auto flex flex-col items-center w-full">
    {#if estaParticipando}
        <div
            class="bg-base-100 shadow-xl border border-surface-500 p-10 flex flex-col gap-4 text-sm rounded-xl lg:w-1/2 w-full"
        >
            <div class="flex flex-col">
                <label class="font-bold inline-block pb-2" for="text"
                    >Pessoa</label
                >
                {#if participante}
                    <div
                        class="shadow-sm border border-surface-500 bg-content-primary rounded-xl p-3 flex flex-row"
                    >
                        <div class="my-auto">{participante.nome}</div>
                        <button
                            onclick={() => selecionaParticipante(null)}
                            class="hover:text-error-500 transition-all my-auto ml-auto"
                        >
                            <XmarkIcon />
                        </button>
                    </div>
                {:else}
                    <select
                        class="select select-bordered w-auto mb-3"
                        bind:value={cboPapel}
                    >
                        <option value="Aluno">Aluno</option>
                        <option value="Professor">Professor</option>
                    </select>
                    <input
                        type="text"
                        class="input input-bordered"
                        placeholder="Nome"
                        bind:value={txtParticipante}
                        oninput={atualizaLista}
                    />
                {/if}
                {#if pessoas.length > 0}
                    <ul
                        class="max-h-40 overflow-y-scroll border border-base-20 rounded-xl"
                    >
                        {#if pessoas}
                            {#each pessoas as pessoa}
                                <li>
                                    <button
                                        class="btn bg-base-500 hover:bg-secondary-500 w-full"
                                        onclick={() =>
                                            selecionaParticipante(pessoa)}
                                        >
                                        <img
                                            src={imgPerfil}
                                            alt="imagem de perfil"
                                            class="h-8 m-2 w-auto rounded border border-surface-500"
                                        />
                                        {pessoa.nome} - Convidar Participante
                                        </button>
                                </li>
                            {/each}
                        {/if}
                    </ul>
                {/if}
            </div>
            <div>
                <button
                    class="btn bg-primary-500"
                    value="Enviar Convite"
                    onclick={enviarConvite}
                >
                    Enviar Convite
                </button>
            </div>
        </div>
    {/if}
    {#if convidados.length > 0}
        <div
            class="w-full mt-2 bg-base-100 shadow-xl p-5 grid gap-4 text-sm rounded-xl"
        >
            <div class="w-full my-0">
                <table class="table">
                    <thead class="">
                        <tr>
                            <th>Convites Pendentes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each convidados as convidado}
                            <tr class="">
                                <th class="w-full border-b">
                                    <p>{convidado.nome}</p>
                                </th>
                                <th class="flex border-b">
                                    <button
                                        class="p-4 mr-1 bg-red-500 hover:scale-110 transition-all rounded-md font-bold hover:brightness-90"
                                        onclick={() => {
                                            removerConvite(convidado.id);
                                        }}>Cancelar</button
                                    >
                                </th>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
    {#if participantes.length > 0}
        <div
            class="w-1/2 mt-2 bg-base-500 border border-surface-500 shadow-xl p-5 flex flex-col gap-4 text-sm rounded-xl"
        >
            <div class="bg-base-500 w-full my-0">
                <table class="table">
                    <thead class="text-text-primary">
                        <tr>
                            <th>Participantes</th>
                            {#if estaParticipando}
                                <th>Ações</th>
                            {/if}
                        </tr>
                    </thead>
                    <tbody>
                        {#each participantes as participa}
                            <tr class="text-text-secondary">
                                <th class="w-full border-b">
                                    <a
                                        href="/usuario/{participa.id}"
                                        class="flex hover:text-primary-500 underline"
                                    >
                                        <img
                                            src={imgPerfil}
                                            alt="imagem de perfil"
                                            class="h-8 m-2 w-auto rounded border border-surface-500"
                                        />
                                        <p class="my-auto m-1">
                                            {participa.nome}
                                        </p>
                                    </a>
                                </th>
                                {#if usuarioLogado?.id == participa.id}
                                    <th>
                                        <button
                                            class="btn bg-primary-500 p-3"
                                            onclick={() => {
                                                openModal(
                                                    "Sair do Projeto",
                                                    "Tem certeza que deseja sair desse Projeto",
                                                    participa.id,
                                                );
                                            }}
                                        >
                                            Deixar Projeto
                                        </button>
                                    </th>
                                {:else if estaParticipando}
                                    <th>
                                        <button
                                            class="btn bg-primary-500 p-3"
                                            onclick={() => {
                                                openModal(
                                                    "Remover do Projeto",
                                                    `Tem certeza que deseja remover ${participa.nome} desse Projeto`,
                                                    participa.id,
                                                );
                                            }}
                                        >
                                            Remover do Projeto
                                        </button>
                                    </th>
                                {/if}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
</div>
