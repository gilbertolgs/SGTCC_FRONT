export enum EnumVisibilidadeDuvida {
    Publica = 0,
    Privada = 1
}

export const textoEnumVisibilidadeDuvida: Record<EnumVisibilidadeDuvida, string> = {
    [EnumVisibilidadeDuvida.Publica]: "Pública",
    [EnumVisibilidadeDuvida.Privada]: "Privada",
};

export const EnumVisibilidadeDuvidaTodosPapeis = Object.entries(textoEnumVisibilidadeDuvida).map(([key, label]) => ({
    valor: Number(key),
    label
}));