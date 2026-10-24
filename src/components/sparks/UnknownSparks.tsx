import { CollectionArtwork } from "./CollectionArtwork";
import { drawSpark } from "./drawSpark";
export const drawings = [drawSpark("M12 2l3 6 7 4-7 4-3 6-3-6-7-4 7-4z|M9 10l3-4 3 4-3 4zM9 16l3-2 3 2|M3 3l2 1M21 3l-2 1M3 21l2-1M21 21l-2-1")];
export default function UnknownSparks({ motif }: { motif: number }) {
  return <CollectionArtwork drawings={drawings} motif={motif} />;
}
