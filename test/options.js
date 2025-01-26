const assert = require('assert')

const { thenify } = require('../src')

const setImmediate =
  global.setImmediate ||
  function (fn) {
    process.nextTick(fn)
  }

describe('options', function () {
  describe('.withCallback', function () {
    function fn(cb) {
      cb(null, true)
    }

    it('promise', function () {
      return thenify(fn, { withCallback: true })().then((val) => {
        assert.equal(val, true)
      })
    })

    it('callback', function (done) {
      return thenify(fn, { withCallback: true })((err, val) => {
        assert.equal(val, true)
        done()
      })
    })
  })

  describe('.multiArgs', function () {
    function fn(cb) {
      cb(null, 1, 2, 3)
    }

    it('default to true', function () {
      return thenify(fn)().then(function (values) {
        assert.deepEqual(values, [1, 2, 3])
      })
    })

    it('set to false', function () {
      return thenify(fn, { multiArgs: false })().then(function (value) {
        assert.equal(value, 1)
      })
    })

    it('set to array', function () {
      return thenify(fn, { multiArgs: ['one', 'tow', 'three'] })().then(
        function (value) {
          assert.deepEqual(value, {
            one: 1,
            tow: 2,
            three: 3,
          })
        },
      )
    })
  })
})
