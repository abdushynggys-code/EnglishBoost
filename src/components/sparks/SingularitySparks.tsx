import { CollectionArtwork } from "./CollectionArtwork";
import { drawSpark } from "./drawSpark";
export const drawings = [
  drawSpark("M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8|M2 15c2-6 16-10 20-6M2 15c4 4 18 0 20-6|M5 5l1-1M18 19l1-1"),
  drawSpark("M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18|M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4|M3 12H1M23 12h-2M12 1v2M12 21v2"),
  drawSpark("M3 3c7 0 2 8 9 8s2-8 9-8v18c-7 0-2-8-9-8s-2 8-9 8z|M3 7c7 0 3 5 9 5s2-5 9-5M3 17c7 0 3-5 9-5s2 5 9 5"),
  drawSpark("M2 3h20l-6 6-2 9-2 4-2-4-2-9z|M4 6h16M7 9h10M9 12h6M10 16h4"),
  drawSpark("M7 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8|M17 11a4 4 0 1 0 0 8 4 4 0 0 0 0-8|M2 17C1 7 15-1 22 7M22 7c3 11-12 19-20 10"),
  drawSpark("M10 8a4 4 0 1 0 4 8 4 4 0 0 0-4-8|M12 8V1l-2 3M12 1l2 3M12 16v7l-2-3M12 23l2-3|M3 14l18-4M4 16l16-8"),
  drawSpark(
    "M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12|M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4|M12 2l2 2-2 2-2-2zM22 12l-2 2-2-2 2-2zM12 22l-2-2 2-2 2 2zM2 12l2-2 2 2-2 2z",
  ),
  drawSpark("M4 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6|M8 8c2 1 2 9 5 10s5-3 9-2M8 10c2 4 2 10 6 10M11 9l2 3M15 12l2 1M19 13l2-1"),
  drawSpark("M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16|M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8|M12 4l-2-3M20 12l3-2M12 20l2 3M4 12l-3 2"),
  drawSpark("M2 4h8l4 16h8M2 9h9l3 6h8M2 14h9l3-4h8M2 20h8L14 4h8|M5 4v16M19 4v16"),
  drawSpark("M12 12c-1-4 6-5 7-1 2 6-8 11-13 6-7-7 4-18 13-13M12 12c2 2-1 4-3 2-3-4 4-8 8-5"),
  drawSpark("M12 5c-6-8-14 7-5 10 7 3 12-12 4-12-10 0-3 19 5 16 10-4-1-18-7-12-6 6 9 15 12 7"),
  drawSpark("M4 4l8-2 8 4 2 10-8 6-11-5z|M4 4l10 18M12 2l-9 15M20 6L3 17M22 16L4 4M12 2l2 20M20 6l-6 16"),
  drawSpark("M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8|M9 8C4-1 0 9 8 12M15 8c5-9 9 1 1 4M8 15c-8 3 0 10 3 2M16 15c8 3 0 10-3 2"),
  drawSpark("M12 2c-10 4 10 7 0 10s10 7 0 10|M4 4l2 2M19 4l-2 2M3 12h3M21 12h-3M5 20l2-2M19 20l-2-2"),
  drawSpark("M5 3h14l-3 5-3 4 3 4 3 5H5l3-5 3-4-3-4z|M8 5h8M8 19h8M3 12H1M23 12h-2M18 10l3-3M3 17l3-3"),
  drawSpark("M2 8c3-8 5 8 8 0s5 8 8 0 3-3 4-2M2 13c3-8 5 8 8 0s5 8 8 0 3-3 4-2M2 18c3-8 5 8 8 0s5 8 8 0 3-3 4-2"),
  drawSpark("M6 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6|M18 13a3 3 0 1 0 0 6 3 3 0 0 0 0-6|M9 9l6 6M11 7l6 6M7 11l6 6M2 3l1-1M21 21l1 1"),
  drawSpark("M12 2l10 10-10 10L2 12z|M12 2v20M2 12h20M7 7l10 10M7 17L17 7|M10 10h4v4h-4z"),
  drawSpark(
    "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6|M12 3v2M18 6l-1 2M21 12h-2M18 18l-1-2M12 21v-2M6 18l1-2M3 12h2M6 6l1 2|M9 3l-1-1M21 8l1-1M15 21l1 1M2 16l1 1",
  ),
];
export default function SingularitySparks({ motif }: { motif: number }) {
  return <CollectionArtwork drawings={drawings} motif={motif} />;
}
