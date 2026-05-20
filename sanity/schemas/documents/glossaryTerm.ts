import { defineField, defineType } from 'sanity';
import { categoryFields } from '../objects/categoryFields';

export default defineType({
  name: 'glossaryTerm',
  title: 'Glossary Term',
  type: 'document',
  fields: [
    defineField({
      name: 'term',
      title: 'Term',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'definition',
      title: 'Definition',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    ...categoryFields,
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
    }),
  ],
  preview: {
    select: { title: 'term', subtitle: 'category' },
  },
});
