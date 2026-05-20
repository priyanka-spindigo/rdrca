import { defineField, defineType } from 'sanity';
import { categoryFields } from '../objects/categoryFields';

export default defineType({
  name: 'importantDate',
  title: 'Important Date',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    ...categoryFields,
    defineField({
      name: 'date',
      title: 'Due date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first within the same month.',
    }),
  ],
  orderings: [
    {
      title: 'Date',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'date', category: 'category' },
    prepare({ title, subtitle, category }) {
      return {
        title,
        subtitle: [category, subtitle].filter(Boolean).join(' · '),
      };
    },
  },
});
