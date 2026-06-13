import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';
import yaml from 'js-yaml';

// The running project list. One YAML file, same shape as the old projects.yaml,
// but now validated by the schema below at build time — a typo'd field or a
// missing required key fails `astro build` instead of rendering wrong.
const projects = defineCollection({
  loader: file('src/data/projects.yaml', {
    parser: (text) => yaml.load(text) as Record<string, unknown>[],
  }),
  schema: z.object({
    order: z.number(), // display order (hand-curated, flagship first)
    name: z.string(),
    lang: z.string(),
    tags: z.array(z.string()).default([]),
    stars: z.number().optional(),
    status: z
      .object({ label: z.string(), kind: z.enum(['live', 'retired']) })
      .optional(),
    image: z.string().optional(),
    credit: z.string().optional(),
    blurb: z.string(),
    links: z
      .array(z.object({ label: z.string(), url: z.string().url() }))
      .default([]),
  }),
});

// Hardware builds — same pattern. Images are optional (photos pending); a card
// without one shows a placeholder media slot.
const builds = defineCollection({
  loader: file('src/data/builds.yaml', {
    parser: (text) => yaml.load(text) as Record<string, unknown>[],
  }),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    placeholder: z.string().optional(),
    blurb: z.string(),
  }),
});

export const collections = { projects, builds };
