import type { EnumPapel } from "$model/EnumPapel";
import LoggedUser from "$model/LoggedUser";
import Usuario from "$model/Usuario";
import Api from "./axiosInstance";

class AuthRepository {
    async AtivarConta(token: string): Promise<Usuario> {
        const response = await Api.post(`auth/activate-account?token=${token}`, null).catch((error) => {
            console.log(error);
            return null;
        });

        return response;
    }

    async RedefinirSenha(token: string, novaSenha: string): Promise<Usuario> {
        const data = {
            token: token,
            novaSenha: novaSenha
        }
        const response = await Api.post(`auth/reset-password`, data).catch((error) => {
            console.log(error);
            return null;
        });

        return response;
    }

    async PedirRedefinicaoDeSenha(email: string): Promise<boolean> {
        const response = await Api.post(`auth/request-password-reset?email=${email}`, null).catch((error) => {
            console.log(error);
            return null;
        });

        return response;
    }
}

export default new AuthRepository();