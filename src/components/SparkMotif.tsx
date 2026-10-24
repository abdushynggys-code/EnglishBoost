import { lazy, Suspense } from "react";
const collections = {
  seed: lazy(() => import("./sparks/GardenSparks")),
  fire: lazy(() => import("./sparks/HearthSparks")),
  wave: lazy(() => import("./sparks/CoastSparks")),
  comet: lazy(() => import("./sparks/TrailblazersSparks")),
  bloom: lazy(() => import("./sparks/ArcadeSparks")),
  orbit: lazy(() => import("./sparks/WorkshopSparks")),
  aurora: lazy(() => import("./sparks/StudioSparks")),
  storm: lazy(() => import("./sparks/MythicSparks")),
  supernova: lazy(() => import("./sparks/StarforgeSparks")),
  "black-hole": lazy(() => import("./sparks/SingularitySparks")),
  unknown: lazy(() => import("./sparks/UnknownSparks")),
};
export function SparkMotif({ family, motif }: { family: string; motif: number }) {
  const Artwork = collections[family as keyof typeof collections] ?? collections.seed;
  return (
    <Suspense fallback={<span className="spark-art-loading" />}>
      <Artwork motif={motif} />
    </Suspense>
  );
}
