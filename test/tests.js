
import DC from '../src/index.js'

/* global describe, it */

var chai = require('chai')

const assert = chai.assert

describe('DistinctColors', function () {
  it('Should handle excessively large palettes', function () {
    this.timeout(3000)
    assert.ok(DC({ count: 500, lightMin: 90, samples: 10000, quality: 100 }))
  })

  it('Should override sample setting if too low', function () {
    assert.ok(DC({ count: 40, lightMin: 90, samples: 10, quality: 10 }))
  })

  it('Should work for all counts from 1 - 100', function () {
    this.timeout(4000)
    for (let i = 1; i <= 100; ++i) {
      assert.ok(DC({ count: i, quality: 5 }))
    }
  })

  it('Should throw error if min is >= max.', function () {
    assert.throws(function () {
      DC({ count: 26, lightMin: 90, lightMax: 90 })
    }, 'lightMax must be greater than lightMin!')
  })
})
