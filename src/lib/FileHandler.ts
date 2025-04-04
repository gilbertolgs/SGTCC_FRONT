import type Imagem from "$model/Imagem";
import { apiRoute } from "../stores";

class FileHandler {
    CarregaImagem(id: number, diretorio: string, extensao: string) {
        const rotaBase = apiRoute.replace('/api/', '');
        const imagem = id + extensao;
        const diretorioFinal = `/${diretorio}/`

        return rotaBase + diretorioFinal + imagem;
    }

    ExibeImagem(img: Imagem | null) {
        if (!img) {
            return "";
        }

        const imagem = this.CarregaImagem(img.id, img.diretorio, img.extensao);

        if (img.editadoEm) {
            return imagem + "?editadoEm=" + img.editadoEm;
        }
        return imagem;
    }
}

export default new FileHandler();