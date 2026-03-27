<script lang="ts">
  import { apiFetch } from '$lib/api'
  import { onMount } from 'svelte'
  import auth from '$lib/auth.svelte'

  let entries = $state([])

  onMount(async () => {
    if (!auth.authenticated) {
      return
    }
    console.log(performance.now(), 'Fetching entries...')
    try {
      entries = await apiFetch('/api/entries')
    } catch (error) {
      console.error('Failed to fetch entries:', error)
    }
  })
</script>

<div class="container mx-auto p-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-2xl font-bold">Dashboard</h1>
  </div>

  <pre>{JSON.stringify(entries, null, 2)}</pre>
</div>
