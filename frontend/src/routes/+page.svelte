<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  onMount(() => {
    // Redirect to the Supabase test page
    goto('/supabase-test');
  });
</script>

<div class="container mx-auto p-4 text-center">
  <h1 class="text-2xl font-bold mb-4">Redirecting to Supabase Test Page...</h1>
  <p>If you are not redirected automatically, <a href="/supabase-test" class="text-blue-500 underline">click here</a>.</p>
</div>
