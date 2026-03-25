<script lang="ts">
  import { createSupabaseBrowserClient } from "$lib/supabase";
  import { goto } from "$app/navigation";

  const supabase = createSupabaseBrowserClient();

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleLogin() {
    loading = true;
    error = '';

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      error = authError.message
    } else {
      goto('/dashboard')
    }

    loading = false;
  }
</script>

<div class="container mx-auto max-w-md mt-20 p-8">
  <h1 class="text-2xl font-bold mb-8">Sign in</h1>

  <div class="flex flex-col gap-4">
    <input
      class="input"
      type="email"
      placeholder="Email"
      bind:value={email}
    />
    <input
      class="input"
      type="password"
      placeholder="Password"
      bind:value={password}
    />

    {#if error}
      <p class="text-error-500">{error}</p>
    {/if}

    <button
      class="btn preset-filled"
      onclick={handleLogin}
      disabled={loading}
    >
      {loading ? 'Signing in...' : 'Sign in'}
    </button>
  </div>
</div>
