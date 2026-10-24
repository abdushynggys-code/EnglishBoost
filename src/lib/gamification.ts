export const gameLevel = (xp: number) => Math.floor((-100 + Math.sqrt(10000 + 4 * Math.max(0, xp))) / 2) + 1;
export const xpForLevel = (level: number) => (level - 1) * (level + 99);
export const fameForXp = (xp: number) => Math.max(0, Math.floor((xp - 60000) / 10000));
