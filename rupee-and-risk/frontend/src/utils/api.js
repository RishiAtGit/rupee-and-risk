import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Axios instance with extended timeout for Render free-tier cold starts.
 * The free tier spins down after inactivity and can take 50+ seconds to wake.
 */
const api = axios.create({
    baseURL: API_BASE,
    timeout: 90000, // 90s — enough for Render cold-start (~50s) plus DB init
});

/**
 * Fetch with automatic retry. Handles Render cold-start failures gracefully
 * by retrying up to `maxRetries` times with a small delay between attempts.
 */
export async function fetchWithRetry(url, options = {}, maxRetries = 2) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await api.get(url, options);
            return response;
        } catch (error) {
            const isLastAttempt = attempt === maxRetries;
            if (isLastAttempt) throw error;

            // Wait before retrying (2s, then 4s)
            await new Promise(r => setTimeout(r, (attempt + 1) * 2000));
            console.warn(`Retry ${attempt + 1}/${maxRetries} for ${url}`);
        }
    }
}

export default api;
