<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;
</script>

<div class="auth-container">
  <div class="auth-form-container">
    <h1>Sign Up</h1>
    
    {#if form?.error}
      <div class="error">
        {form.error}
      </div>
    {/if}
    
    <form method="POST" use:enhance>
      <div class="form-group">
        <label for="email">Email *</label>
        <input 
          id="email"
          name="email"
          type="email"
          value={form?.email ?? ''}
          required
          autocomplete="email"
        />
      </div>
      
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          id="username"
          name="username"
          type="text"
          value={form?.username ?? ''}
          autocomplete="username"
        />
      </div>
      
      <div class="form-group">
        <label for="fullName">Full Name</label>
        <input 
          id="fullName"
          name="fullName"
          type="text"
          value={form?.fullName ?? ''}
          autocomplete="name"
        />
      </div>
      
      <div class="form-group">
        <label for="password">Password *</label>
        <input 
          id="password"
          name="password"
          type="password"
          required
          autocomplete="new-password"
          minlength="6"
        />
      </div>
      
      <div class="form-group">
        <label for="confirmPassword">Confirm Password *</label>
        <input 
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autocomplete="new-password"
          minlength="6"
        />
      </div>
      
      <input type="hidden" name="redirectTo" value={data.redirectTo} />
      
      <div class="form-actions">
        <button type="submit">Create Account</button>
      </div>
    </form>
    
    <div class="auth-links">
      <a href="/auth/login">Already have an account? Sign in</a>
    </div>
  </div>
</div>

<style>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
  }
  
  .auth-form-container {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .form-actions {
    margin-top: 2rem;
  }
  
  button {
    width: 100%;
    padding: 0.75rem;
    background-color: #0f766e;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #0e7490;
  }
  
  .error {
    background-color: #fecaca;
    color: #b91c1c;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1.5rem;
  }
  
  .auth-links {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
    font-size: 0.875rem;
  }
  
  .auth-links a {
    color: #0f766e;
    text-decoration: underline;
  }
</style>
