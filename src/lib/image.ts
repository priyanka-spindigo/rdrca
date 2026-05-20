import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { getSanityClient, isSanityConfigured } from './sanity';

const builder = (() => {
  const client = getSanityClient();
  if (!client) return null;
  return imageUrlBuilder(client);
})();

export function urlForImage(
  source: SanityImageSource | undefined,
  options?: { width?: number; height?: number; quality?: number },
): string {
  if (!source || !builder) return '';

  let url = builder.image(source).auto('format');

  if (options?.width) url = url.width(options.width);
  if (options?.height) url = url.height(options.height);
  if (options?.quality) url = url.quality(options.quality);

  return url.url();
}

export function getOgImageUrl(source: SanityImageSource | undefined): string | undefined {
  const url = urlForImage(source, { width: 1200, height: 630, quality: 80 });
  return url || undefined;
}

export { isSanityConfigured };
