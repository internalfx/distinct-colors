# Distinct Colors

[![npm version](https://img.shields.io/npm/v/distinct-colors.svg)](https://www.npmjs.com/package/distinct-colors)
[![license](https://img.shields.io/npm/l/distinct-colors.svg)](https://github.com/internalfx/distinct-colors/blob/master/LICENSE)

This is a complete rewrite of (but is heavily inspired by) [Mathieu Jacomy's](https://github.com/jacomyma) [Palette Generator](https://github.com/medialab/iwanthue/blob/master/js/libs/chroma.palette-gen.js)

I have taken the ideas and the theories, and put them into a simple modular library. I have also optimized it for speed.

This library generates a palette of *visually* distinct colors, and returns an array of [chroma-js](https://github.com/gka/chroma.js) objects.

distinct-colors is highly configurable:

- Choose how many colors are in the palette
- Restrict the hue to a specific range
- Restrict the chroma (saturation) to a specific range
- Restrict the lightness to a specific range
- Configure general quality of the palette

To get an example of how to use this (and what it produces), check out [I want hue](http://tools.medialab.sciences-po.fr/iwanthue/).

---

Special thanks to [Arthur Andrew Medical](http://www.arthurandrew.com/) for sponsoring this project.

Arthur Andrew Medical manufactures products with ingredients that have extensive clinical research for safety and efficacy. We specialize in Enzymes, Probiotics and Antioxidants.

---

## Installation

```
npm install distinct-colors
```

## Getting Started

```javascript
// ESM
import distinctColors from 'distinct-colors'

// CommonJS
var distinctColors = require('distinct-colors').default

var palette = distinctColors() // You may pass an optional config object

// Thats it!
```

## API

#### distinctColors([options])

Generates a new palette. Returns an array of [chroma-js](https://github.com/gka/chroma.js) objects.

#### Options

| Name | Type | Valid Range | Default | Description |
| --- | --- | --- | --- | --- |
| count | integer | `0-Infinity` | `5` | The number of colors the palette should contain |
| hueMin | integer | `0-360` | `0` | The minimum hue for colors in the palette. |
| hueMax | integer | `0-360` | `360` | The maximum hue for colors in the palette. |
| chromaMin | integer | `0-100` | `0` | The minimum chroma (color) for colors in the palette. |
| chromaMax | integer | `0-100` | `100` | The maximum chroma (color) for colors in the palette. |
| lightMin | integer | `0-100` | `0` | The minimum lightness for colors in the palette. |
| lightMax | integer | `0-100` | `100` | The maximum lightness for colors in the palette. |
| quality | integer | `1-Infinity` | `50` | The number of steps for [k-means](https://en.wikipedia.org/wiki/K-means_clustering) convergence. Will break early if the result has converged. |
| samples | integer | `1-Infinity` | `800` | The number of color samples to choose from. |


