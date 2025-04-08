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

    FormataArquivoBaixado(response: any) {
        const contentDisposition = response.headers['content-disposition'];
        // const fileName = contentDisposition
        //     ? contentDisposition.split('filename=')[1]
        //     : nomeArquivo;
        
        const blob = new Blob([response.data], { type: response.headers['content-type'] });

        return blob
    }
}

export default new FileHandler();