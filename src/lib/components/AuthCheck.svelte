<script lang='ts'>
    import { user } from '$lib/firebase';
</script>

{#if $user}
<slot />
{:else}
<p class='text-error'>
    You must be signed in to view this page.
    <a href='/login' class='btn'>Sign in</a>
</p>
{/if}
