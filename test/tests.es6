
import {assert} from 'chai'
import DC from '../src'

describe('DistinctColors', function () {
  it('Should override sample setting if too low', function () {
    assert.ok(DC({count: 40, lightMin: 90, samples: 10, quality: 10}))
  })
})
