import Arquivo from "$model/Arquivo";
import Api from "./axiosInstance";

class ProjetoArquivoRepository {
    async PegarTodosPorProjeto(idProjeto: number): Promise<Arquivo[]> {
        const response = await Api.get(`projetos/arquivos/projeto/${idProjeto}`);

        const arquivos = response.map(Arquivo.CriaDeDados);

        return arquivos;
    }

    async ApagarArquivo(idProjeto: number) {
        const response = await Api.delete(`projetos/arquivos/deletar/${idProjeto}`)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async BaixarArquivo(idProjeto: number) {
        const response = await Api.getBlob(`arquivos/download/${idProjeto}`)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async EnviarArquivo(idProjeto: number, idUsuario: number, arquivo: File) {
        const formData = new FormData();
        formData.append('file', arquivo, arquivo.name);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
        const response = await Api.post(`projetos/arquivos/enviar?idProjeto=${idProjeto}&idUsuario=${idUsuario}`, formData, config)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

}

export default new ProjetoArquivoRepository();