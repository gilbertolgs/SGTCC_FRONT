export enum EnumTipoOrdenacao {
    MaisAvaliados = 1,
    MenosAvaliados = 2,
    Recentes = 3,
    Antigos = 4
}

export const textoEnumTipoOrdenacao: Record<EnumTipoOrdenacao, string> = {
    [EnumTipoOrdenacao.MaisAvaliados]: "MaisAvaliados",
    [EnumTipoOrdenacao.MenosAvaliados]: "MenosAvaliados",
    [EnumTipoOrdenacao.Recentes]: "Recentes",
    [EnumTipoOrdenacao.Antigos]: "Antigos",
};

export const EnumTipoOrdenacaoTodosPapeis = Object.entries(textoEnumTipoOrdenacao).map(([key, label]) => ({
    valor: Number(key),
    label
}));