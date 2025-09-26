// src/background/main.ts
import type { LinkedInConnection } from '../types';

// This helper function gets the necessary authentication headers.
// It can only work inside the background script.
async function getAuthHeaders() {
  const cookies = await chrome.cookies.getAll({ domain: ".linkedin.com" });
  const csrfToken = cookies.find(c => c.name === 'JSESSIONID')?.value?.replace(/"/g, '');

  if (!csrfToken) {
    throw new Error('Authentication cookies not found. Please make sure you are logged in to LinkedIn.');
  }

  return {
    'Accept': 'application/vnd.linkedin.normalized+json+2.1',
    'Csrf-Token': csrfToken,
  };
}

// This function fetches the list of connections from LinkedIn's internal API.
async function fetchConnectionsList(start = 0, count = 50): Promise<LinkedInConnection[]> {
  const headers = await getAuthHeaders();
  const url = `https://www.linkedin.com/voyager/api/relationships/connections?decoration=(elements*(entityUrn,firstName,lastName,occupation,profilePicture(displayImage~:playableStreams)))&count=${count}&start=${start}&sortType=RECENTLY_ADDED`;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch connections. Status: ${response.status}`);
  }
  
  const data = await response.json();

  // Transform the raw API data into our clean LinkedInConnection type
  return data.elements.map((el: any) => ({
    entityUrn: el.entityUrn,
    fullName: `${el.firstName} ${el.lastName}`,
    occupation: el.occupation,
    profilePicture: el.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier,
  }));
}

// This is the message listener. It waits for the popup to ask for data.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_CONNECTIONS') {
    // We must wrap the async call in another function
    (async () => {
      try {
        const connections = await fetchConnectionsList();
        sendResponse({ success: true, data: connections });
      } catch (error) {
        // Send a specific error message back to the UI
        sendResponse({ success: false, error: error instanceof Error ? error.message : String(error) });
      }
    })();
    return true; // This is important to allow async responses
  }
});