class Seminario {
  id: number;
  idUsuario: number;
  requisitos: string;
  data: string;
  criadoEm: string;
  editadoEm: string | null;
  nomeCriador: string;

  constructor(
    id: number,
    idUsuario: number,
    requisitos: string,
    data: string,
    criadoEm: string,
    editadoEm: string | null,
    nomeCriador: string
  ) {
    this.id = id;
    this.idUsuario = idUsuario;
    this.requisitos = requisitos;
    this.data = data;
    this.criadoEm = criadoEm;
    this.editadoEm = editadoEm;
    this.nomeCriador = nomeCriador;
  }

  static CriaDeDados(data: Seminario): Seminario {
    return new Seminario(
      data.id,
      data.idUsuario,
      data.requisitos,
      data.data,
      data.criadoEm,
      data.editadoEm,
      data.nomeCriador
    );
  }
}

export default Seminario;