import { getContext } from 'svelte';
import LoggedUser from '$model/LoggedUser';
import { readable, writable, type Writable } from 'svelte/store';
import { PUBLIC_API_ROUTE } from '$env/static/public';

export const pageName = "SGTCC";
export const apiRoute = PUBLIC_API_ROUTE;

export const connectionError = writable(200);
export const storeConvites = writable([]);

export const storeLogin: Writable<LoggedUser|null> = writable(null);