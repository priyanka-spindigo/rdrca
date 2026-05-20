import { createClient, type ClientConfig, type QueryParams } from '@sanity/client';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production';
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION ?? '2024-05-01';

export const isSanityConfigured = Boolean(projectId);

function getClientConfig(): ClientConfig | null {
  if (!projectId) return null;

  return {
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: 'published',
    token: import.meta.env.SANITY_API_READ_TOKEN,
  };
}

/** Shared Sanity client for build-time fetches (SSG). */
export function getSanityClient() {
  const config = getClientConfig();
  if (!config) return null;
  return createClient(config);
}

/** Run a GROQ query with safe fallback when Sanity is not configured. */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  fallback: T,
): Promise<T> {
  const client = getSanityClient();
  if (!client) {
    console.warn('[sanity] PUBLIC_SANITY_PROJECT_ID is not set — using fallback data.');
    return fallback;
  }

  try {
    return await client.fetch<T>(query, params);
  } catch (error) {
    console.error('[sanity] Query failed:', error);
    return fallback;
  }
}
