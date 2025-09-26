<script lang="ts">
    import { onMount } from 'svelte';
    import type { LinkedInConnection } from '../types';
  
    let connections: LinkedInConnection[] = [];
    let isLoading = true;
    let error: string | null = null;
  
    onMount(() => {
      // Send a message to the background script asking for the connections
      chrome.runtime.sendMessage({ type: 'GET_CONNECTIONS' }, (response) => {
        if (response.success) {
          connections = response.data;
        } else {
          error = response.error;
        }
        isLoading = false;
      });
    });
  </script>
  
  <main class="w-[600px] h-[500px] bg-gray-50 text-gray-800 p-4 font-sans">
    <header class="mb-4">
      <h1 class="text-2xl font-bold text-blue-700">LinkedIn Connections</h1>
      <p class="text-sm text-gray-500">Your professional network at a glance.</p>
    </header>
  
    {#if isLoading}
      <p class="text-center mt-8">Loading your connections... ⏳</p>
    {:else if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
        <strong class="font-bold">Error:</strong>
        <span class="block">{error}</span>
      </div>
    {:else}
      <div class="overflow-y-auto h-[380px] space-y-2">
        {#each connections as conn (conn.entityUrn)}
          <div class="flex items-center p-2 bg-white rounded-lg shadow-sm space-x-4">
            <img
              src={conn.profilePicture || 'https://via.placeholder.com/48'}
              alt={conn.fullName}
              class="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p class="font-semibold">{conn.fullName}</p>
              <p class="text-sm text-gray-600">{conn.occupation}</p>
            </div>
          </div>
        {:else}
          <p>No connections found.</p>
        {/each}
      </div>
    {/if}
  </main>