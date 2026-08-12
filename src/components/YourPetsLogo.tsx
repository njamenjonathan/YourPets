import React from 'react';

/** Brand green, as used in the order email template. */
export const BRAND_GREEN = '#458500';

/**
 * The paw glyph on its own — for tight spots where the full lockup would not
 * fit. Scales with font size or an explicit height class.
 */
export const YourPetsMark: React.FC<{ className?: string }> = ({ className = 'h-8 w-auto' }) => (
  <svg
    viewBox="1.5 8.5 26.5 23"
    className={className}
    fill={BRAND_GREEN}
    role="img"
    aria-label="YourPets"
  >
    <ellipse cx="10.4" cy="15.2" rx="2.6" ry="3.3" />
    <ellipse cx="17.4" cy="13.1" rx="2.7" ry="3.5" />
    <ellipse cx="24.4" cy="15.2" rx="2.6" ry="3.3" />
    <ellipse cx="4.6" cy="20.6" rx="2.3" ry="2.9" />
    <path d="M17.4 19.4c4.2 0 7.6 3 7.6 6.4 0 2.7-2.4 4.2-5 4.2-1.2 0-1.9-.4-2.6-.4s-1.4.4-2.6.4c-2.6 0-5-1.5-5-4.2 0-3.4 3.4-6.4 7.6-6.4Z" />
  </svg>
);

interface WordmarkProps {
  /** Wrapper classes — set the text colour here; "Your" inherits it. */
  className?: string;
  /** Size of the name, e.g. "text-3xl". The paw scales with it. */
  textClassName?: string;
  /** Optional small line beneath the name, e.g. "Luxury Concierge". */
  tagline?: string;
  /** Classes for that line. */
  taglineClassName?: string;
}

/**
 * The full horizontal lockup: paw mark followed by the name, with "Pets" in
 * the brand green, and an optional tagline aligned under the name.
 *
 * The name is real text rather than paths inside the SVG, so it stays
 * selectable, readable by screen readers, and correctly sized even if the
 * Playfair webfont is slow or fails — an SVG <text> element would shift its
 * metrics against a fixed viewBox and overflow.
 *
 * The size class lands on the wrapper, so the paw's em-based height resolves
 * against the name rather than the inherited 16px.
 */
export const YourPetsWordmark: React.FC<WordmarkProps> = ({
  className = '',
  textClassName = 'text-2xl',
  tagline,
  taglineClassName = ''
}) => (
  <span className={`inline-flex items-center gap-2 ${textClassName} ${className}`}>
    <YourPetsMark className="h-[0.78em] w-auto shrink-0" />
    <span className="flex flex-col min-w-0">
      <span className="font-serif-display font-bold tracking-tight leading-none whitespace-nowrap">
        Your<span style={{ color: BRAND_GREEN }}>Pets</span>
      </span>
      {tagline && (
        <span className={`leading-none mt-1 whitespace-nowrap ${taglineClassName}`}>{tagline}</span>
      )}
    </span>
  </span>
);

/** Kept so older imports keep working; prefer YourPetsMark. */
export const YourPetsLogo = YourPetsMark;
