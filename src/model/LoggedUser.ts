import type Imagem from "./Imagem";
import Usuario from "./Usuario";

class LoggedUser extends Usuario {
  id: number;
  token: string;

  constructor(
    id: number,
    idCurso: number,
    nome: string,
    email: string,
    senha: string,
    papel: number,
    imagem: Imagem | null,
    token: string,
  ) {
    super(0, idCurso, nome, email, senha, papel, imagem);
    this.id = id;
    this.token = token;
  }
}

export default LoggedUser;
