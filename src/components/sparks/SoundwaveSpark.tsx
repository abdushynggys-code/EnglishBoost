export function SoundwaveSpark() {
  return (
    <svg className="studio-soundwave" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true">
      {[6, 12, 18, 10, 20, 14, 8].map((height, index) => (
        <path key={index} d={`M${3 + index * 3} ${12 - height / 2}v${height}`} />
      ))}
    </svg>
  );
}
