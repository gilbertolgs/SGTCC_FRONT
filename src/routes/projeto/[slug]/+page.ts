import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { number, z } from 'zod';

export const _alterProjectSchema = z.object({
    id: number(),
    nome: z.string().min(3, "Insira um nome"),
    descricao: z.string().min(5, "Insira uma descrição").max(300, "Descrição muito longa"),
    justificativa: z.string().min(5, "Insira uma Justificativa").max(300, "Justificativa muito longa"),
    tags: z.string().min(2, "Insira Tag").array().min(1, "Insira no mínimo uma Tag")
});

export const _addActivitySchema = z.object({
    id: number(),
    nome: z.string().min(3, "Insira um nome"),
    descricao: z.string().min(5, "Insira uma descrição").max(300, "Descrição muito longa"),
});

export const load = async ({ params, fetch }) => {
    const alterProjectForm = await superValidate(zod(_alterProjectSchema));
    const activityForm = await superValidate(zod(_addActivitySchema));

    const idProjeto = parseInt(params.slug);

    return { alterProjectForm, activityForm, idProjeto };
};