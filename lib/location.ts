/**
 * Returns a human-friendly distance label with emoji based on miles.
 * Context: Springfield is the 13th most dangerous US city for pedestrian
 * fatalities — walking context helps users plan safe travel.
 */
export function getDistanceLabel(miles: number): {
  label: string;
  emoji: string;
} {
  if (miles < 0.5) {
    return { emoji: "🚶", label: `${miles.toFixed(1)} mi · Walking distance (~10 min)` };
  }
  if (miles < 1) {
    return { emoji: "🚶", label: `${miles.toFixed(1)} mi · Walkable (~15-20 min)` };
  }
  if (miles < 3) {
    return { emoji: "🚌", label: `${miles.toFixed(1)} mi · May need a bus or ride` };
  }
  return { emoji: "🚗", label: `${miles.toFixed(1)} mi · You'll likely need transportation` };
}
