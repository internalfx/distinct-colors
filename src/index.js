
import utils from './utils'
import deepClone from 'mout/lang/deepClone'
import deepEquals from 'mout/lang/deepEquals'
import chroma from 'chroma-js'

const defaults = {
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

const getClosestIndex = function (colors, color) {
  let minDist = Number.MAX_SAFE_INTEGER
  let nearest = 0
  for (let idx = 0; idx < colors.length; idx += 1) {
    const sample = colors[idx]
    const dist = Math.sqrt(
      Math.pow(Math.abs(sample[0] - color[0]), 2) +
      Math.pow(Math.abs(sample[1] - color[1]), 2) +
      Math.pow(Math.abs(sample[2] - color[2]), 2)
    )
    if (dist < minDist) {
      minDist = dist
      nearest = idx
    }
  }

  return nearest
}

const checkColor = function (lab, options) {
  const color = chroma.lab(lab)
  const hcl = color.hcl()
  const rgb = color.rgb()
  const compLab = chroma.rgb(rgb).lab()
  const labTolerance = 2

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

const sortByContrast = function (colorList) {
  const unsortedColors = colorList.slice(0)
  const sortedColors = [unsortedColors.shift()]
  while (unsortedColors.length > 0) {
    const lastColor = sortedColors[sortedColors.length - 1]
    let nearest = 0
    let maxDist = Number.MIN_SAFE_INTEGER
    for (let i = 0; i < unsortedColors.length; i += 1) {
      const dist = Math.sqrt(
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

const distinctColors = function (opts = {}) {
  const options = { ...defaults, ...opts }

  if (options.count <= 0) { return [] }

  if (options.samples < options.count * 3) {
    options.samples = Math.ceil(options.count * 3)
  }

  let colors = []
  const zonesProto = []
  let samples = new Set()

  const rangeDivider = Math.ceil(Math.cbrt(options.samples))

  const hStep = (options.hueMax - options.hueMin) / rangeDivider
  const cStep = (options.chromaMax - options.chromaMin) / rangeDivider
  const lStep = (options.lightMax - options.lightMin) / rangeDivider

  if (hStep <= 0) { throw new Error('hueMax must be greater than hueMin!') }
  if (cStep <= 0) { throw new Error('chromaMax must be greater than chromaMin!') }
  if (lStep <= 0) { throw new Error('lightMax must be greater than lightMin!') }

  for (let h = options.hueMin + hStep / 2; h <= options.hueMax; h += hStep) {
    for (let c = options.chromaMin + cStep / 2; c <= options.chromaMax; c += cStep) {
      for (let l = options.lightMin + lStep / 2; l <= options.lightMax; l += lStep) {
        const color = chroma.hcl(h, c, l).lab()
        if (checkColor(color, options)) {
          samples.add(color.toString())
        }
      }
    }
  }

  samples = Array.from(samples)
  samples = samples.map(i => i.split(',').map(j => parseFloat(j)))

  if (samples.length < options.count) {
    throw new Error('Not enough samples to generate palette, increase sample count.')
  }

  const sliceSize = Math.floor(samples.length / options.count)

  for (let i = 0; i < samples.length; i += sliceSize) {
    colors.push(samples[i])
    zonesProto.push([])
    if (colors.length >= options.count) { break }
  }

  for (let step = 1; step <= options.quality; step += 1) {
    const zones = deepClone(zonesProto)
    const sampleList = deepClone(samples)

    // Immediately add the closest sample for each color
    for (let i = 0; i < colors.length; i += 1) {
      const idx = getClosestIndex(sampleList, colors[i])
      zones[i].push(sampleList[idx])
      sampleList.splice(idx, 1)
    }

    // Find closest color for each remaining sample
    for (let i = 0; i < sampleList.length; i += 1) {
      const sample = samples[i]
      const nearest = getClosestIndex(colors, sample)
      zones[nearest].push(samples[i])
    }

    const lastColors = deepClone(colors)

    for (let i = 0; i < zones.length; i += 1) {
      const zone = zones[i]
      const size = zone.length
      const Ls = []
      const As = []
      const Bs = []

      for (const sample of zone) {
        Ls.push(sample[0])
        As.push(sample[1])
        Bs.push(sample[2])
      }

      const lAvg = utils.sum(Ls) / size
      const aAvg = utils.sum(As) / size
      const bAvg = utils.sum(Bs) / size

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
