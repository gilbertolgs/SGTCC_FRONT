<script lang="ts">
    import IconBrandGoogle from "$icons/xmark-solid.svelte";

    import { pageName, storeLogin } from "../../stores";
    import Api from "$repository/axiosInstance";
    import Cookie from "$model/Cookie";
    import { goto } from "$app/navigation";
    import User from "$model/User";

    import { getToastStore } from "@skeletonlabs/skeleton";
    import alert from "$components/Alert";
    const toastStore = getToastStore();
    const Alert = new alert(toastStore);

    const imgGoogleLogo =
        "https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA";

    let txtEmail: string = $state("");
    let txtSenha: string = $state("");

    async function fazerLogin() {
        if (txtEmail == undefined) {
            Alert.display("E-mail inválido", "variant-filled-warning");
        } else if (txtSenha == undefined) {
            Alert.display("Senha inválida", "variant-filled-warning");
        } else {
            const login: any = await Api.post("usuarios/login", {
                email: txtEmail,
                senha: txtSenha,
            }).catch((error) => {
                console.log(error);

                if (error.response.status == 401) {
                    Alert.display("E-mail inválido", "variant-filled-error");
                }
                else if (error.response.status) {
                    Alert.display("Ocorreu um Erro!", "variant-filled-error");
                }
            });

            const user = await Api.get("usuarios/email", {
                email: login.email,
            });

            const saveCookieUser = new User(
                user.id,
                user.idCurso,
                user.nome,
                login.email,
                "",
                user.papel,
                null,
                login.token,
            );

            storeLogin.set(saveCookieUser);
            salvarCookie(login, saveCookieUser);
            goto("/biblioteca");
        }
    }

    function fazerLoginKeyPress(event: KeyboardEvent) {
        if (event.key == "Enter") {
            fazerLogin();
        }
    }

    function salvarCookie(login: any, user: any) {
        const daysToExpire = 2;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + daysToExpire);

        Cookie.setCookie("email", login.email, expirationDate);
        Cookie.setCookie("token", login.token, expirationDate);

        Cookie.setCookie("login", JSON.stringify(user), expirationDate);
    }

    function autenticarComGoogle() {
        // 746194409228-sqfmk57703bpom2cm94ed18b5hoa4pla.apps.googleusercontent.com
        const clientId =
            "746194409228-sqfmk57703bpom2cm94ed18b5hoa4pla.apps.googleusercontent.com"; // Obtenha isso do Google Cloud Console
        const redirectUri = "http://localhost:5173/signin-google";
        const state = "db22af68-dfe5-48f0-9dc9-225c6064fcb9";

        let url = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile`;
        console.log(url);
        // goto(url);
        // window.location = url;
    }
</script>

<svelte:head>
    <title>{pageName} - Login</title>
    <meta name="Pagina de login de SGTCC" content="Formulário de login" />
</svelte:head>

<div
    class="p-6 space-y-6 shadow-xl mx-auto md:w-2/4 md:my-3 md:card transition-all"
>
    <div class="text-center">
        <span class="bg-surface-100-800-token p-2 text-sm">Realizar Login</span>
    </div>
    <form class="space-y-4">
        <label class="label">
            <span>E-mail</span>
            <input
                class="input"
                type="email"
                name="email"
                placeholder="exemplo@aedb.br"
                bind:value={txtEmail}
                onkeypress={fazerLoginKeyPress}
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
                onkeypress={fazerLoginKeyPress}
            />
        </label>
    </form>
    <div class="space-y-2">
        <label class="flex items-center space-x-2 w-max">
            <input class="checkbox" type="checkbox" />
            <p>Lembrar E-mail</p>
        </label>
    </div>
    <div class="flex justify-between flex-wrap">
        <div class="grid">
            <div>
                <a
                    class="text-sm unstyled py-2 text-slate-500 underline"
                    href="/">Esqueceu a senha?</a
                >
            </div>
            <p class="text-sm unstyled py-2 text-slate-500 underline">
                <a href="/usuario/cadastro">Criar conta</a>
            </p>
        </div>
        <input
            class="btn variant-filled-primary my-auto hover:cursor-pointer"
            type="submit"
            value="Login"
            onclick={fazerLogin}
        />
    </div>
    <div class="text-center">
        <hr class="-mb-4" />
        <span class="bg-surface-100-800-token p-2 text-sm"
            >Ou fazer login com</span
        >
    </div>
    <div
        class="flex flex-wrap space-y-4 space-x-0 md:flex-nowrap md:space-x-4 md:space-y-0"
    >
        <button
            class="btn variant-ringed-surface w-full gap-2 hover:variant-filled-primary transition-all"
            onclick={autenticarComGoogle}
            ><img
                src={imgGoogleLogo}
                alt="Logo do Google"
                class="w-3"
            />Google</button
        >
    </div>
</div>
