export enum EnumTipoFiltro {
    NomeUsuario = 1,
    NomeProjeto = 2,
    Tag = 3,
}

export const textoEnumTipoFiltro = {
    [EnumTipoFiltro.NomeUsuario]: "Usuário",
    [EnumTipoFiltro.NomeProjeto]: "Projeto",
    [EnumTipoFiltro.Tag]: "Tag",
};

export const EnumTipoFiltroTodosTipos = Object.entries(textoEnumTipoFiltro).map(([key, label]) => ({
    valor: Number(key),
    label
}));