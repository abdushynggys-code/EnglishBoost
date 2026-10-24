import type { SparkDrawing } from "./CollectionArtwork";
// Each design supplies its own geometry; only the SVG frame is shared.
export function drawSpark(paths: string): SparkDrawing {
  return function SparkDrawing() {
    return (
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {paths.split("|").map((d, index) => (
          <path key={index} d={d} />
        ))}
      </svg>
    );
  };
}
