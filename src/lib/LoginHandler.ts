import Cookie from "$model/Cookie";
import LoggedUser from "$model/LoggedUser";
import UsuarioRepository from "$repository/UsuarioRepository";
import { storeLogin } from "../stores";


class LoginHandler {
    PegaLogin() {
        let usuarioLogado: LoggedUser | null = $state(null);
        storeLogin.subscribe((value) => {
            usuarioLogado = value;
        });
        return usuarioLogado;
    }

    async FazerLogin(email: string, senha: string) {
        if (email == undefined) {
            throw new Error("E-mail inválido");
            // Alert.display("E-mail inválido", "variant-filled-warning");
        } else if (senha == undefined) {
            throw new Error("Senha inválida");
            // Alert.display("Senha inválida", "variant-filled-warning");
        }

        const login = await UsuarioRepository.Login(email, senha);
        if(login == null) {
            console.log(login);
            throw new Error("Ocorreu um Erro ao tentar Realizar Login");
        }

        const user = await UsuarioRepository.PegarPorEmail(email);

        const saveCookieUser = new LoggedUser(
            user.id,
            user.idCurso,
            user.nome,
            login.email,
            "",
            user.papel,
            user.imagem,
            login.token,
        );
        console.log(saveCookieUser);
        

        storeLogin.set(saveCookieUser);
        this.SalvarCookie(login, saveCookieUser);
        return user;
    }

    async Deslogar() {
        Cookie.removeCookie("email");
        Cookie.removeCookie("token");
        Cookie.removeCookie("login");
        storeLogin.set(null);
    }

    private SalvarCookie(login: any, user: LoggedUser) {
        const daysToExpire = 2;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + daysToExpire);

        Cookie.setCookie("email", login.email, expirationDate);
        Cookie.setCookie("token", login.token, expirationDate);

        Cookie.setCookie("login", JSON.stringify(user), expirationDate);
    }
}

export default new LoginHandler();