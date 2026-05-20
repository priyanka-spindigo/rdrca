import type { PortableTextBlock } from '@portabletext/types';
import type { SanityImageSource } from '@sanity/image-url';

/** Reusable SEO fields stored in Sanity. */
export interface SeoFields {
  title?: string;
  description?: string;
  ogImage?: SanityImageSource;
}

/** Raw Sanity document shapes (API responses). */
export interface SanityImportantDate {
  _id: string;
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  date: string;
  order?: number;
}

export interface SanityGlossaryTerm {
  _id: string;
  term: string;
  definition: string;
  category: string;
  subcategory?: string;
  order?: number;
}

export interface SanityFaq {
  _id: string;
  question: string;
  answer: string;
  category: string;
  subcategory?: string;
  order?: number;
}

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  subcategory?: string;
  mainImage?: SanityImageSource & { alt?: string };
  publishedAt: string;
  author?: string;
  readTime?: number;
  body?: PortableTextBlock[];
  tags?: string[];
  seo?: SeoFields;
}

/** Shapes consumed by existing client-side filter scripts. */
export interface ImportantDateItem {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  day: string;
  month: string;
  fullDate: string;
  rawDate: string;
}

export interface GlossaryTermItem {
  id: string;
  term: string;
  definition: string;
  category: string;
  subcategory: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  subcategory: string;
}

export interface BlogListItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  subcategory: string;
  image: string;
  date: string;
  link: string;
}

export interface BlogPostDetail extends SanityBlogPost {
  coverImageUrl: string;
  formattedDate: string;
  htmlBody: string;
}
