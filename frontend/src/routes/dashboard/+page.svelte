<script lang="ts">
  import { createSupabaseBrowserClient } from '$lib/supabase'
  import { apiFetch } from '$lib/api'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'

  const supabase = createSupabaseBrowserClient()

  let entries = $state([])

  onMount(async () => {
    try {
      entries = await apiFetch('/api/entries')
    } catch (error) {
      console.error('Failed to fetch entries:', error)
    }
  })

  async function handleSignOut() {
    await supabase.auth.signOut()
    goto('/login')
  }
</script>

<div class="container mx-auto p-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <button class="btn preset-outlined" onclick={handleSignOut}>
      Sign out
    </button>
  </div>

  <pre>{JSON.stringify(entries, null, 2)}</pre>
</div>
