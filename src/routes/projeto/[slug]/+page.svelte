<script lang="ts">
    import InfoIcon from "$icons/info.svelte";
    import imgSrc from "$icons/projetoimagem.png";
    import { onMount } from "svelte";
    import { pageName, storeLogin } from "../../stores";
    import Comentarios from "$components/Comentarios.svelte";

    import Participantes from "../configuracoes/participantes.svelte";

    import Api from "$repository/axiosInstance";
    import Projeto from "$model/Projeto";
    import type User from "$model/User";
    import Informacoes from "../configuracoes/informacoes.svelte";

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
        const idProjeto = updateQueryString();
        projeto = await Api.get(`projetos/${idProjeto}`);
    }

    onMount(getData);

    // ------- SCRIPTS --------
    
    let projeto: Projeto | null = $state(null);

    let abaAtual = "detalhes";
    let detalhesAtual = $state("");
</script>

<svelte:head>
    <title>{pageName} - {projeto?.nome}</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

{#if projeto}
    <div class="grid justify-items-center">
        <div
            class="w-full md:m-8 md:w-3/4 items-center relative bg-base-100 shadow-2xl rounded p-3 border border-surface-500 text-sm bg-[url('{imgSrc}')] bg-cover bg-center h-64"
        >
            <img src={imgSrc} alt="" class="absolute inset-0 w-full h-full" />
            <div
                class="absolute bg-white bg-opacity-75 inset-0 flex items-center justify-center flex-col variant-ghost m-2"
            >
                <div class="flex w-full justify-center">
                    <h1 class="text-text-secondary font-bold pb-3">
                        {projeto.nome}
                    </h1>
                </div>
                <p class="p-10 text-text-secondary">{projeto.descricao}</p>
            </div>
        </div>
        <div class="grid m-2 p-4 w-full md:3/4">
            <!-- <div class="font-bold text-xl gap-2 md:flex grid">
            <button
                class="btn bg-primary-500"
                on:click={() => {
                    abaAtual = "detalhes";
                }}
            >
                Detalhes
            </button>
            <button
                class="btn bg-primary-500"
                on:click={() => {
                    abaAtual = "participantes";
                }}
            >
                Participantes
            </button>
        </div> -->
            <div class="grid md:grid-cols-4 variant-glass-surface m-4">
                {#if abaAtual == "detalhes"}
                    <button
                        class="border border-surface-500 h-20 w-full grid overflow-hidden shadow-lg hover:scale-105 {detalhesAtual ==
                        'Informações'
                            ? 'bg-primary-500'
                            : 'bg-surface-300'}"
                        onclick={() => {
                            detalhesAtual =
                                detalhesAtual === "Informações"
                                    ? ""
                                    : "Informações";
                        }}
                    >
                        <div class="mx-auto">
                            <InfoIcon />
                        </div>
                        <div class="mx-auto">Informações</div>
                        <div class="mt-auto bg-primary-500 h-1 w-full"></div>
                    </button>

                    <button
                        class="border border-surface-500 h-20 w-full grid overflow-hidden shadow-lg hover:scale-105 {detalhesAtual ==
                        'Participantes'
                            ? 'bg-primary-500'
                            : 'bg-surface-300'}"
                        onclick={() => {
                            detalhesAtual =
                                detalhesAtual === "Participantes"
                                    ? ""
                                    : "Participantes";
                        }}
                    >
                        <div class="mx-auto">
                            <InfoIcon />
                        </div>
                        <div class="mx-auto">Participantes</div>
                        <div class="mt-auto bg-primary-500 h-1 w-full"></div>
                    </button>

                    <button
                        class="border border-surface-500 h-20 w-full grid overflow-hidden shadow-lg hover:scale-105 {detalhesAtual ==
                        'Arquivos'
                            ? 'bg-primary-500'
                            : 'bg-surface-300'}"
                        onclick={() => {
                            detalhesAtual =
                                detalhesAtual === "Arquivos" ? "" : "Arquivos";
                        }}
                    >
                        <div class="mx-auto">
                            <InfoIcon />
                        </div>
                        <div class="mx-auto">Arquivos</div>
                        <div class="mt-auto bg-primary-500 h-1 w-full"></div>
                    </button>

                    <button
                        class="border border-surface-500 h-20 w-full grid overflow-hidden shadow-lg hover:scale-105 {detalhesAtual ==
                        'Atividades'
                            ? 'bg-primary-500'
                            : 'bg-surface-300'}"
                        onclick={() => {
                            detalhesAtual =
                                detalhesAtual === "Atividades"
                                    ? ""
                                    : "Atividades";
                        }}
                    >
                        <div class="mx-auto">
                            <InfoIcon />
                        </div>
                        <div class="mx-auto">Atividades</div>
                        <div class="mt-auto bg-primary-500 h-1 w-full"></div>
                    </button>
                {:else if abaAtual == "participantes"}
                    b
                {/if}
            </div>

            <div class="">
                {#if detalhesAtual === "Informações"}
                    <Informacoes {projeto} />
                {/if}
                {#if detalhesAtual === "Participantes"}
                    <Participantes {projeto} />
                {/if}

                <!-- Se projeto esta cancelado ou finalizado mostra comentarios -->
                {#if projeto.estado === 3 || projeto.estado === 4}
                    <Comentarios {projeto} />
                {/if}
            </div>
        </div>
    </div>
{/if}
