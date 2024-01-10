<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
    import { db, user, userData } from '$lib/firebase';
    import { doc, getDoc, writeBatch } from 'firebase/firestore';

    let username='';
    let isLoading=false;
    let isAvailable=false;
    let debounceTimer: NodeJS.Timeout;

    // regex checking username contains alphanumeric characters only
    const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // reactive declarations re-run wheneever their values change
    $: isValid = username?.length > 2 && username.length < 16 && re.test(username);
    $: isTouched = username.length > 0;
    $: isTaken = isTouched && !isAvailable && !isLoading;


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
    }, 200);
}


    async function confirmUsername() {
    console.log("confirming username", username);
    // make sure both refs succeed or fail together as a pair
    const batch = writeBatch(db);
    batch.set(doc(db, "usernames", username), { uid: $user?.uid });
    batch.set(doc(db, "users", $user!.uid), { 
      username, 
      photoURL: $user?.photoURL ?? null,
      published: true,
      bio: 'foo',
      links: [
        {
          title: 'bar',
          url: 'https://github.com',
          icon: 'baz'
        }
      ]
    });

    await batch.commit();
    username = '';
    isAvailable=false;
    };

</script>

<AuthCheck>
  {#if $userData.username}
  <p class="text-lg">
    Your username is <span class="text-success font-bold"
      >@{$userData.username}</span
    >
  </p>
  <p class="text-sm">(Usernames cannot be changed)</p>
  <a class="btn btn-primary" href="/login/photo">Upload Profile Image</a>
  {:else}
    <form class='w-2/5' on:submit|preventDefault={confirmUsername}>
        <input 
        type='text'
        placeholder='Username'
        class='input w-full'
        bind:value={username}
        on:input={checkAvailability}
        class:input-error={(isValid && isTouched)}
        class:input-warning={isTaken}
        class:input-success={isAvailable && isValid && !isLoading}
        />

        <div class="my-4 min-h-16 px-8 w-full">
            {#if isLoading}
              <p class="text-secondary">Checking availability of @{username}...</p>
            {/if}
        
            {#if !isValid && isTouched}
              <p class="text-error text-sm">
               username must be 3-16 characters long, alphanumeric only
              </p>
            {/if}
        
            {#if isValid && !isAvailable && !isLoading}
              <p class="text-warning text-sm">
                @{username} is not available
              </p>
            {/if}
        
            {#if isAvailable}
              <button class="btn btn-success">Confirm username @{username} </button>
            {/if}
          </div>
    </form>
    {/if}
  </AuthCheck>
