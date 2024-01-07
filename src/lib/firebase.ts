// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { writable } from 'svelte/store';

const firebaseConfig = {
	apiKey: 'AIzaSyDOZJ_4dq5Srco2ETGwvzh__U8_AS8OpjY',
	authDomain: 'treelinks-c34d4.firebaseapp.com',
	projectId: 'treelinks-c34d4',
	storageBucket: 'treelinks-c34d4.appspot.com',
	messagingSenderId: '152361654528',
	appId: '1:152361654528:web:4eac0c1361cd56fe2dbbe5',
	measurementId: 'G-KQQ1X0S8S0'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

function userStore() {
	let unsubscribe: () => void;

	if (!auth || !globalThis.window) {
		console.warn('Firebase auth not initialized');
		const { subscribe } = writable<User | null>(null);
		return {
			subscribe
		};
	}

	const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
		unsubscribe = onAuthStateChanged(auth, (user) => {
			set(user);
		});
		return () => unsubscribe();
	});
	return {
		subscribe
	};
}

export const user = userStore();
