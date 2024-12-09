<script lang="ts">
    import { getToastStore } from "@skeletonlabs/skeleton";

    import { pageName } from "../stores";
    import type Projeto from "$model/Projeto";
    import { onMount } from "svelte";
    import type Curso from "$model/Curso";
    import Api from "$repository/axiosInstance";

    import alert from "$components/Alert";
    const toastStore = getToastStore();
    const Alert = new alert(toastStore);

    import Filtro from "./Filtro.svelte";
    import CardPublico from "$components/CardPublico.svelte";

    async function filtraProjetos(
        tipoFiltro: number,
        filtro: string,
        tipoOrdenacao: number,
        ano: string,
    ) {
        try {
            projetos = await Api.get("projetos/filtroGeral", {
                tipoFiltro: tipoFiltro,
                filtro: filtro,
                tipoOrdenacao: tipoOrdenacao,
                ano: ano,
            });
        } catch (error) {
            console.log(error.response);

            if (error.response.data === "Não Implementado") {
                Alert.display("Não Implementado!", "variant-filled-error");
            } else if (
                error.response.data ===
                "Texto de Filtro e Ano não podem ser nulos ao mesmo tempo. preencha um ou ambos!"
            ) {
                Alert.display(error.response.data, "variant-filled-error");
            }
        }
    }

    let projetos: Projeto[] = $state([]);

    let cursos: Curso[] = [];
    let cursosMap: any = $state();

    async function getData() {
        cursos = await Api.get("cursos");
        cursosMap = cursos.reduce((acc: any, curso) => {
            acc[curso.id] = curso.nome;
            return acc;
        }, {});
        projetos = await Api.get("projetos/filtroGeral", {
            tipoFiltro: 2,
            filtro: "",
            tipoOrdenacao: 3,
            ano: new Date().getFullYear(),
        });
    }

    onMount(getData);
</script>

<svelte:head>
    <title>{pageName} - Projetos Publicados</title>
    <meta name="Projetos" content="Projetos publicados no sistema" />
</svelte:head>

<div class="shadow-xl mx-auto md:w-3/4 md:my-3 md:card transition-all">
    <Filtro {filtraProjetos} />
    <div>
        {#each projetos as projeto}
            <CardPublico {projeto} {cursosMap} />
        {/each}
    </div>
</div>
