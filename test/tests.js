
import DC from '../src/index.js'
import chalk from 'chalk'

/* global describe, it */

var chai = require('chai')

const assert = chai.assert

const printPalette = function (palette) {
  const output = palette.map(function (color) {
    return chalk.bgHex(color.hex())(' ')
  })
  console.log(output.join(''))
}

describe('DistinctColors', function () {
  for (let i = 10; i <= 100; i += 1) {
    it(`Should work if {count:${i}}.`, function () {
      const palette = DC({ count: i, samples: 10 })
      // printPalette(palette)

      assert.ok(palette)
    })
  }

  it('Should handle excessively large palettes', function () {
    this.timeout(3000)

    const palette = DC({ count: 500 })
    // printPalette(palette)
    assert.ok(palette)
  })

  it('Should override sample setting if too low', function () {
    const palette = DC({ count: 40, lightMin: 90, samples: 10, quality: 10 })
    // printPalette(palette)
    assert.ok(palette)
  })

  it('Should create dark palettes', function () {
    const palette = DC({ count: 20, lightMax: 15 })
    printPalette(palette)
    assert.ok(palette)
  })

  it('Should create light palettes', function () {
    const palette = DC({ count: 20, lightMin: 85 })
    printPalette(palette)
    assert.ok(palette)
  })

  it('Should create low chroma palettes', function () {
    const palette = DC({ count: 20, chromaMax: 15 })
    printPalette(palette)
    assert.ok(palette)
  })

  it('Should create high chroma palettes', function () {
    const palette = DC({ count: 20, chromaMin: 85 })
    printPalette(palette)
    assert.ok(palette)
  })

  it('Should create red palettes', function () {
    const palette = DC({ count: 20, lightMin: 60, hueMax: 35 })
    printPalette(palette)
    assert.ok(palette)
  })

  it('Should create orange palettes', function () {
    const palette = DC({ count: 20, lightMin: 70, hueMin: 40, hueMax: 70 })
    printPalette(palette)
    assert.ok(palette)
  })

  it('Should create yellow palettes', function () {
    const palette = DC({ count: 20, lightMin: 70, hueMin: 80, hueMax: 100 })
    printPalette(palette)
    assert.ok(palette)
  })

  it('Should create green palettes', function () {
    const palette = DC({ count: 20, lightMin: 60, hueMin: 120, hueMax: 155 })
    printPalette(palette)
    assert.ok(palette)
  })

  it('Should create blue palettes', function () {
    const palette = DC({ count: 20, lightMin: 60, hueMin: 220, hueMax: 250 })
    printPalette(palette)
    assert.ok(palette)
  })

  it('Should create violet palettes', function () {
    const palette = DC({ count: 20, lightMin: 60, hueMin: 290, hueMax: 310 })
    printPalette(palette)
    assert.ok(palette)
  })

  it('Should throw error if min is >= max.', function () {
    assert.throws(function () {
      DC({ count: 26, lightMin: 90, lightMax: 90 })
    }, 'lightMax must be greater than lightMin!')
  })
})
