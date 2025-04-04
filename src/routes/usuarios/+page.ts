import { error } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

export const _registerUserSchema = z.object({
    papel: z.number(),
    nome: z.string(),
    email: z.string().email(),
    curso: z.number(),
    senha: z.string().min(5, 'Senhas devem ter no mínimo 5 caracteres'),
    confirmarSenha: z.string().min(5, 'Senhas devem ter no mínimo 5 caracteres'),
}).superRefine(({ email, confirmarSenha, senha }, ctx) => {
    if (!email.includes('@aedb.br')) {
        ctx.addIssue({
            code: "custom",
            message: "Emails devem ter o dominio @aedb.br.",
            path: ['email']
        });
    }
    if (confirmarSenha !== senha) {
        ctx.addIssue({
            code: "custom",
            message: "Senhas não coincidem!",
            path: ['confirmarSenha']
        });
    }
});

export const load = async ({ params, fetch }) => {
    const form = await superValidate(zod(_registerUserSchema));

    return { form };
};