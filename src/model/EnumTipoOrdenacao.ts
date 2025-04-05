export enum EnumTipoOrdenacao {
    MaisAvaliados = 1,
    MenosAvaliados = 2,
    Recentes = 3,
    Antigos = 4
}

export const textoEnumTipoOrdenacao: Record<EnumTipoOrdenacao, string> = {
    [EnumTipoOrdenacao.MaisAvaliados]: "Mais Avaliados",
    [EnumTipoOrdenacao.MenosAvaliados]: "Menos Avaliados",
    [EnumTipoOrdenacao.Recentes]: "Recentes",
    [EnumTipoOrdenacao.Antigos]: "Antigos",
};

export const EnumTipoOrdenacaoTodosOrdenacoes = Object.entries(textoEnumTipoOrdenacao).map(([key, label]) => ({
    valor: Number(key),
    label
}));