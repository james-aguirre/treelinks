<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
    import { db, user } from '$lib/firebase';
    import { doc, getDoc, writeBatch } from 'firebase/firestore';

    let username='';
    let isLoading=false;
    let isAvailable=false;
    let debounceTimer: NodeJS.Timeout;

    async function checkAvailability(){;
    isAvailable = false;
    isLoading = true;
    clearTimeout(debounceTimer);

// prevent sending a request until the user stops typing
    debounceTimer = setTimeout(async () => {
        console.log('Checking availability of', username);
        const userRef = doc(db, 'usernames', username);
        const isValid = await getDoc(userRef).then((doc) => doc.exists());
        isAvailable = !isValid;
        isLoading = false;
    }, 500);
    }

    async function confirmUsername() {

    };

</script>

<AuthCheck>
    <h2>Username</h2>
    <form class='w-2/5' on:submit|preventDefault={confirmUsername}>
        <input 
        type='text'
        placeholder='Username'
        class='input w-full'
        bind:value={username}
        on:input={checkAvailability}
        />

        <p>Is available? {isAvailable}</p>
        <button class='btn btn-success'>Confirm username @{username}</button>
    </form>
</AuthCheck>
