export function BrandMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return <img className={`brand-mark ${className}`} src="/brand-mark.svg" width={size} height={size} alt="" decoding="async" />;
}
