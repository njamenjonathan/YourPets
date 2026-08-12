import { Pet } from '../types';

/**
 * Photos dropped into src/assets/images/ are picked up automatically at build
 * time — see the README in that folder for the naming rules.
 */
const allImages = import.meta.glob<string>('../assets/images/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default'
});

/**
 * Files that sit in this folder but must never appear on a listing: the brand
 * logo, and any photo whose breed has not been confirmed yet. Rename an
 * "unassigned-" file to its breed to publish it.
 */
const NON_PET_IMAGES = ['yourpets_logo', 'unassigned-'];

const localPhotos = Object.fromEntries(
  Object.entries(allImages).filter(([path]) => !NON_PET_IMAGES.some(name => path.includes(name)))
);

/** "Golden Retriever" -> "golden-retriever" */
export const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const fileNameOf = (path: string): string => path.split('/').pop() || '';

/** File name without its extension, slugified so "Golden Retriever 2.jpg"
 *  matches the same breed as "golden-retriever-2.jpg". */
const baseNameOf = (path: string): string => toSlug(fileNameOf(path).replace(/\.[^.]+$/, ''));

/**
 * Files whose name is `<key>` or `<key>-2`, `<key>-3`, ... in that order, so
 * "golden-retriever.jpg" comes before "golden-retriever-2.jpg".
 */
const photosMatching = (key: string): string[] =>
  Object.entries(localPhotos)
    .filter(([path]) => {
      const base = baseNameOf(path);
      return base === key || base.startsWith(`${key}-`);
    })
    .sort(([a], [b]) => baseNameOf(a).localeCompare(baseNameOf(b), undefined, { numeric: true }))
    .map(([, url]) => url as string);

/**
 * Photos for a pet, most specific first: a photo named after this exact pet,
 * then photos named after its breed, then whatever the listing itself carries.
 */
export const photosFor = (pet: Pick<Pet, 'id' | 'breed' | 'images'>): string[] => {
  const own = photosMatching(pet.id.toLowerCase());
  if (own.length > 0) return own;

  const byBreed = photosMatching(toSlug(pet.breed));
  if (byBreed.length > 0) return byBreed;

  return pet.images ?? [];
};

/** The single photo to show wherever there is only room for one. */
export const mainPhotoOf = (pet: Pick<Pet, 'id' | 'breed' | 'images'>): string | undefined =>
  photosFor(pet)[0];

/**
 * Photos for a breed name, e.g. photosForBreed('Samoyed'). Returns an empty
 * array when that breed has no photo yet — callers should cope with that
 * rather than importing a file path directly, so renaming a photo can never
 * break the build.
 */
export const photosForBreed = (breed: string): string[] => photosMatching(toSlug(breed));

/** First photo for a breed, or undefined if none has been added. */
export const breedPhoto = (breed: string): string | undefined => photosForBreed(breed)[0];

/** How many breed photos are currently bundled — used by the admin dashboard. */
export const localPhotoCount = (): number => Object.keys(localPhotos).length;
