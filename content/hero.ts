// content/hero.ts — hero photograph + traced line-drawing for the
// "From Line to Built" signature reveal (Build prompt §2.1).
//
// Paths are traced by hand over CED_3747 (native 2200×1469): the sweeping
// steel court-hall roofline, structural columns, glass court enclosure,
// umbrella canopies, brick planter, and the foreground paving perspective.
// Abstract, hairline, gold — they draw in then fade under the photo.

export const heroImage = "/images/networks-padel-village/CED_3747.jpg";
export const heroAlt =
  "Networks Padel Village: the Vamos dining terrace, umbrellas and landscaping with the padel courts behind.";
export const heroViewBox = "0 0 2200 1469";

export const heroPaths = [
  // main roof leading edge, sweeping left→right and down
  "M 40 120 L 560 90 L 1080 300 L 1520 470 L 1780 468",
  // roof fascia / underside beam
  "M 560 150 L 1080 355 L 1520 520",
  // horizon & tree line to the right of the hall
  "M 1780 468 L 2200 470",
  // structural steel columns of the court hall
  "M 470 150 L 470 830",
  "M 905 320 L 905 800",
  "M 1335 435 L 1335 780",
  // top rail of the glass court enclosure
  "M 40 560 L 905 620 L 1500 662",
  // court base line
  "M 40 900 L 700 862 L 1220 842",
  // central umbrella canopy
  "M 980 700 Q 1235 555 1490 700",
  // secondary umbrella canopy
  "M 1360 690 Q 1520 615 1680 690",
  // brick planter top edge
  "M 470 1035 L 1040 1000",
  // foreground paving perspective lines
  "M 40 1260 L 900 1035 L 1260 950",
  "M 720 1469 L 1160 1105 L 1410 1000",
];
