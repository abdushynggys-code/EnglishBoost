import {
  Sun,
  Star,
  Moon,
  Sunrise,
  Eclipse,
  Orbit,
  Atom,
  Satellite,
  SatelliteDish,
  Telescope,
  Earth,
  Asterisk,
  Infinity as InfinityMark,
} from "lucide-react";
import { CollectionArtwork } from "./CollectionArtwork";
import { stellarDrawings } from "./StellarDrawings";
export const drawings = [
  stellarDrawings[0],
  Sun,
  Star,
  Moon,
  Sunrise,
  stellarDrawings[6],
  Eclipse,
  Orbit,
  Atom,
  Satellite,
  SatelliteDish,
  Telescope,
  Earth,
  Asterisk,
  InfinityMark,
  ...stellarDrawings.slice(1, 6),
];
export default function StarforgeSparks({ motif }: { motif: number }) {
  return <CollectionArtwork drawings={drawings} motif={motif} />;
}
