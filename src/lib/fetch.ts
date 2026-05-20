import { sanityFetch } from './sanity';
import {
  blogPostBySlugQuery,
  blogPostsListQuery,
  blogSlugsQuery,
  faqsQuery,
  glossaryTermsQuery,
  importantDatesQuery,
} from './queries';
import {
  mapBlogListItem,
  mapBlogPostDetail,
  mapFaq,
  mapGlossaryTerm,
  mapImportantDate,
} from './mappers';
import type {
  BlogListItem,
  BlogPostDetail,
  FaqItem,
  GlossaryTermItem,
  ImportantDateItem,
  SanityBlogPost,
  SanityFaq,
  SanityGlossaryTerm,
  SanityImportantDate,
} from './types';

export async function getImportantDates(): Promise<ImportantDateItem[]> {
  const docs = await sanityFetch<SanityImportantDate[]>(importantDatesQuery, {}, []);
  return docs.map(mapImportantDate);
}

export async function getGlossaryTerms(): Promise<GlossaryTermItem[]> {
  const docs = await sanityFetch<SanityGlossaryTerm[]>(glossaryTermsQuery, {}, []);
  return docs.map(mapGlossaryTerm);
}

export async function getFaqs(): Promise<FaqItem[]> {
  const docs = await sanityFetch<SanityFaq[]>(faqsQuery, {}, []);
  return docs.map(mapFaq);
}

export async function getBlogPosts(): Promise<BlogListItem[]> {
  const docs = await sanityFetch<SanityBlogPost[]>(blogPostsListQuery, {}, []);
  return docs.map(mapBlogListItem);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const doc = await sanityFetch<SanityBlogPost | null>(
    blogPostBySlugQuery,
    { slug },
    null,
  );
  if (!doc?.slug) return null;
  return mapBlogPostDetail(doc);
}

export async function getBlogSlugs(): Promise<string[]> {
  const rows = await sanityFetch<{ slug: string }[]>(blogSlugsQuery, {}, []);
  return rows.map((row) => row.slug).filter(Boolean);
}
