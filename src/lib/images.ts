import type { ImageMetadata } from 'astro';

// Card images are referenced by a path string in projects.yaml / builds.yaml,
// but Astro's <Image> needs an imported asset. Eagerly glob every card image so
// a path string can be resolved to its ImageMetadata at build time. A bad path
// throws here (build-time), which is the safety we want.
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/{projects,builds}/*.{jpg,jpeg,png,webp}',
  { eager: true },
);

export function cardImage(path: string): ImageMetadata {
  const mod = modules['/src/assets/' + path];
  if (!mod) {
    const available = Object.keys(modules)
      .map((k) => k.replace('/src/assets/', ''))
      .join(', ');
    throw new Error(`Image "${path}" not found under src/assets/. Available: ${available}`);
  }
  return mod.default;
}
