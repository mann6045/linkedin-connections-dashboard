# Svelte + TS + Vite

LinkedIn Connections Dashboard 🚀
A Chrome extension that fetches a user's LinkedIn connections and displays them in a clean, responsive dashboard. Built with Svelte, TypeScript, and TailwindCSS.

Features
View Connections: See your network with their profile picture, full name, and occupation.

Smart Caching: Connections are cached to provide a fast experience and reduce API calls.

Safe API Usage: Leverages the user's existing browser session to securely fetch data without asking for credentials.

Built with Modern Tools: Leverages TypeScript for type safety and Svelte for a reactive, performant UI.

How to Install and Run
Clone the Repository

Bash
git clone https://github.com/your-username/linkedin-connections-dashboard.git
cd linkedin-connections-dashboard
Install Dependencies

Bash
npm install
Build the Extension
Run the build command in "watch mode". This will create the dist folder and automatically update it whenever you make code changes.

Bash
npm run dev
Load into Chrome

Navigate to chrome://extensions in your Chrome browser.

Enable Developer mode using the toggle in the top-right corner.

Click the Load unpacked button.

Select the dist folder from this project directory.

Pin the extension to your toolbar for easy access.

Technical Deep Dive
How It Works: Reverse-Engineering
Since LinkedIn does not provide a public API for fetching connections, this extension uses its internal "Voyager" API.

I used the browser's Developer Tools (Network tab) to inspect the traffic on the "My Network" page.

I identified that connection data is fetched from a voyager/api/ endpoint.

Authentication is handled by programmatically accessing the browser's cookies for the linkedin.com domain. The JSESSIONID cookie is used as a csrf-token in the request headers, which validates the session and authorizes the API call. This process is handled securely by the extension's background script.

Caching Strategy
To balance data freshness with performance, the extension implements a simple caching mechanism.

Storage: It uses chrome.storage.local, which is the standard asynchronous storage for Chrome extensions.

TTL (Time-to-Live): Connection data is cached with a TTL of 10 minutes. When the user opens the popup, the extension first checks for a valid, non-expired cache entry. If found, the data is displayed instantly. Otherwise, a fresh network request is made, and the new data is stored in the cache.

Limitations and Assumptions
API Fragility: This extension relies on LinkedIn's internal API, which is subject to change without notice. Any changes to the API could potentially break the extension.

Session Requirement: The user must have an active, logged-in session on LinkedIn.com for the extension to be able to fetch data.

Scope: This is a prototype and doesn't include features like pagination for all connections, advanced filtering, or detailed profile views.
