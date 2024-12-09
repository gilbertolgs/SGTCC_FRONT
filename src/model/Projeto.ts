import Tag from "./Tag";
import Usuario from "./Usuario";

class Projeto {
  id: number;
  idUsuario: number;
  nome: string;
  descricao: string;
  justificativa: string;
  dataInicio: string;
  imagem: string | null;
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
    imagem: string | null = null,
    tags: Tag[] = [],
    usuarios: Usuario[] = [],
  ) {
    this.id = id;
    this.idUsuario = idUsuario;
    this.nome = nome;
    this.descricao = descricao;
    this.justificativa = justificativa;
    this.dataInicio = dataInicio;
    this.imagem = imagem;
    this.tags = tags;
    this.usuarios = usuarios;
    this.estado = estado;
  }
}

export default Projeto;