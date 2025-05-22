import Cookie from "$model/Cookie";
import LoggedUser from "$model/LoggedUser";
import UsuarioRepository from "$repository/UsuarioRepository";
import { storeLogin } from "../stores";


class LoginHandler {
    PegaLogin() {
        storeLogin.subscribe((value) => {
            return value;
        });
    }

    async FazerLogin(email: string, senha: string) {
        if (email == undefined) {
            throw new Error("E-mail inválido");
        } else if (senha == undefined) {
            throw new Error("Senha inválida");
        }

        const login = await UsuarioRepository.Login(email, senha);
        if(login == null) {
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

        storeLogin.update(value => saveCookieUser);
        this.SalvarCookie(login, saveCookieUser);
        return user;
    }

    async Deslogar() {
        Cookie.removeCookie("email");
        Cookie.removeCookie("token");
        Cookie.removeCookie("login");
        storeLogin.update(value => null);
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