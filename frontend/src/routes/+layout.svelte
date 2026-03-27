<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import { AppBar } from '@skeletonlabs/skeleton-svelte';

  import { createSupabaseBrowserClient } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { afterNavigate } from '$app/navigation'
  import { page } from '$app/stores'
  import auth from '$lib/auth.svelte'

  const supabase = createSupabaseBrowserClient();

  let { data, children } = $props()

  $effect(() => {
    auth.authenticated = (!!data.session)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('auth event:', event, 'session:', session)
      if (!session) {
        auth.authenticated = false
        goto('/login');
      } else if (session) {
        auth.authenticated = true
      }
    })

    return () => subscription.unsubscribe();
  })

  afterNavigate(async () => {
    console.log(performance.now(), 'Checking authentication status after navigation to', $page.url.pathname)
    const { data: { session } } = await supabase.auth.getSession();
    if (!session && $page.url.pathname !== '/login') {
      auth.authenticated = false
      console.log('User is: ', auth.authenticated)
      goto('/login');
    } else if (session) {
      auth.authenticated = true
    }
  })

  async function handleSignOut() {
    await supabase.auth.signOut()
    auth.authenticated = false
    goto('/login');
  }
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="h-screen grid grid-rows-[auto_1fr]">
  <header>
    <AppBar>
      <AppBar.Toolbar class="grid-cols-[auto_auto]">
        <AppBar.Lead>
          <span class="font-bold text-xl">Vitals</span>
        </AppBar.Lead>
        <AppBar.Trail>
          <a data-sveltekit-preload-data="tap" href="/dashboard">Dashboard</a>
          <a data-sveltekit-preload-data="tap" href="/log-weight">Log Weight</a>
          <button onclick={handleSignOut}>Sign Out</button>
        </AppBar.Trail>
      </AppBar.Toolbar>
    </AppBar>
  </header>
  <main class="overflow-y-auto p-4">
    {#if auth.authenticated || $page.url.pathname === '/login'}
      {@render children()}
    {/if}
  </main>
</div>
