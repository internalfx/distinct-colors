
var _ = {
  merge: require('lodash.merge'),
  cloneDeep: require('lodash.clonedeep'),
  isEqual: require('lodash.isequal'),
  sum: require('lodash.sum'),
  random: require('lodash.random')
}
var chroma = require('chroma-js')

var defaults = {
  count: 5,
  hueMin: 0,
  hueMax: 360,
  chromaMin: 0,
  chromaMax: 100,
  lightMin: 0,
  lightMax: 100,
  quality: 50,
  samples: 2000
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
  var unsortedColors = _.clone(colorList)
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
    sortedColors.push(_.pullAt(unsortedColors, nearest)[0])
  }
  return sortedColors
}

var distinctColors = function (opts={}) {

  var options = _.merge(defaults, opts)

  var colors = []
  var zonesProto = []
  var samples = []

  var rangeDivider = Math.cbrt(options.samples)
  var lStep = 100 / rangeDivider
  var aStep = 190 / rangeDivider
  var bStep = 208 / rangeDivider
  for (let l = 0; l <= 100; l += lStep) {
    for (let a = -89; a <= 101; a += aStep) {
      for (let b = -110; b <= 98; b += bStep) {
        let color = [l, a, b]
        if (checkColor(color, options)) {
          samples.push(color)
        }
      }
    }
  }

  let sliceSize = Math.floor(samples.length / (options.count + 1))

  for (let i = sliceSize; i < samples.length; i += sliceSize) {
    colors.push(samples[i])
    zonesProto.push([])
    if (colors.length >= options.count) { break }
  }

  for (let step = 1; step <= options.quality; step++) {

    let zones = _.cloneDeep(zonesProto)

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

    let lastColors = _.cloneDeep(colors)

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

      let lAvg = _.sum(Ls) / size
      let aAvg = _.sum(As) / size
      let bAvg = _.sum(Bs) / size

      colors[i] = [lAvg, aAvg, bAvg]
    }

    if (_.isEqual(lastColors, colors)) {
      break
    }

  }

  colors = sortByContrast(colors)

  return colors.map((lab) => { return chroma.lab(lab) })
}

module.exports = distinctColors
