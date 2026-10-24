export const DATA_CHANGED = "englishboost:data-changed";
export function announceDataChange() {
  window.dispatchEvent(new Event(DATA_CHANGED));
}
