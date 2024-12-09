<script lang="ts">
    import type Projeto from "$model/Projeto";
    import type User from "$model/User";
    import Api from "$repository/axiosInstance";
    import { error } from "@sveltejs/kit";
    import { onMount } from "svelte";
    import { storeLogin } from "../../stores";
    import { get } from "svelte/store";
    import DadosAlert from "$model/DadosAlert";

    interface Props {
        projeto: Projeto;
    }

    let { projeto }: Props = $props();

    //Usuario Logado
    let usuarioLogado: User | null;

    //TrocarAki
    storeLogin.subscribe((value) => {
        usuarioLogado = value;
    });

    async function getData() {
        usuarioLogado = get(storeLogin);
    }

    function formatDate(isoString: string) {
        let date = new Date(isoString); // Parse the ISO date string
        let day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero if needed
        let month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed) and pad
        let year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year

        return `${day}/${month}/${year}`;
    }

    function formatarEstado(estado: number) {
        switch (estado) {
            case 0:
                return "Criado";
                break;
            case 1:
                return "Em Progresso";
                break;
            case 2:
                return "Cancelado";
                break;
            case 3:
                return "Finalizado";
                break;

            default:
                break;
        }
    }

    onMount(getData);
</script>

<div
    class="mx-auto w-1/2 bg-base-500 border border-surface-500 p-2 rounded grid"
>
    <h1 class="font-bold text-xl mx-auto">
        {projeto.nome}
    </h1>
    <span class="grid">
        <div class="font-bold">Descrição:</div>
        {projeto.descricao}
    </span>
    <span class="grid">
        <div class="font-bold">Justificativa:</div>
        {projeto.justificativa}
    </span>
    <span class="grid">
        <div class="font-bold">Data de Início:</div>
        {formatDate(projeto.dataInicio)}
    </span>
    <span class="grid">
        <div class="font-bold">Estado:</div>
        {formatarEstado(projeto.estado)}
    </span>
</div>
