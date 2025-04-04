import FileHandler from "$lib/FileHandler";
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
  estado: number;

  constructor(
    id: number,
    idUsuario: number,
    nome: string,
    descricao: string,
    justificativa: string,
    estado: number,
    dataInicio: string = "",
    imagem: Imagem | null = null,
    tags: Tag[] = [],
    usuarios: Usuario[] = [],
    dataFim: string | null,
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
  }

  static CriaDeDados(data: Projeto): Projeto {
    let usuarios: Usuario[] = []
    if (data.usuarios) {
      usuarios = data.usuarios.map(Usuario.CriaDeDados);
    }
    return new Projeto(data.id, data.idUsuario, data.nome, data.descricao, data.justificativa, data.estado, data.dataInicio, data.imagem, data.tags, usuarios, data.dataFim);
  }

  ExibeImagem() {
    return FileHandler.ExibeImagem(this.imagem);
  }
}


export default Projeto;