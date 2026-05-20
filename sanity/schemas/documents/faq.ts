import { defineField, defineType } from 'sanity';
import { categoryFields } from '../objects/categoryFields';

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 6,
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
    select: { title: 'question', subtitle: 'category' },
  },
});
