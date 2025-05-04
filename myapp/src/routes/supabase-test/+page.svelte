<script lang="ts">
  // Import page data from server
  export let data;
  
  // Server-loaded data is all we need
  const { serverData, serverError } = data;
</script>

<div class="container">
  <h1>Supabase Connection Test</h1>
  
  <h2>Data from Supabase:</h2>
  {#if serverError}
    <div class="error">
      <p>Error: {serverError}</p>
      <p>Make sure your table exists in your database.</p>
    </div>
  {:else if !serverData || serverData.length === 0}
    <p>No data found. Make sure your table exists and has records.</p>
  {:else}
    <pre>{JSON.stringify(serverData, null, 2)}</pre>
  {/if}
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .error {
    background-color: #ffebee;
    color: #c62828;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
  }
  
  pre {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    overflow: auto;
  }
</style> 