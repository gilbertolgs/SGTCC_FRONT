<script lang="ts">
    import {
        popup,
        ListBox,
        ListBoxItem,
        type PopupSettings,
    } from "@skeletonlabs/skeleton";

    import type Projeto from "$model/Projeto";

    import IconPerson from "$icons/person.svelte";
    import IconProjeto from "$icons/projeto.svelte";
    import IconTag from "$icons/tag.svelte";
    import IconLupa from "$icons/lupa.svelte";
    import IconStar from "$icons/star.svelte";
    import IconClock from "$icons/clock.svelte";
    import IconArrowUp from "$icons/arrow-up.svelte";
    import IconArrowDown from "$icons/arrow-down.svelte";

    const listaTipoFiltro = [
        {
            valor: 1,
            imagem: IconPerson,
            texto: "Autor",
        },
        {
            valor: 2,
            imagem: IconProjeto,
            texto: "Projeto",
        },
        {
            valor: 3,
            imagem: IconTag,
            texto: "Tag",
        },
    ];

    let cmbTipoFiltro: number = $state(1);
    let selecionadoTipoFiltro = $derived(
        listaTipoFiltro.find((item) => item.valor === cmbTipoFiltro),
    );

    const popupTipoFiltro: PopupSettings = {
        event: "click",
        target: "popupTipoFiltro",
        placement: "bottom",
        closeQuery: ".listbox-item",
    };

    const listaTipoOrdenacao = [
        {
            valor: 1,
            imagem: IconStar,
            imagem2: IconArrowUp,
            texto: "Mais Avaliados",
        },
        {
            valor: 2,
            imagem: IconStar,
            imagem2: IconArrowDown,
            texto: "Menos Avaliados",
        },
        {
            valor: 3,
            imagem: IconClock,
            imagem2: IconArrowUp,
            texto: "Mais Recentes",
        },
        {
            valor: 4,
            imagem: IconClock,
            imagem2: IconArrowDown,
            texto: "Mais Antigos",
        },
    ];

    let cmbTipoOrdenacao: number = $state(1);
    let selecionadoTipoOrdenacao = $derived(
        listaTipoOrdenacao.find((item) => item.valor === cmbTipoOrdenacao),
    );

    const popupTipoOrdenacao: PopupSettings = {
        event: "click",
        target: "popupTipoOrdenacao",
        placement: "bottom",
        closeQuery: ".listbox-item",
    };

    let txtPesquisa: string = $state("");
    let txtAno: string = $state(new Date().getFullYear().toString());

    let { filtraProjetos } = $props();
</script>

<div class="p-4 variant-ghost rounded">
    <div class="flex gap-1">
        <button class="btn bg-primary-500" use:popup={popupTipoFiltro}>
            <span>
                <svelte:component this={selecionadoTipoFiltro?.imagem} />
            </span>
            <span class="capitalize"
                >{selecionadoTipoFiltro?.texto ?? "Autor"}</span
            >
            <span>↓</span>
        </button>

        <div class="card w-48 shadow-xl py-2" data-popup="popupTipoFiltro">
            <ListBox rounded="rounded-none">
                {#each listaTipoFiltro as valorTipoFiltro}
                    <ListBoxItem
                        bind:group={cmbTipoFiltro}
                        name="medium"
                        value={valorTipoFiltro.valor}
                    >
                        <div class="flex">
                            <span>
                                <svelte:component
                                    this={valorTipoFiltro.imagem}
                                />
                            </span>
                            {valorTipoFiltro.texto}
                        </div>
                    </ListBoxItem>
                {/each}
            </ListBox>
        </div>

        <input
            type="text"
            name="search"
            class="w-full input"
            placeholder={selecionadoTipoFiltro?.texto}
            bind:value={txtPesquisa}
            autocomplete="off"
        />

        <div>
            <button class="btn bg-primary-500" use:popup={popupTipoOrdenacao}>
                <span>
                    <svelte:component this={selecionadoTipoOrdenacao?.imagem} />
                </span>
                <span class="capitalize"
                    >{selecionadoTipoOrdenacao?.texto ?? "Autor"}</span
                >
                <span>↓</span>
            </button>

            <div
                class="card w-48 shadow-xl py-2"
                data-popup="popupTipoOrdenacao"
            >
                <ListBox rounded="rounded-none">
                    {#each listaTipoOrdenacao as valorTipoOrdenacao}
                        <ListBoxItem
                            bind:group={cmbTipoOrdenacao}
                            name="medium"
                            value={valorTipoOrdenacao.valor}
                        >
                            <div class="flex">
                                <span>
                                    <svelte:component
                                        this={valorTipoOrdenacao.imagem}
                                    />
                                </span>
                                {valorTipoOrdenacao.texto}
                            </div>
                        </ListBoxItem>
                    {/each}
                </ListBox>
            </div>
        </div>

        <input
            type="text"
            maxlength="4"
            class="input w-20"
            placeholder="Ano"
            bind:value={txtAno}
        />
        <button class="btn bg-primary-500" onclick={() => {filtraProjetos(cmbTipoFiltro, txtPesquisa, cmbTipoOrdenacao, txtAno)}}
            ><IconLupa /></button
        >
    </div>
</div>
