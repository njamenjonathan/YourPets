import React from 'react';

/**
 * The colour fields the glass refracts.
 *
 * Glass over a flat background is just a grey haze — there has to be something
 * behind it with structure and colour for the blur to do anything. These three
 * drifting fields sit behind the whole app at z-0; every surface above them is
 * positioned at z-10 or higher.
 */
export const LiquidBackdrop: React.FC = () => (
  <div className="liquid-aurora" aria-hidden="true">
    <span />
    <span />
    <span />
  </div>
);
