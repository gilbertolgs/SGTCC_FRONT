import type { paths } from "$lib/api/v1";
import createClient from "openapi-fetch";
import { apiRoute } from "../../stores";

const url = apiRoute.replace('/api/', '');
const openApiClient = createClient<paths>({ baseUrl: url});

export default openApiClient;