import { drawSpark } from "./drawSpark";
export const stellarDrawings = [
  // Supernova: a ruptured stellar shell.
  drawSpark("M12 2l2 6 5-3-2 6 5 2-6 2 3 6-6-4-3 5-1-6-6 1 4-5-5-3 6-1z|M10 10l4 1 1 3-4 1z"),
  // Comet: a compact head with three sweeping trails.
  drawSpark("M5 14a4 4 0 1 0 5 5 4 4 0 0 0-5-5z|M9 13L20 3M12 16l10-9M6 12l9-10"),
  // Asteroid belt: three irregular bodies, each on a different orbit.
  drawSpark("M3 6l3-2 3 2-1 4-4 1-2-3z|M15 3l3 1 1 3-3 2-3-2z|M14 15l5-1 3 4-3 4-5-1-2-3z|M2 18l6-4M10 3l2-1M21 11l1 1"),
  // Nebula: an asymmetric cloud surrounding a small stellar nursery.
  drawSpark("M5 15c-5-2-3-7 1-7-1-5 6-6 8-2 5-1 9 3 6 6 3 4-2 9-6 6-3 5-8 3-9-3z|M9 10l1 2 2 1-2 1-1 2-1-2-2-1 2-1z|M15 8l2 2M15 10l2-2"),
  // Spiral galaxy: separated, winding spiral arms.
  drawSpark("M12 10c4-4 10 0 6 5-4 5-13 5-15-1-2-6 7-13 14-9|M12 14c-4 4-10 0-6-5 4-5 13-5 15 1 2 6-7 13-14 9|M12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2"),
  // Pulsar: two narrow beams leaving opposite poles.
  drawSpark("M10 8a4 4 0 1 0 4 8 4 4 0 0 0-4-8z|M11 8L4 2l5 8M13 16l7 6-5-8|M4 14c2-6 12-10 16-4M4 14c4 4 14 0 16-4"),
  // A fading star: a narrow core and an open, fragmented outer shell.
  drawSpark("M12 7l1 3 3 2-3 1-1 4-2-4-3-1 3-2z|M5 5a9 9 0 0 1 13 1M21 10a9 9 0 0 1-5 10M10 21a9 9 0 0 1-7-10|M3 3l1 1M21 21l-1-1"),
];
