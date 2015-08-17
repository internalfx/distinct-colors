# Distinct Colors

![npm version](https://img.shields.io/npm/v/bplus-index.svg)
![license](https://img.shields.io/dub/l/vibe-d.svg)

This is a complete rewrite of (but is heavily inspired by) [Mathieu Jacomy's](https://github.com/jacomyma) [Palette Generator](https://github.com/medialab/iwanthue/blob/master/js/libs/chroma.palette-gen.js)

I have taken the ideas and the theories, and put them into a simple modular library. I have also optimized it for speed.

This library generates a palette of *visually* distinct colors, and returns an array of [chroma-js](https://github.com/gka/chroma.js) objects.

distinct-colors is highly configurable:

- Choose how many colors are in the palette
- Restrict the hue to a specific range
- Restrict the chroma (saturation) to a specific range
- Restrict the lightness to a specific range
- Configure general quality of the palette

## Installation

```
npm install distinct-colors
```

## Getting Started

```javascript
var distinctColors = require('distinct-colors')

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
| quality | integer | `1-Infinity` | `50` | The number of steps for [k-means](https://en.wikipedia.org/wiki/K-means_clustering) convergence. |
| samples | integer | `1-Infinity` | `2000` | The number of color samples to choose from. |
