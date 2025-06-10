export const load = async ({ params, fetch }) => {

    const idBanca = parseInt(params.slug);

    return { idBanca };
};