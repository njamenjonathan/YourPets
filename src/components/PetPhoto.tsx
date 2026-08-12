import React, { useEffect, useState } from 'react';
import { PawPrint } from 'lucide-react';

interface PetPhotoProps {
  src?: string;
  alt: string;
  /** Shown on the placeholder when there is no usable photo. */
  caption?: string;
  className?: string;
  /** Load eagerly for the one large photo above the fold. */
  priority?: boolean;
}

/**
 * A pet photo that degrades gracefully: if the file is missing or fails to
 * load, it shows a branded placeholder instead of a broken-image icon.
 */
export const PetPhoto: React.FC<PetPhotoProps> = ({ src, alt, caption, className = '', priority = false }) => {
  const [failed, setFailed] = useState(false);

  // A new src deserves a fresh attempt.
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#002045] via-[#123a63] to-emerald-900 text-white/90 ${className}`}
        role="img"
        aria-label={alt}
      >
        <PawPrint className="w-1/4 h-1/4 max-w-12 max-h-12 opacity-80" strokeWidth={2.2} />
        {caption && (
          <span className="px-3 text-center text-[11px] font-semibold uppercase tracking-wider text-white/80 leading-tight">
            {caption}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
};

interface AvatarProps {
  src?: string;
  name: string;
  className?: string;
}

/**
 * A person or kennel photo that falls back to their initials, so a missing
 * image never leaves a broken icon on the page.
 */
export const Avatar: React.FC<AvatarProps> = ({ src, name, className = '' }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  const initials = name
    .split(/\s+/)
    .map(word => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-[#002045] text-white font-bold ${className}`}
        role="img"
        aria-label={name}
      >
        {initials}
      </div>
    );
  }

  return <img src={src} alt={name} className={className} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
};
