import React, { useState } from 'react';

/**
 * Robust SuspectAvatar styled with Deep Aubergine (#3A0F34) and Marigold (#EAAA00).
 */
export default function SuspectAvatar({ name = '', avatarUrl = '', size = "w-16 h-16", textSize = "text-base" }) {
  const [hasError, setHasError] = useState(false);

  const initials = name
    ? name
        .replace(/^(Lord|Lady|Dr\.|Sir|Madame|Baroness|Count|Inspector|Maestro)\s+/i, '')
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '??';

  if (hasError || !avatarUrl || avatarUrl.includes('photo-1500000000000')) {
    return (
      <div className={`${size} rounded-xl bg-gradient-to-br from-[#2D0B28] to-[#170515] border border-[#EAAA00]/40 flex flex-col items-center justify-center font-mono font-bold text-[#EAAA00] shadow-md shrink-0 select-none group`}>
        <span className={`${textSize} tracking-wider text-[#EAAA00] drop-shadow`}>{initials}</span>
        <span className="text-[8px] text-[#DDE3E8]/60 uppercase tracking-tighter">DOSSIER</span>
      </div>
    );
  }

  return (
    <img
      src={avatarUrl}
      alt={name}
      onError={() => setHasError(true)}
      className={`${size} rounded-xl object-cover border border-[#3A0F34] shadow-md shrink-0 bg-[#170515]`}
    />
  );
}
