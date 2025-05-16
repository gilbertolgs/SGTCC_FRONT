class Bibliografia {
  id: number;
  idUsuario: number;
  idProjeto: number;
  autores: string;
  referencia: string;
  acessadoEm: string;

  constructor(
    id: number,
    idUsuario: number,
    idProjeto: number,
    autores: string,
    referencia: string,
    acessadoEm: string
  ) {
    this.id = id;
    this.idUsuario = idUsuario;
    this.idProjeto = idProjeto;
    this.autores = autores;
    this.referencia = referencia;
    this.acessadoEm = acessadoEm;
  }

  static CriaDeDados(data: Bibliografia): Bibliografia {
    return new Bibliografia(
      data.id,
      data.idUsuario,
      data.idProjeto,
      data.autores,
      data.referencia,
      data.acessadoEm
    );
  }
}

export default Bibliografia;
