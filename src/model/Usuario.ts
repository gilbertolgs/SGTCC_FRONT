import FileHandler from "$lib/FileHandler";
import type { EnumConvite } from "./EnumConvite";
import { textoEnumFuncaoUsuario, type EnumFuncaoUsuario } from "./EnumFuncaoUsuario";
import { textoEnumPapel, type EnumPapel } from "./EnumPapel";
import Imagem from "./Imagem";

class Usuario {
  id: number;
  idCurso: number;
  nome: string;
  email: string;
  senha: string;
  papel: EnumPapel;
  imagem: Imagem | null;
  nomeCurso: string | null;
  funcao: EnumFuncaoUsuario | null;
  estado: EnumConvite | null

  ExibeImagem() {
    return FileHandler.ExibeImagem(this.imagem);
  }

  ExibePapel() {
    return textoEnumPapel[this.papel];
  }

  ExibeFuncao() {
    if (this.funcao) {

      return textoEnumFuncaoUsuario[this.funcao];
    }
    return '-';
  }

  constructor(
    id: number,
    idCurso: number,
    nome: string,
    email: string,
    senha: string,
    papel: EnumPapel,
    imagem: Imagem | null = null,
    nomeCurso: string | null = null,
    funcao: EnumFuncaoUsuario | null = null,
    estado: EnumConvite | null = null,
  ) {
    this.id = id;
    this.idCurso = idCurso;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.papel = papel;
    this.imagem = imagem;
    this.nomeCurso = nomeCurso;
    this.funcao = funcao;
    this.estado = estado;
  }

  static CriaDeDados(data: Usuario): Usuario {
    return new Usuario(data.id, data.idCurso, data.nome, data.email, data.senha, data.papel, data.imagem, data.nomeCurso, data.funcao, data.estado);
  }
}

export default Usuario