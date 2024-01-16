// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
