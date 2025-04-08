import DataFormatHandler from "$lib/DataFormatHandler";

class Arquivo {
  id: number;
  idExterno: number;
  nomeOriginal: string;
  diretorio: string;
  extensao: string;
  criadoEm: string;
  editadoEm: string | null;
  tamanho: number;

  constructor(
    id: number,
    idExterno: number,
    nomeOriginal: string,
    diretorio: string,
    extensao: string,
    criadoEm: string,
    editadoEm: string | null,
    tamanho: number
  ) {
    this.id = id;
    this.idExterno = idExterno;
    this.nomeOriginal = nomeOriginal;
    this.diretorio = diretorio;
    this.extensao = extensao;
    this.criadoEm = criadoEm;
    this.editadoEm = editadoEm;
    this.tamanho = tamanho;
  }

  static CriaDeDados(data: Arquivo): Arquivo {
    return new Arquivo(
      data.id,
      data.idExterno,
      data.nomeOriginal,
      data.diretorio,
      data.extensao,
      data.criadoEm,
      data.editadoEm,
      data.tamanho
    );
  }

  ExibeUltimaAlteracao() {
    if (this.editadoEm) {
      return DataFormatHandler.FormatDate(this.editadoEm);
    }
    return DataFormatHandler.FormatDate(this.criadoEm);
  }
}


export default Arquivo;