<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { enhance } from '$app/forms';
  
  // Import page data from server
  export let data;
  export let form;
  
  // Toggle between client-side and server-side form
  let useServerAction = false;
  
  // Server-loaded data
  const { serverData, serverError } = data;
  
  // Client form state
  let name = '';
  let description = '';
  let formError = null;
  let isSubmitting = false;
  let successMessage = '';
  
  // Insert new data using client-side approach
  async function handleClientSubmit() {
    formError = null;
    successMessage = '';
    isSubmitting = true;
    
    try {
      if (!name.trim()) {
        throw new Error('Name is required');
      }
      
      const { data, error } = await supabase
        .from('test_items')
        .insert([
          { name, description: description || 'No description provided' }
        ])
        .select();
      
      if (error) throw error;
      
      // Success
      name = '';
      description = '';
      successMessage = 'Item added successfully!';
      
      // Refresh the page after a short delay to show the new data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err) {
      formError = err.message || 'An unexpected error occurred';
      console.error('Error adding item:', err);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="container">
  <h1>Supabase Connection Test</h1>
  
  <div class="toggle-container">
    <button 
      class={!useServerAction ? 'active' : ''} 
      on:click={() => useServerAction = false}
    >
      Client-side Insert
    </button>
    <button 
      class={useServerAction ? 'active' : ''} 
      on:click={() => useServerAction = true}
    >
      Server Action
    </button>
  </div>
  
  <h2>Insert New Item</h2>
  
  {#if !useServerAction}
    <!-- Client-side form -->
    <form on:submit|preventDefault={handleClientSubmit} class="insert-form">
      <div class="form-group">
        <label for="name">Name (required):</label>
        <input 
          id="name" 
          type="text" 
          bind:value={name} 
          placeholder="Enter item name"
          disabled={isSubmitting}
        />
      </div>
      
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea 
          id="description" 
          bind:value={description} 
          placeholder="Enter description (optional)"
          rows="3"
          disabled={isSubmitting}
        ></textarea>
      </div>
      
      {#if formError}
        <div class="error">
          <p>Error: {formError}</p>
        </div>
      {/if}
      
      {#if successMessage}
        <div class="success">
          <p>{successMessage}</p>
        </div>
      {/if}
      
      <button 
        type="submit" 
        class="submit-button" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add New Item (Client-side)'}
      </button>
      
      <div class="note">
        <p>This form uses client-side JavaScript and the Supabase JS client to insert data.</p>
      </div>
    </form>
  {:else}
    <!-- Server-side form using form actions -->
    <form method="POST" action="?/addItem" use:enhance class="insert-form">
      <div class="form-group">
        <label for="server-name">Name (required):</label>
        <input 
          id="server-name" 
          name="name" 
          type="text" 
          placeholder="Enter item name"
          value={form?.name || ''}
        />
      </div>
      
      <div class="form-group">
        <label for="server-description">Description:</label>
        <textarea 
          id="server-description" 
          name="description" 
          placeholder="Enter description (optional)"
          rows="3"
          value={form?.description || ''}
        ></textarea>
      </div>
      
      {#if form?.error}
        <div class="error">
          <p>Error: {form.error}</p>
        </div>
      {/if}
      
      {#if form?.success}
        <div class="success">
          <p>Item added successfully!</p>
        </div>
      {/if}
      
      <button type="submit" class="submit-button">
        Add New Item (Server Action)
      </button>
      
      <div class="note">
        <p>This form uses SvelteKit's form actions to process the data on the server.</p>
      </div>
    </form>
  {/if}
  
  <div class="divider"></div>
  
  <h2>Data from Supabase:</h2>
  {#if serverError}
    <div class="error">
      <p>Error: {serverError}</p>
      <p>Make sure your table exists in your database.</p>
    </div>
  {:else if !serverData || serverData.length === 0}
    <p>No data found. Make sure your table exists and has records.</p>
  {:else}
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {#each serverData as item}
            <tr>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    
    <details>
      <summary>View Raw JSON Data</summary>
      <pre>{JSON.stringify(serverData, null, 2)}</pre>
    </details>
  {/if}
</div>

<style>
  .container {
    max-width: 900px;
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
  
  .success {
    background-color: #e8f5e9;
    color: #2e7d32;
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
  
  .insert-form {
    background-color: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .submit-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
  }
  
  .submit-button:hover {
    background-color: #45a049;
  }
  
  .submit-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .divider {
    height: 1px;
    background-color: #e0e0e0;
    margin: 2rem 0;
  }
  
  .toggle-container {
    display: flex;
    margin-bottom: 1.5rem;
  }
  
  .toggle-container button {
    flex: 1;
    padding: 0.75rem;
    background-color: #f1f1f1;
    border: 1px solid #ddd;
    cursor: pointer;
  }
  
  .toggle-container button:first-child {
    border-radius: 4px 0 0 4px;
  }
  
  .toggle-container button:last-child {
    border-radius: 0 4px 4px 0;
  }
  
  .toggle-container button.active {
    background-color: #4CAF50;
    color: white;
    border-color: #4CAF50;
  }
  
  .note {
    font-size: 0.875rem;
    color: #666;
    margin-top: 1rem;
    font-style: italic;
  }
  
  .data-table {
    overflow-x: auto;
    margin-bottom: 1.5rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 0.75rem;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  details {
    margin-top: 2rem;
  }
  
  summary {
    cursor: pointer;
    padding: 0.5rem;
    background-color: #f5f5f5;
    border-radius: 4px;
    font-weight: bold;
  }
</style> 