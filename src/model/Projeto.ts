import FileHandler from "$lib/FileHandler";
import { textoEnumEstadoProjeto, type EnumEstadoProjeto } from "./EnumEstadoProjeto";
import type { EnumParecerProposta } from "./EnumParecerProposta";
import type Imagem from "./Imagem";
import Tag from "./Tag";
import Usuario from "./Usuario";

class Projeto {
  id: number;
  idUsuario: number;
  nome: string;
  descricao: string;
  justificativa: string;
  dataInicio: string;
  dataFim: string | null;
  imagem: Imagem | null;
  tags: Tag[];
  usuarios: Usuario[];
  estado: EnumEstadoProjeto;
  propostaAprovada: EnumParecerProposta;

  constructor(
    id: number,
    idUsuario: number,
    nome: string,
    descricao: string,
    justificativa: string,
    estado: EnumEstadoProjeto,
    dataInicio: string = "",
    imagem: Imagem | null = null,
    tags: Tag[] = [],
    usuarios: Usuario[] = [],
    dataFim: string | null,
    propostaAprovada: EnumParecerProposta,
  ) {
    this.id = id;
    this.idUsuario = idUsuario;
    this.nome = nome;
    this.descricao = descricao;
    this.justificativa = justificativa;
    this.dataInicio = dataInicio;
    this.dataFim = dataFim;
    this.imagem = imagem;
    this.tags = tags;
    this.usuarios = usuarios;
    this.estado = estado;
    this.propostaAprovada = propostaAprovada;
  }

  static CriaDeDados(data: Projeto): Projeto {
    let usuarios: Usuario[] = []
    if (data.usuarios) {
      usuarios = data.usuarios.map((u: any) =>
        Usuario.CriaDeDados({ ...u, id: u.idUsuario })
      );
    }
    return new Projeto(
      data.id,
      data.idUsuario,
      data.nome,
      data.descricao,
      data.justificativa,
      data.estado,
      data.dataInicio,
      data.imagem,
      data.tags,
      usuarios,
      data.dataFim,
      data.propostaAprovada
    );
  }

  ExibeImagem() {
    return FileHandler.ExibeImagem(this.imagem);
  }

  ExibeStatus() {
    return textoEnumEstadoProjeto[this.estado]
  }
}


export default Projeto;