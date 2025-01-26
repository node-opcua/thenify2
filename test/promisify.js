const assert = require('assert')

const { thenify } = require('../src')

const setImmediate =
  global.setImmediate ||
  function (fn) {
    process.nextTick(fn)
  }

describe('Promisify', function () {
  it('should reject errors', function (done) {
    function fn(done) {
      setImmediate(function () {
        const err = new Error('boom')
        err.boom = 'boom'
        done(err)
      })
    }

    const prom = thenify(fn)

    prom().catch(function (err) {
      assert.equal(err.message, 'boom')
      assert.equal(err.boom, 'boom')
      done()
    })
  })

  it('should reject errors with arguments', function (done) {
    function fn(a, b, done) {
      setImmediate(function () {
        done(new Error('boom'))
      })
    }

    const prom = thenify(fn)

    prom(1, 2).catch(function (err) {
      assert.equal(err.message, 'boom')
      done()
    })
  })

  /**
   * bluebird can resolve multiple arguments,
   * but v8 promises can't. -_-
   */
  it('should return the result', function (done) {
    function fn(done) {
      setImmediate(function () {
        done(null, 1)
      })
    }

    const prom = thenify(fn)

    prom().then(function (a) {
      assert.equal(a, 1)
      done()
    })
  })
})
