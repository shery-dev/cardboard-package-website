/**
 * Trusted partner brands for the hero slider.
 * Logo sources: Wikimedia Commons (public domain/CC) or local /public/img/brands/
 * Add missing logos to public/img/brands/ (e.g. khaadi.png, elo.png, tcs.png, stylo.png)
 */
export const BRANDS = [
  {
    name: "Servis Pakistan",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Servis_logo.png",
    alt: "Servis",
  },
  {
    name: "Khaadi Pakistan",
    logo: "/img/brands/khaadi.png",
    alt: "Khaadi",
    sizeMultiplier: 1.65,
  },
  {
    name: "Kraft Heinz",
    logo: "/img/brands/kraftheinz.png",
    alt: "Kraft Heinz",
  },
  {
    name: "Unilever",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Unilever_logo.png",
    alt: "Unilever",
  },
  {
    name: "Daraz Pakistan",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Daraz_Logo.png",
    alt: "Daraz",
  },
  {
    name: "Warby Parker",
    logo: "/img/brands/warbyparker.png",
    alt: "Warby Parker",
    sizeMultiplier: 2.1,
    /** Nudge down so logo sits vertically centered in the strip */
    verticalAdjust: 8,
  },
  {
    name: "elo Pakistan",
    logo: "/img/brands/elo.png",
    alt: "elo",
    sizeMultiplier: 1.65,
  },
  {
    name: "TCS Pakistan",
    logo: "/img/brands/tcs.png",
    alt: "TCS",
    sizeMultiplier: 2.1,
  },
  {
    name: "Stylo PK",
    logo: "/img/brands/stylo.png",
    alt: "Stylo",
    /** Larger slot so small source image appears bigger */
    sizeMultiplier: 1.4,
  },
];
