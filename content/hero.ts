// content/hero.ts — hero photograph + traced line-drawing for the
// "From Line to Built" signature reveal (Build prompt §2.1).
//
// The frame is the arrival colonnade at Networks Padel Village, shot in the
// evening: a faceted timber soffit with a continuous cove light, the planted
// wall and brick planter beyond, terrazzo underfoot. It replaces the earlier
// court-side frame, which was a wide midday documentation shot — bright,
// busy with sponsor banners, and so evenly lit that the copy needed an almost
// opaque paper wash to stay legible, which erased the photograph it sat on.
//
// This frame does the opposite: it is already dark and quiet on the left,
// where the copy sits (measured ~6:1 against --color-ink with no scrim at
// all), and its brightest, most detailed passage — the lit timber ceiling —
// is top-right, away from the type. So the scrims can stay light and the
// building stays visible. Cropped from the 4000×2252 original at 3070px wide
// to take the event signage and seated staff off the right edge.
//
// Paths are traced by hand over this crop (2400×1761). Left to right: the
// leading edge of the timber soffit and the three facets of its cove line,
// three fins of the colonnade wall, the wall-to-floor junction running to the
// vanishing point, the balustrade top rail and the column beside it.
// Abstract, hairline, gold — they draw in, then fade under the photo.
//
// Composition note: the hero is `object-cover`, so on a wide desktop roughly
// the top and bottom sixth of this frame is cropped away. Every traced line
// either sits inside that safe band or deliberately runs off the edge.

export const heroImage =
  "/images/networks-padel-village/Padel_Arrival_Colonnade.jpg";
export const heroAlt =
  "The arrival colonnade at Networks Padel Village: a faceted timber soffit lit by a continuous cove light, a planted wall and brick planter beyond, terrazzo underfoot.";
export const heroViewBox = "0 0 2400 1761";

export const heroPaths = [
  // leading edge of the timber soffit, falling from the top of the frame
  "M 846 30 L 1030 782",
  // the three facets of the cove line running back to the far wall
  "M 1030 782 L 1382 828",
  "M 1382 828 L 1626 720",
  "M 1626 720 L 2400 658",
  // fins of the colonnade wall, left
  "M 532 486 L 532 1500",
  "M 686 560 L 686 1440",
  "M 812 620 L 812 1416",
  // wall-to-floor junction running toward the vanishing point
  "M 456 1572 L 1032 1440",
  // balustrade top rail in front of the planted wall
  "M 1302 1102 L 2280 1134",
  // column between the colonnade and the planter
  "M 1354 828 L 1368 1140",
];
