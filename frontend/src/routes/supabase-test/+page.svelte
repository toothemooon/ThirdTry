<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/client/supabase';
  
  // Get data from server-side load function
  export let data;
  
  let items = data.initialItems || [];
  let loading = false;
  let error = data.connectionStatus?.errorMessage || null;
  let newItem = { name: '', description: '' };
  let saveStatus = '';
  
  async function fetchItems() {
    loading = true;
    error = null;
    
    try {
      const response = await fetch('/api/items');
      const result = await response.json();
      
      if (result.error) {
        error = `Error fetching items: ${result.error}`;
        if (result.error.includes('does not exist')) {
          error += '. Please create the test_items table in Supabase first.';
        }
      } else {
        items = result.items;
      }
    } catch (err: any) {
      error = `Unexpected error: ${err.message}`;
    } finally {
      loading = false;
    }
  }
  
  async function addItem() {
    if (!newItem.name) {
      saveStatus = 'Please enter a name';
      return;
    }
    
    saveStatus = 'Saving...';
    
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      
      const result = await response.json();
      
      if (result.error) {
        saveStatus = `Error adding item: ${result.error}`;
      } else {
        saveStatus = 'Item added successfully!';
        // Add the new item to the list
        items = [result.item, ...items];
        // Clear the form
        newItem = { name: '', description: '' };
      }
    } catch (err: any) {
      saveStatus = `Unexpected error: ${err.message}`;
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Supabase Connection Test</h1>
  
  <div class="mb-4 p-4 border rounded-lg">
    <h2 class="text-lg font-semibold">Connection Status:</h2>
    {#if data.connectionStatus.connected}
      <p class="text-green-600">✅ Connected to Supabase successfully!</p>
    {:else}
      <p class="text-red-600">❌ Connection error: {data.connectionStatus.errorMessage}</p>
      {#if data.connectionStatus.errorMessage?.includes('does not exist')}
        <div class="mt-2 p-3 bg-yellow-100 rounded">
          <p>You need to create the <code>test_items</code> table in Supabase.</p>
          <p class="mt-2">Go to the Supabase SQL Editor and run the SQL in the <code>create-test-table.sql</code> file.</p>
        </div>
      {/if}
    {/if}
  </div>
  
  <div class="mb-8 bg-gray-100 p-4 rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Add New Item</h2>
    
    <div class="mb-4">
      <label for="item-name" class="block mb-2">Name:</label>
      <input 
        id="item-name"
        type="text" 
        bind:value={newItem.name} 
        class="w-full p-2 border rounded"
        placeholder="Enter item name"
      />
    </div>
    
    <div class="mb-4">
      <label for="item-description" class="block mb-2">Description:</label>
      <textarea 
        id="item-description"
        bind:value={newItem.description} 
        class="w-full p-2 border rounded"
        placeholder="Enter description"
        rows="3"
      ></textarea>
    </div>
    
    <button 
      on:click={addItem}
      class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
    >
      Add Item
    </button>
    
    {#if saveStatus}
      <p class="mt-2 italic">{saveStatus}</p>
    {/if}
  </div>
  
  <div>
    <h2 class="text-xl font-semibold mb-4">Items from Supabase</h2>
    
    <button 
      on:click={fetchItems}
      class="mb-4 bg-gray-200 py-1 px-4 rounded hover:bg-gray-300"
    >
      Refresh Items
    </button>
    
    {#if loading}
      <p>Loading items...</p>
    {:else if error}
      <p class="text-red-500">{error}</p>
    {:else if items.length === 0}
      <p>No items found. Add some items above!</p>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each items as item}
          <div class="border p-4 rounded-lg">
            <h3 class="font-bold">{item.name}</h3>
            <p class="text-gray-600">{item.description || 'No description'}</p>
            <p class="text-sm text-gray-500 mt-2">
              Created: {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .container {
    max-width: 1200px;
  }
  
  code {
    background-color: #f1f1f1;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: monospace;
  }
</style> 