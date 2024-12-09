<script lang="ts">
    import Plus from "$icons/plus.svelte";

    import Card from "$components/Card.svelte";
    import { pageName, storeLogin } from "../../../stores";
    import type Projeto from "$model/Projeto";
    import { onMount } from "svelte";
    import Api from "$repository/axiosInstance";
    import Cookie from "$model/Cookie";
    import type User from "$model/User";

    let { data } = $props();

    let projetos: Projeto[] = $state([]);

    let usuarioLogado: User | null = $state();
    storeLogin.subscribe((value) => {
        usuarioLogado = value;
    });

    let idUsuario: number = $state(0);

    async function getData() {
        idUsuario = parseInt(data.slug);
        projetos = await Api.get(`projetos/projetosNaoCancelados/${idUsuario}`);
    }

    onMount(getData);
</script>

<svelte:head>
    <title>{pageName} - Seus Projetos</title>
    <meta name="Seus Projetos" content="Exibe projetos de que você faz parte" />
</svelte:head>

<div class="grid justify-items-center w-full p-2">
    <div
        class="md:w-5/6 flex items-center h-max mx-auto w-full text-text-primary bg-base-100 shadow-xl p-10 gap-4 text-sm rounded-xl mb-2 justify-between"
    >
        {#if usuarioLogado?.id == idUsuario}
            <h1>Seus Projetos</h1>
            <a
                href="/projeto/criar"
                class="btn variant-filled-success hover:no-underline"
            >
                <span class="text-bold"> + </span>
                <span>Criar Novo </span>
            </a>
        {:else}
            <h1>Projetos</h1>
        {/if}
    </div>

    <div class="md:w-5/6 w-full grid md:grid-cols-3 variant-glass-surface m-4">
        {#each projetos as projeto}
            <Card item={projeto} tipo="projeto" />
        {/each}
    </div>
</div>
