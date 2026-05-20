import { toHTML } from '@portabletext/to-html';
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
import { urlForImage } from './image';

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

function parseDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDisplayDate(isoDate: string): { day: string; month: string; fullDate: string } {
  const date = parseDate(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTH_SHORT[date.getMonth()];
  const fullDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  return { day, month, fullDate };
}

function formatBlogDate(isoDateTime: string): string {
  return new Date(isoDateTime).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function slugFromId(id: string): string {
  return id.replace(/^drafts\./, '');
}

export function mapImportantDate(doc: SanityImportantDate): ImportantDateItem {
  const { day, month, fullDate } = formatDisplayDate(doc.date);
  return {
    id: slugFromId(doc._id),
    title: doc.title,
    description: doc.description ?? '',
    category: doc.category,
    subcategory: doc.subcategory ?? '',
    day,
    month,
    fullDate,
    rawDate: doc.date,
  };
}

export function mapGlossaryTerm(doc: SanityGlossaryTerm): GlossaryTermItem {
  return {
    id: slugFromId(doc._id),
    term: doc.term,
    definition: doc.definition,
    category: doc.category,
    subcategory: doc.subcategory ?? '',
  };
}

export function mapFaq(doc: SanityFaq): FaqItem {
  return {
    id: slugFromId(doc._id),
    question: doc.question,
    answer: doc.answer,
    category: doc.category,
    subcategory: doc.subcategory ?? '',
  };
}

export function mapBlogListItem(doc: SanityBlogPost): BlogListItem {
  return {
    id: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    category: doc.category,
    subcategory: doc.subcategory ?? '',
    image: urlForImage(doc.mainImage, { width: 600, quality: 80 }),
    date: formatBlogDate(doc.publishedAt),
    link: `/blog/${doc.slug}`,
  };
}

export function mapBlogPostDetail(doc: SanityBlogPost): BlogPostDetail {
  const htmlBody = doc.body?.length
    ? toHTML(doc.body, {
        components: {
          types: {
            image: ({ value }) => {
              const src = urlForImage(value, { width: 1200, quality: 85 });
              const alt = value.alt ?? '';
              return src
                ? `<figure><img src="${src}" alt="${alt}" loading="lazy" /></figure>`
                : '';
            },
          },
        },
      })
    : `<p>${doc.excerpt}</p>`;

  return {
    ...doc,
    coverImageUrl: urlForImage(doc.mainImage, { width: 1200, quality: 85 }),
    formattedDate: formatBlogDate(doc.publishedAt),
    htmlBody,
  };
}
