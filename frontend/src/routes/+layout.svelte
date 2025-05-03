<script lang="ts">
  import '../app.css';
  import { invalidate } from '$app/navigation';
  import { onMount } from 'svelte';
  
  export let data;
  
  // Handle auth change and invalidation
  onMount(() => {
    const {
      data: { subscription },
    } = data.supabase.auth.onAuthStateChange(() => {
      invalidate('supabase:auth');
    });

    return () => subscription.unsubscribe();
  });
</script>

<main>
  <slot />
</main>
