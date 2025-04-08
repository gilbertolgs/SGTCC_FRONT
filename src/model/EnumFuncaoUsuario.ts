export enum EnumFuncaoUsuario {
    LiderProjeto = 1,
    Membro = 2,
    Orientador = 3
}

export const textoEnumFuncaoUsuario: Record<EnumFuncaoUsuario, string> = {
    [EnumFuncaoUsuario.LiderProjeto]: "Criador",
    [EnumFuncaoUsuario.Membro]: "Membro",
    [EnumFuncaoUsuario.Orientador]: "Orientador",
};

export const EnumFuncaoUsuarioTodosPapeis = Object.entries(textoEnumFuncaoUsuario).map(([key, label]) => ({
    valor: Number(key),
    label
}));