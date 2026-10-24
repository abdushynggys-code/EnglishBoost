import type { ReactElement } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";
export type SparkDrawing = LucideIcon | ((props: LucideProps) => ReactElement);
export function CollectionArtwork({ drawings, motif }: { drawings: SparkDrawing[]; motif: number }) {
  const Drawing = drawings[motif] ?? drawings[0];
  return <Drawing aria-hidden strokeWidth={1.65} />;
}
