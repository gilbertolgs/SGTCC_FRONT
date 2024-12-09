<script lang="ts">
    import Projeto from "$model/Projeto";
    import type Curso from "$model/Curso";
    import Usuario from "$model/Usuario";

    import { pageName, storeLogin } from "../../stores";
    import { onMount } from "svelte";

    import Api from "$repository/axiosInstance";
    import Cookie from "$model/Cookie";
    import { goto } from "$app/navigation";
    import type User from "$model/User";
    import { InputChip } from "@skeletonlabs/skeleton";
    import Tag from "$model/Tag";

    import { getToastStore } from "@skeletonlabs/skeleton";
    import alert from "$components/Alert";
    const toastStore = getToastStore();
    const Alert = new alert(toastStore);

    // Pega Usuario Logado
    let usuarioLogado: User | null = $state(null);
    storeLogin.subscribe((value) => {
        usuarioLogado = value;
    });

    // Inicializa valores base
    async function getData() {}
    onMount(getData);

    // ------- SCRIPTS --------

    let txtNome: string = $state("");
    let txtDescricao: string = $state("");
    let txtJustificativa: string = $state("");

    let tagsPura: string[] = $state([]);
    let tags: Tag[] = [];

    function formataTags() {
        let tagsFormatada = tagsPura.map((tag) => new Tag(tag));
        return tagsFormatada;
    }

    function checarCampos() {
        if (txtNome == undefined) {
            return false;
        } else if (txtDescricao == undefined) {
            return false;
        }
        return true;
    }

    function limparCampos() {
        txtNome = "";
        txtDescricao = "";
    }
    async function criarProjeto() {
        if (usuarioLogado && checarCampos()) {
            tags = formataTags();
            const projeto = new Projeto(
                0,
                usuarioLogado.id,
                txtNome.trim(),
                txtDescricao.trim(),
                txtJustificativa.trim(),
                0,
            );
            console.log(projeto);

            await Api.post("projetos/criarProjeto", projeto);

            Alert.display(
                "Projeto criado com sucesso",
                "variant-filled-success",
            );

            limparCampos();
            goto(`/usuario/${usuarioLogado.id}/projetos`);
        }
    }
</script>

<svelte:head>
    <title>{pageName} - Criar Projeto</title>
    <meta
        name="Criar Projeto"
        content="Página para criação de novos projetos"
    />
</svelte:head>

<div
    class="p-6 space-y-6 shadow-xl mx-auto md:w-2/4 md:my-3 md:card transition-all"
>
    <div class="p-6 space-y-6 md:w-2/4 md:my-3">
        <h1 class="font-bold">Criar Projeto</h1>
    </div>
    <div
        class="bg-base-100 shadow-xl p-10 flex flex-col gap-4 text-sm rounded-xl"
    >
        <div class="flex flex-col">
            <label class="font-bold pb-2" for="text">Nome</label>
            <input
                bind:value={txtNome}
                required
                class="input input-bordered px-5 py-2"
                type="text"
                name="text"
                autocomplete="off"
            />
        </div>
        <div class="flex flex-col">
            <label class="font-bold pb-2" for="text">Tags</label>
            <InputChip bind:value={tagsPura} name="tags" placeholder="" />
        </div>
        <div class="flex flex-col">
            <label class="font-bold pb-2" for="text">Descrição</label>
            <textarea
                name=""
                bind:value={txtDescricao}
                id=""
                cols="30"
                rows="4"
                class="textarea textarea-bordered px-5 py-2 resize-none"
            ></textarea>
        </div>
        <div class="flex flex-col">
            <label class="font-bold pb-2" for="text">Justificativa</label>
            <textarea
                name=""
                bind:value={txtJustificativa}
                id=""
                cols="30"
                rows="4"
                class="textarea textarea-bordered px-5 py-2 resize-none"
            ></textarea>
        </div>
        <div>
            <input
                class="btn variant-filled-success hover:cursor-pointer"
                type="submit"
                value="Criar Projeto"
                onclick={criarProjeto}
            />
        </div>
    </div>
</div>
