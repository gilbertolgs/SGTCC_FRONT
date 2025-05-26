import type { EnumVisibilidadeDuvida } from "./EnumVisibilidadeDuvida";

class Duvida {
  id: number;
  idProjeto: number;
  idUsuario: number;
  texto: string;
  visibilidade: EnumVisibilidadeDuvida;
  atendida: number;

  constructor(
    id: number,
    idProjeto: number,
    idUsuario: number,
    texto: string,
    visibilidade: EnumVisibilidadeDuvida,
    atendida: number
  ) {
    this.id = id;
    this.idProjeto = idProjeto;
    this.idUsuario = idUsuario;
    this.texto = texto;
    this.visibilidade = visibilidade;
    this.atendida = atendida;
  }

  static CriaDeDados(data: Duvida): Duvida {
    return new Duvida(
      data.id,
      data.idProjeto,
      data.idUsuario,
      data.texto,
      data.visibilidade,
      data.atendida
    );
  }
}

export default Duvida;
