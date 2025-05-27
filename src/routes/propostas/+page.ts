import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { number, z } from 'zod';

export const _proposalFeedback = z.object({
    id: number(),
    sugestao: z.string(),
    parecer: number()
});

export const load = async ({ params, fetch }) => {
    const proposalFeedbackForm = await superValidate(zod(_proposalFeedback));

    return { proposalFeedbackForm };
};