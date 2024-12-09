<script lang="ts">
    import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    const modalStore = getModalStore();

    import { onMount } from "svelte";
    import { pageName } from "../stores";

    import Api from "$repository/axiosInstance";
    import Curso from "$model/Curso";
    import { getToastStore } from "@skeletonlabs/skeleton";
    import alert from "$components/Alert";
    const toastStore = getToastStore();
    const Alert = new alert(toastStore);

    let txtPesquisa: string = $state("");

    let txtNome: string = $state("");
    let txtDescricao: string = $state("");
    let cursosBase: Curso[] = [];
    let cursosDisplay: Curso[] = $state([]);

    let textoBotao = $state("Cadastrar");
    //se alterando é diferente de 0 seu valor é igual ao id do curso a ser alterado.
    let alterando = $state(0);

    async function getData() {
        cursosBase = await Api.get("cursos");
        cursosDisplay = cursosBase;
    }

    onMount(getData);

    function checarCampos() {
        if (txtNome == undefined) {
            return false;
        }
        if (txtDescricao == undefined) {
            return false;
        }
        return true;
    }
    async function criarCurso() {
        if (checarCampos()) {
            if (alterando) {
                const curso = new Curso(alterando, txtNome, txtDescricao);
                await Api.put("cursos/atualizarCurso", curso);

                cancelarAlteracao();

                Alert.display(
                    "Curso Alterado com sucesso!",
                    "variant-filled-success",
                );
            } else {
                const curso = new Curso(0, txtNome, txtDescricao);
                await Api.post("cursos/criarCurso", curso);
                Alert.display(
                    "Curso Adicionado com sucesso!",
                    "variant-filled-success",
                );
            }

            limparCampos();
            getData();
        }
    }

    function alterarCurso(id: number, nomeCurso: string, descCurso: string) {
        txtNome = nomeCurso;
        txtDescricao = descCurso;
        alterando = id;
        textoBotao = "Alterar";
    }

    async function deletarCurso(idCurso: number, r: boolean) {
        if (r === false) return;

        const queryCurso = {
            id: idCurso
        };
        try {
            await Api.delete(`cursos/${idCurso}/deletarCurso`, queryCurso);
        } catch (error) {
            Alert.display(
                "Falha ao tentar deletar Curso",
                "variant-filled-error",
            );

            return;
        }
        Alert.display("Curso Deletado com sucesso!", "variant-filled-success");

        getData();
    }

    function limparCampos() {
        txtNome = "";
        txtDescricao = "";
    }

    function cancelarAlteracao() {
        alterando = 0;
        limparCampos();
        textoBotao = "Cadastrar";
    }

    function criarCursoKeyPress(event: KeyboardEvent) {
        if (event.key == "Enter") {
            criarCurso();
        }
    }

    function openModal(titulo: string, mensagem: string, cursoId: number) {
        const modal: ModalSettings = {
            type: "confirm",
            // Data
            title: titulo,
            body: mensagem,
            buttonTextConfirm: "Confirmar",
            buttonTextCancel: "Cancelar",
            // TRUE if confirm pressed, FALSE if cancel pressed
            response: (r: boolean) => deletarCurso(cursoId, r),
        };

        modalStore.trigger(modal);
    }

    //TODO Remover função
    function filtrarCursos() {
        if (txtPesquisa.length < 2) {
            cursosDisplay = cursosBase;
            return;
        }
        const filteredArray = cursosBase.filter((curso) => {
            return curso.nome.toLowerCase().includes(txtPesquisa.toLowerCase());
        });

        cursosDisplay = filteredArray;
    }
</script>

<svelte:head>
    <title>{pageName} - Cursos</title>
    <meta name="Gestão de Cursos" content="Pagina para gerir cursos" />
</svelte:head>

<h1
    class="p-6 space-y-6 shadow-xl mx-auto md:w-2/4 md:my-3 md:card transition-all"
>
    Gerenciar Cursos
</h1>
<div
    class="p-6 space-y-6 shadow-xl mx-auto md:w-2/4 md:my-3 md:card transition-all"
>
    <div class="h-max grid">
        <div class="shadow-xl p-10 flex flex-col gap-4 text-sm rounded-xl">
            <div>
                <label class="font-bold inline-block pb-2" for="text"
                    >Nome</label
                >
                <input
                    bind:value={txtNome}
                    onkeypress={criarCursoKeyPress}
                    required
                    class="input input-bordered"
                    type="text"
                    name="nome"
                    autocomplete="off"
                />
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
            <div>
                <input
                    class="btn transition-all variant-filled-success hover:cursor-pointer"
                    type="submit"
                    value={textoBotao}
                    onclick={criarCurso}
                />
                {#if alterando}
                    <input
                        class="btn transition-all variant-filled-error hover:cursor-pointer"
                        type="submit"
                        value="Cancelar"
                        onclick={cancelarAlteracao}
                    />
                {/if}
            </div>
        </div>
        <div class="text-center mb-5">
            <hr class="-mb-4" />
            <span class="bg-surface-100-800-token p-2 text-sm"
                >Cursos Cadastrados</span
            >
        </div>
        <div class="py-2">
            <span>Pesquisa: </span>
            <input
                type="text"
                name="search"
                class="w-full input"
                bind:value={txtPesquisa}
                onkeypress={filtrarCursos}
                onfocusout={filtrarCursos}
                autocomplete="off"
            />
        </div>
        <div class="table-container">
            <table class="table table-hover">
                <thead class="text-text-primary">
                    <tr>
                        <th>Nome</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {#each cursosDisplay as curso}
                        <tr class="">
                            <th class="w-full border-b text-">
                                <p>{curso.nome}</p>
                            </th>
                            <th class="border-b text-text-primary">
                                <button
                                    class="btn my-auto variant-filled-primary font-bold hover:brightness-90"
                                    onclick={() => {
                                        alterarCurso(
                                            curso.id,
                                            curso.nome,
                                            curso.descricao,
                                        );
                                    }}>Alterar</button
                                >
                                <button
                                    class="btn my-auto variant-filled-error font-bold hover:brightness-90"
                                    onclick={() => {
                                        openModal(
                                            "Deletar Curso",
                                            "Tem certeza que deseja excluir esse curso?",
                                            curso.id,
                                        );
                                    }}
                                >
                                    Excluir
                                </button>
                            </th>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
