'use strict'

require('@babel/register')({
  cwd: __dirname,
  plugins: ['@babel/plugin-transform-modules-commonjs'],
  only: [
    '../src/*',
    '../test/*'
  ]
})

require('./tests.js')
