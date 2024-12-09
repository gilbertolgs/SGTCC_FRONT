<script lang="ts">
    import { onMount } from 'svelte';
    import { pageName } from '../../stores';
    import type Curso from '$model/Curso'
    import Usuario from '$model/Usuario';
    import Api from '$repository/axiosInstance';
    import { goto } from '$app/navigation';

    let txtNome: string = $state();
    let txtEmail: string = $state();
    let txtSenha: string = $state();
    let lstCurso: number = $state();    
    
    let cursos: Curso[] = $state([]);
    
    async function getData(){
        cursos = await Api.get('cursos');
    }

    onMount(getData);

    function checarCampos(){
        if(lstCurso == undefined){
            return false;
        }
        else if(txtNome == undefined){
            return false;
        }
        else if(txtEmail == undefined || txtEmail.includes('@aedb.br') == false){
            return false;
        }
        else if(txtSenha == undefined){
            return false;
        }
        return true;
    }

    async function criarUsuario(){
        if(checarCampos()){
            const user = new Usuario(
                0,
                lstCurso,
                txtNome,
                txtEmail,
                txtSenha,
                1,
            );
            
            //TODO SEPARAR ROTAS CRIAR USUARIO E CRIAR ADMIN/PROFESSOR
            const res = await Api.post('usuarios/CriarUsuario', user);

            if(res){
                goto('login');
            }

        }
    }
</script>

<svelte:head>
	<title>{pageName} - Cadastro</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="p-6 space-y-6 shadow-xl mx-auto md:w-2/4 md:my-3 md:card transition-all">
    <div class="text-center">
		<span class="bg-surface-100-800-token p-2 text-sm">Realizar Cadastro</span>
	</div>
    <form class="space-y-4">
        <label class="label">
            <span>Nome</span>
            <input
                class="input"
                type="text"
                name="text"
                placeholder="exemplo"
                bind:value={txtNome}
            />
        </label>
        <label class="label">
            <span>Email</span>
            <input
                class="input"
                type="email"
                name="email"
                placeholder="exemplo@aedb.br"
                bind:value={txtEmail}
            />
        </label>
        <label class="label">
            <span>Senha</span>
            <input
                class="input"
                type="password"
                name="password"
                placeholder="******"
                bind:value={txtSenha}
            />
        </label>
        <label class="label">
            <span>Confirmar Senha</span>
            <input
                class="input"
                type="password"
                name="confirmPassword"
                placeholder="******"
            />
        </label>
        <label class="label">
            <span>Curso</span>
            <select bind:value={lstCurso} name="" id="" class="input">
                {#each cursos as curso}
                    <option value="{curso.id}">{curso.nome}</option>
                {/each}
            </select>
        </label>
    </form>
    <div class="flex justify-between flex-wrap">
        <div class="grid">
            <div>
                <a class="text-sm unstyled py-2 text-slate-500 underline" href="/usuario/login"
                    >Já possui uma conta?</a
                >
            </div>
        </div>
        <input
            class="btn variant-filled-primary my-auto hover:cursor-pointer"
            type="submit"
            value="Cadastrar"
            onclick={criarUsuario}
        />
    </div>
</div>