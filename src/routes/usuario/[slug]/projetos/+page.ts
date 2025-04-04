import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

export const _createProjectSchema = z.object({
    nome: z.string().min(3, "Insira um nome"),
    descricao: z.string().min(5, "Insira uma descrição").max(300, "Descrição muito longa"),
    justificativa: z.string().min(5, "Insira uma Justificativa").max(300, "Justificativa muito longa"),
    tags: z.string().min(2, "Insira Tag").array().min(1, "Insira no mínimo uma Tag")
});

export const load = async ({ params, fetch }) => {
    const form = await superValidate(zod(_createProjectSchema));

    const idUsuario = parseInt(params.slug);

    return { form, idUsuario };
};