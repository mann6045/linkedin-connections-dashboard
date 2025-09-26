// src/services/api.ts
import { getAuthHeaders } from './auth'; // We'll create this helper
import type { LinkedInConnection, LinkedInCompany } from '../types';

const VOYAGER_API_BASE = 'https://www.linkedin.com/voyager/api';

// Fetches the initial list of connections (URNs and basic info)
export async function fetchConnectionsList(start = 0, count = 50): Promise<any> {
    const headers = await getAuthHeaders();
    const url = `${VOYAGER_API_BASE}/relationships/connections?decoration=(elements*(entityUrn,firstName,lastName,occupation,profilePicture(displayImage~:playableStreams)))&count=${count}&start=${start}&sortType=RECENTLY_ADDED`;

    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error('Failed to fetch connections list.');
    }
    return response.json();
}

// Fetches detailed profile data for a specific connection
export async function fetchConnectionDetail(urn: string): Promise<LinkedInConnection> {
    const headers = await getAuthHeaders();
    // This is a simplified example; the actual endpoint might require more complex decorations
    const url = `${VOYAGER_API_BASE}/identity/profiles/${urn}/profileView`;

    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`Failed to fetch details for ${urn}`);
    }
    const data = await response.json();
    
    // Process the complex response to extract the needed data
    // This part requires careful inspection of the network response in DevTools
    const position = data.positionGroupView?.elements?.[0];
    const company = position?.company;

    return {
        profilePicture: data.profilePicture?.displayImageReference?.vectorImages?.[2]?.rootUrl + data.profilePicture?.displayImageReference?.vectorImages?.[2]?.artifacts?.[2]?.fileIdentifyingUrlPathSegment,
        fullName: `${data.firstName} ${data.lastName}`,
        position: position?.title,
        companyName: company?.name,
        companyLogo: company?.logo?.image?.rootUrl + company?.logo?.image?.artifacts?.[2]?.fileIdentifyingUrlPathSegment,
        companyUrn: company?.entityUrn,
    };
}

// A helper to get the required auth headers
async function getAuthHeaders() {
    const cookies = await chrome.cookies.getAll({ domain: ".linkedin.com" });
    const liAtCookie = cookies.find(c => c.name === 'li_at');
    const csrfToken = cookies.find(c => c.name === 'JSESSIONID')?.value?.replace(/"/g, '');

    if (!liAtCookie || !csrfToken) {
        throw new Error('Authentication cookies not found. Please log in to LinkedIn.');
    }

    return {
        'Accept': 'application/vnd.linkedin.normalized+json+2.1',
        'Csrf-Token': csrfToken,
    };
}