import type { EnumVisibilidadeDuvida } from "./EnumVisibilidadeDuvida";

class Duvida {
  id: number;
  idProjeto: number;
  idUsuario: number;
  texto: string;
  visibilidade: EnumVisibilidadeDuvida;

  constructor(
    id: number,
    idProjeto: number,
    idUsuario: number,
    texto: string,
    visibilidade: EnumVisibilidadeDuvida
  ) {
    this.id = id;
    this.idProjeto = idProjeto;
    this.idUsuario = idUsuario;
    this.texto = texto;
    this.visibilidade = visibilidade;
  }

  static CriaDeDados(data: Duvida): Duvida {
    return new Duvida(
      data.id,
      data.idProjeto,
      data.idUsuario,
      data.texto,
      data.visibilidade
    );
  }
}

export default Duvida;
