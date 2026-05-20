import { defineField } from 'sanity';

/** Shared category / subcategory fields used across content types. */
export const categoryFields = [
  defineField({
    name: 'category',
    title: 'Category',
    type: 'string',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'subcategory',
    title: 'Subcategory',
    type: 'string',
  }),
];
