import type DadosAlert from '$model/DadosAlert';
import User from '$model/User';
import { readable, writable, type Writable } from 'svelte/store';

export const pageName = "SGTCC";
// export const apiRoute = "https://localhost:44321/api/";
export const apiRoute = "http://localhost:5000/api/";

export const connectionError = writable(200);

export const storeConvites = writable([]);

export const emptyUser = new User(0, 0, "", "", "", 1, "", "");
// const mockUser = new User(1, 1, "Gilberto Luis", "gilberto@aedb.br", "123", 1, "", "");
let user = emptyUser;
// let user = mockUser;

export const storeLogin: Writable<User|null> = writable(null);

export const storeAlerts: Writable<DadosAlert[]> = writable([]);