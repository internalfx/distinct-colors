
import {assert} from 'chai'
import DC from '../src'

describe('DistinctColors', function () {
  it('Should work', function () {
    console.log(DC({count:50, lightMin: 50, samples: 100}))
  })
})
