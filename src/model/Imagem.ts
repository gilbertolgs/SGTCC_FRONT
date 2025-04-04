import FileHandler from "$lib/FileHandler";

class Imagem {
    id: number;
    idExterno: number;
    nomeOriginal: string;
    diretorio: string;
    extensao: string;
    criadoEm: string;
    editadoEm: string;
    tamanho: number;
    constructor(id: number, idExterno: number, nomeOriginal: string, diretorio: string, extensao: string, criadoEm: string, editadoEm: string, tamanho: number) {
        this.id = id;
        this.idExterno = idExterno;
        this.nomeOriginal = nomeOriginal;
        this.diretorio = diretorio;
        this.extensao = extensao;
        this.criadoEm = criadoEm;
        this.editadoEm = editadoEm;
        this.tamanho = tamanho;
    }
}

export default Imagem;