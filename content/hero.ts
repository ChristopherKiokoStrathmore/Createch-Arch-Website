// content/hero.ts — hero photograph + traced line-drawing for the
// "From Line to Built" signature reveal (Build prompt §2.1).
//
// Paths are traced by hand over CED_3790 (native 2400×1602): the social lounge
// under the hexagonal shade canopy, living wall to the left, padel courts
// beyond. Traced features, left to right: the timber capping of the living
// wall, the brick planter coping running to the vanishing point, four steel
// columns, two roof glazing bars, the court enclosure rail and the near edge of
// the court. Abstract, hairline, gold — they draw in, then fade under the photo.
//
// Composition note: the hero is `object-cover`, so on a wide desktop roughly
// the top and bottom 240px of this 3:2 frame are cropped away. Everything
// traced here either sits inside that safe band or deliberately runs off the
// edge; nothing depends on the extreme top or bottom being visible.

export const heroImage = "/images/networks-padel-village/CED_3790.jpg";
export const heroAlt =
  "The social lounge at Networks Padel Village: a hexagonal shade canopy over lounge seating, a planted living wall to one side and the padel courts beyond.";
export const heroViewBox = "0 0 2400 1602";

export const heroPaths = [
  // timber capping of the living wall, left
  "M 30 60 L 300 500",
  // brick planter coping running toward the vanishing point
  "M 120 1215 L 730 880",
  // steel columns
  "M 372 420 L 372 1000",
  "M 1212 480 L 1212 900",
  "M 1600 300 L 1600 1010",
  "M 1990 400 L 1990 1090",
  // roof glazing bars receding
  "M 430 90 L 1180 500",
  "M 700 40 L 1240 440",
  // court enclosure top rail
  "M 1280 480 L 2400 440",
  // near edge of the court
  "M 1420 775 L 2400 700",
];
