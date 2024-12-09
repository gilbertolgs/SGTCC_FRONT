import type Usuario from "./Usuario";

class Comentario {
    id: number;
    idProjeto: number;
    idUsuario: number;
    usuario: Usuario;
    comentario: string;
    criadoEm: string;
    editadoEm: string | null | undefined;
  
    constructor(id: number, idProjeto: number, idUsuario: number, usuario: Usuario, conteudo: string, criadoEm: string) {
      this.id = id;
      this.idProjeto = idProjeto;
      this.idUsuario = idUsuario;
      this.usuario = usuario;
      this.comentario = conteudo;
      this.criadoEm = criadoEm;
    }
  }  

export default Comentario