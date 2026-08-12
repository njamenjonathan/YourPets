# Pet photos

Drop photos in this folder and the site picks them up automatically — no code
changes needed.

## Naming

Name each file after the **breed**, in lower case with dashes:

    golden-retriever.jpg
    golden-retriever-2.jpg      <- extra angles, shown as gallery thumbnails
    golden-retriever-3.jpg

Every pet of that breed uses those photos. Capitals and spaces are tolerated
(`Golden Retriever 2.jpg` works too), but the breed spelling must match the
table below.

To give **one specific pet** its own photos, name the file after its id
instead — the id is shown in the admin inventory table:

    pet-1.jpg
    pet-1-2.jpg

Per-pet photos win over per-breed photos.

## File name for each breed in the catalog

| Breed                     | File name                       |
| ------------------------- | ------------------------------- |
| Golden Retriever          | `golden-retriever.jpg`          |
| Savannah Cat              | `savannah-cat.jpg`              |
| French Bulldog            | `french-bulldog.jpg`            |
| Persian Kitten            | `persian-kitten.jpg`            |
| Samoyed                   | `samoyed.jpg`                   |
| Teacup Pomeranian         | `teacup-pomeranian.jpg`         |
| Pembroke Welsh Corgi      | `pembroke-welsh-corgi.jpg`      |
| Miniature Dachshund       | `miniature-dachshund.jpg`       |
| Bengal Kitten             | `bengal-kitten.jpg`             |
| Scottish Fold Kitten      | `scottish-fold-kitten.jpg`      |
| Munchkin Short-Leg Kitten | `munchkin-short-leg-kitten.jpg` |
| Ragdoll Kitten            | `ragdoll-kitten.jpg`            |
| British Shorthair         | `british-shorthair.jpg`         |
| Maine Coon                | `maine-coon.jpg`                |
| German Shepherd           | `german-shepherd.jpg`           |
| Australian Shepherd       | `australian-shepherd.jpg`       |
| Sphynx Hairless Kitten    | `sphynx-hairless-kitten.jpg`    |

## Notes

- JPG, PNG or WebP. Square-ish photos look best on the cards.
- Keep each file under about 1 MB so pages stay fast.
- A breed with no photo shows a branded placeholder rather than a broken image.
- `yourpets_logo_1785983348124.jpg` is the brand logo, not a pet photo, and is
  ignored by the gallery.
- A file whose name starts with `unassigned-` is kept but never shown. Rename it
  to a breed from the table above to publish it. `unassigned-black-labrador-puppy.jpg`
  is waiting on a breed: the catalog has no Labrador listing yet.
- Use lower case file names. Windows and macOS treat `Samoyed.jpg` and
  `samoyed.jpg` as the same file, so a rename that only changes capitalisation
  fails to apply there. That is why the first Samoyed photo is `samoyed-1.jpg`:
  `<breed>-1`, `<breed>-2` and so on work exactly like `<breed>.jpg`.
