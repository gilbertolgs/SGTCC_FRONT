import Curso from "$model/Curso";
import Api from "./axiosInstance";

class CursoRepository {
    async PegarPorId(id: number): Promise<Curso> {
        const response = await Api.get(`cursos/${id}`);

        const curso = Curso.CriaDeDados(response);

        return curso;
    }

    async PegarTodos(): Promise<Curso[]> {
        const response = await Api.get(`cursos`);

        const cursos = response.map(Curso.CriaDeDados);

        return cursos;
    }

    async CriarCurso(nome: string, descricao: string) {
        const data = {
            nome: nome,
            descricao: descricao
        };
        const response = await Api.post(`cursos/criarCurso`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async AtualizarCurso(id: number, nome: string, descricao: string) {
        const data = {
            id: id,
            nome: nome,
            descricao: descricao
        };
        const response = await Api.put(`cursos/atualizarCurso`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async AlterarImagem(idCurso: number, imagem: Blob, nomeImagem: string) {
        const formData = new FormData();

        formData.append('file', imagem, nomeImagem);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        const response = await Api.post(`cursos/alterarImagem?idCurso=${idCurso}`, formData, config)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async DeletarCurso(idCurso: number) {
        const response = await Api.delete(`cursos/${idCurso}/deletarCurso`)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }
}

export default new CursoRepository();