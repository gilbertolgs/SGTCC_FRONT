export enum EnumParecerProposta {
    Favoravel = 0,
    Desfavoravel = 1,
    NaoAvaliado = 2
}

export const textoEnumParecerProposta: Record<EnumParecerProposta, string> = {
    [EnumParecerProposta.Favoravel]: "Favoravel",
    [EnumParecerProposta.Desfavoravel]: "Desfavoravel",
    [EnumParecerProposta.NaoAvaliado]: "Não Avaliado",
};

export const EnumParecerPropostaTodosPapeis = Object.entries(textoEnumParecerProposta).map(([key, label]) => ({
    valor: Number(key),
    label
}));