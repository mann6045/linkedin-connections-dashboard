// src/popup/main.ts

import '../app.css';
import App from './App.svelte';

const target = document.getElementById('app');

// This check confirms the element exists before creating the app.
// It makes TypeScript happy and your code safer.
if (!target) {
  throw new Error('Target element with ID "app" not found in popup.html');
}

const app = new App({
  target: target,
});

export default app;