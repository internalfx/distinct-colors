import { Color } from "chroma-js";

interface Options {
  /**
   * The number of colors the palette should contain
   * Valid Range: 0-Infinity, Default: 5
   */
  count?: number;
  /**
   * The minimum hue for colors in the palette.
   * Valid Range: 0-360, Default: 0
   */
  hueMin?: number;
  /**
   * The maximum hue for colors in the palette.
   * Valid Range: 0-360, Default: 360
   */
  hueMax?: number;
  /**
   * The minimum chroma (color) for colors in the palette.
   * Valid Range: 0-100, Default: 0
   */
  chromaMin?: number;
  /**
   * The maximum chroma (color) for colors in the palette.
   * Valid Range: 0-100, Default: 100
   */
  chromaMax?: number;
  /**
   * The minimum lightness for colors in the palette.
   * Valid Range: 0-100, Default: 0
   */
  lightMin?: number;
  /**
   * The maximum lightness for colors in the palette.
   * Valid Range: 0-100, Default: 100
   */
  lightMax?: number;
  /**
   * The number of steps for k-means convergence. Will break early if the result has converged.
   * Valid Range: 1-Infinity, Default: 50
   */
  quality?: number;
  /**
   * The number of color samples to choose from.
   * Valid Range: 1-Infinity8, Default: 800
   */
  samples?: number;
}

export default function distinctColors(opts?: Options): Color[];
