export const prerender = true;
export const csr = true;

export const load = ({ params }) => {
  return {
      slug: params.slug
  }
}