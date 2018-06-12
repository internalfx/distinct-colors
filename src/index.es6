
import utils from './utils'
import deepClone from 'mout/lang/deepClone'
import deepEquals from 'mout/lang/deepEquals'
import unique from 'mout/array/unique'
import chroma from 'chroma-js'

var defaults = {
  count: 5,
  hueMin: 0,
  hueMax: 360,
  chromaMin: 0,
  chromaMax: 100,
  lightMin: 0,
  lightMax: 100,
  quality: 50,
  samples: 800
}

var checkColor = function (lab, options) {
  var color = chroma.lab(lab)
  var hcl = color.hcl()
  var rgb = color.rgb()
  var compLab = chroma.rgb(rgb).lab()
  var labTolerance = 2

  return (
    hcl[0] >= options.hueMin &&
    hcl[0] <= options.hueMax &&
    hcl[1] >= options.chromaMin &&
    hcl[1] <= options.chromaMax &&
    hcl[2] >= options.lightMin &&
    hcl[2] <= options.lightMax &&
    compLab[0] >= (lab[0] - labTolerance) &&
    compLab[0] <= (lab[0] + labTolerance) &&
    compLab[1] >= (lab[1] - labTolerance) &&
    compLab[1] <= (lab[1] + labTolerance) &&
    compLab[2] >= (lab[2] - labTolerance) &&
    compLab[2] <= (lab[2] + labTolerance)
  )
}

var sortByContrast = function (colorList) {
  var unsortedColors = colorList.slice(0)
  var sortedColors = [unsortedColors.shift()]
  while (unsortedColors.length > 0) {
    let lastColor = sortedColors[sortedColors.length - 1]
    let nearest = 0
    let maxDist = Number.MIN_SAFE_INTEGER
    for (let i = 0; i < unsortedColors.length; i++) {
      let dist = Math.sqrt(
        Math.pow(Math.abs(lastColor[0] - unsortedColors[i][0]), 2) +
        Math.pow(Math.abs(lastColor[1] - unsortedColors[i][1]), 2) +
        Math.pow(Math.abs(lastColor[2] - unsortedColors[i][2]), 2)
      )
      if (dist > maxDist) {
        maxDist = dist
        nearest = i
      }
    }
    sortedColors.push(unsortedColors.splice(nearest, 1)[0])
  }
  return sortedColors
}

var distinctColors = function (opts = {}) {
  var options = utils.mergeObj(defaults, opts)

  if (options.count <= 0) { return [] }

  if (options.samples < options.count * 5) {
    options.samples = options.count * 5
  }

  var colors = []
  var zonesProto = []
  var samples = []

  var rangeDivider = Math.cbrt(options.samples)
  rangeDivider *= 1.001

  var hStep = (options.hueMax - options.hueMin) / rangeDivider
  var cStep = (options.chromaMax - options.chromaMin) / rangeDivider
  var lStep = (options.lightMax - options.lightMin) / rangeDivider
  for (let h = options.hueMin; h <= options.hueMax; h += hStep) {
    for (let c = options.chromaMin; c <= options.chromaMax; c += cStep) {
      for (let l = options.lightMin; l <= options.lightMax; l += lStep) {
        let color = chroma.hcl(h, c, l).lab()
        if (checkColor(color, options)) {
          samples.push(color)
        }
      }
    }
  }

  samples = unique(samples, function (a, b) {
    return a.toString() === b.toString()
  })

  if (samples.length < options.count) {
    throw new Error('Not enough samples to generate palette, increase sample count.')
  }

  let sliceSize = Math.floor(samples.length / options.count)

  for (let i = 0; i < samples.length; i += sliceSize) {
    colors.push(samples[i])
    zonesProto.push([])
    if (colors.length >= options.count) { break }
  }

  for (let step = 1; step <= options.quality; step++) {
    let zones = deepClone(zonesProto)

    // Find closest color for each sample
    for (let i = 0; i < samples.length; i++) {
      let minDist = Number.MAX_SAFE_INTEGER
      let nearest = 0
      for (let j = 0; j < colors.length; j++) {
        let dist = Math.sqrt(
          Math.pow(Math.abs(samples[i][0] - colors[j][0]), 2) +
          Math.pow(Math.abs(samples[i][1] - colors[j][1]), 2) +
          Math.pow(Math.abs(samples[i][2] - colors[j][2]), 2)
        )
        if (dist < minDist) {
          minDist = dist
          nearest = j
        }
      }
      zones[nearest].push(samples[i])
    }

    let lastColors = deepClone(colors)

    for (let i = 0; i < zones.length; i++) {
      let zone = zones[i]
      let size = zone.length
      let Ls = []
      let As = []
      let Bs = []

      for (let sample of zone) {
        Ls.push(sample[0])
        As.push(sample[1])
        Bs.push(sample[2])
      }

      let lAvg = utils.sum(Ls) / size
      let aAvg = utils.sum(As) / size
      let bAvg = utils.sum(Bs) / size

      colors[i] = [lAvg, aAvg, bAvg]
    }

    if (deepEquals(lastColors, colors)) {
      break
    }
  }

  colors = sortByContrast(colors)

  return colors.map((lab) => { return chroma.lab(lab) })
}

export default distinctColors
