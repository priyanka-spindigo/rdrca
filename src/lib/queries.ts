/** Shared field projections to keep GROQ DRY. */
const seoProjection = `seo {
  title,
  description,
  ogImage
}`;

const categoryProjection = `category, subcategory`;

export const importantDatesQuery = `*[_type == "importantDate"] | order(date asc, order asc) {
  _id,
  title,
  description,
  ${categoryProjection},
  date,
  order
}`;

export const glossaryTermsQuery = `*[_type == "glossaryTerm"] | order(term asc, order asc) {
  _id,
  term,
  definition,
  ${categoryProjection},
  order
}`;

export const faqsQuery = `*[_type == "faq"] | order(order asc, question asc) {
  _id,
  question,
  answer,
  ${categoryProjection},
  order
}`;

export const blogPostsListQuery = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  ${categoryProjection},
  mainImage,
  publishedAt,
  author,
  readTime,
  tags,
  ${seoProjection}
}`;

export const blogPostBySlugQuery = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  ${categoryProjection},
  mainImage,
  publishedAt,
  author,
  readTime,
  body,
  tags,
  ${seoProjection}
}`;

export const blogSlugsQuery = `*[_type == "blogPost" && defined(slug.current)]{ "slug": slug.current }`;
