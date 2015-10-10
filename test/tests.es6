
import {assert} from 'chai'
import DC from '../src'

describe('DistinctColors', function () {
  it('Should work', function () {
    assert.ok(DC({count:50, lightMin: 80}))
  })
})
