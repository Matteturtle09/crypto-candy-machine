import { writable } from 'svelte/store';
export const providerStore = writable(null);
export const signerStore = writable(null);
export const accountStore = writable(null);
export const cardStore = writable([]);
export const cooledDown = writable(0);
