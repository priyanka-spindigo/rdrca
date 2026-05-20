import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

export default defineConfig({
  name: 'rdrc',
  title: 'RDR & Associates',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Blog posts')
              .child(S.documentTypeList('blogPost').title('Blog posts')),
            S.divider(),
            S.listItem()
              .title('Important dates')
              .child(S.documentTypeList('importantDate').title('Important dates')),
            S.listItem()
              .title('Glossary')
              .child(S.documentTypeList('glossaryTerm').title('Glossary')),
            S.listItem()
              .title('FAQs')
              .child(S.documentTypeList('faq').title('FAQs')),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
