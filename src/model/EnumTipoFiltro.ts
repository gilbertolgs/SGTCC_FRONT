export enum EnumTipoFiltro {
    NomeUsuario = 1,
    NomeProjeto = 2,
    Tag = 3,
}

export const textoEnumTipoFiltro = {
    [EnumTipoFiltro.NomeUsuario]: "NomeUsuario",
    [EnumTipoFiltro.NomeProjeto]: "NomeProjeto",
    [EnumTipoFiltro.Tag]: "Tag",
};

export const EnumTipoFiltroTodosPapeis = Object.entries(textoEnumTipoFiltro).map(([key, label]) => ({
    valor: Number(key),
    label
}));