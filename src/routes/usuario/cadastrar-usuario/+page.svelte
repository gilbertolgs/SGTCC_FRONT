<script lang="ts">
    import { onMount } from "svelte";
    import { pageName } from "../../stores";
    import type Curso from "$model/Curso";
    import Usuario from "$model/Usuario";
    import Api from "$repository/axiosInstance";
    import DadosAlert from "$model/DadosAlert";

    import { getToastStore } from "@skeletonlabs/skeleton";
    import alert from "$components/Alert";
    const toastStore = getToastStore();
    const Alert = new alert(toastStore);

    let txtNome: string = $state("");
    let txtEmail: string = $state("");
    let txtSenha: string = $state("");
    let lstCurso: number = $state(0);
    let txtPapel: string = $state("");

    let cursos: Curso[] = $state([]);

    async function getData() {
        cursos = await Api.get("cursos");
    }

    onMount(getData);

    function checarCampos() {
        if (lstCurso == undefined) {
            return false;
        } else if (txtNome == undefined) {
            return false;
        } else if (
            txtEmail == undefined ||
            txtEmail.includes("@aedb.br") == false
        ) {
            return false;
        } else if (txtSenha == undefined) {
            return false;
        }
        return true;
    }

    async function criarUsuario() {
        if (checarCampos() === false) {
            Alert.display("Complete todos campos!", "variant-filled-warning");
            return;
        }
        const user = new Usuario(
            0,
            lstCurso,
            txtNome,
            txtEmail,
            txtSenha,
            parseInt(txtPapel)
        );

        const res = await Api.post("usuarios/CriarUsuario", user).catch(
            (error) => {
                console.log(error);

                if (error.response.status) {
                    Alert.display("Ocorreu um Erro!", "variant-filled-error");
                    return;
                }
            },
        );
        Alert.display("Usuário criado com sucesso!", "variant-filled-success");
    }

    const papeis = [
        { id: 2, nome: "Professor" },
        { id: 3, nome: "Administrador" },
    ];
</script>

<svelte:head>
    <title>{pageName} - Cadastro</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="flex items-center text-text-primary">
    <div class="h-max mx-auto flex flex-col items-center w-full">
        <div
            class="bg-base-100 shadow-xl p-10 flex flex-col gap-4 text-sm rounded-xl lg:w-1/2 w-full"
        >
            <div class="flex flex-col">
                <label class="font-bold inline-block pb-2" for="text"
                    >Nome</label
                >
                <input
                    bind:value={txtNome}
                    required
                    class="input input-bordered"
                    type="text"
                    name="text"
                    placeholder="exemplo"
                />
            </div>
            <div class="flex flex-col">
                <label class="font-bold inline-block pb-2" for="email"
                    >Email</label
                >
                <input
                    bind:value={txtEmail}
                    required
                    class="input input-bordered"
                    type="email"
                    name="email"
                    placeholder="exemplo@aedb.br"
                />
            </div>
            <div class="flex flex-col">
                <label class="font-bold inline-block pb-2" for="password"
                    >Senha</label
                >
                <input
                    bind:value={txtSenha}
                    required
                    class="input input-bordered"
                    type="password"
                    name="password"
                    placeholder="******"
                />
            </div>
            <div class="flex flex-col">
                <label class="font-bold inline-block pb-2" for="password"
                    >Confirmar Senha</label
                >
                <input
                    required
                    class="input input-bordered"
                    type="password"
                    name="password"
                    placeholder="******"
                />
            </div>
            <div class="flex flex-col">
                <label class="font-bold inline-block pb-2" for="text"
                    >Curso</label
                >
                <select
                    bind:value={lstCurso}
                    class="select select-bordered px-5 py-2"
                >
                    {#each cursos as curso}
                        <option value={curso.id}>{curso.nome}</option>
                    {/each}
                </select>
            </div>
            <div class="flex flex-col">
                <label class="font-bold inline-block pb-2" for="text"
                    >Papel</label
                >
                <select
                    name=""
                    id=""
                    bind:value={txtPapel}
                    class="select select-bordered px-5 py-2"
                >
                    {#each papeis as papel}
                        <option value={papel.id}>{papel.nome}</option>
                    {/each}
                </select>
            </div>
            <button
                class="btn bg-primary-500 ml-auto m-2"
                onclick={criarUsuario}
            >
                Cadastrar
            </button>
        </div>
    </div>
</div>
