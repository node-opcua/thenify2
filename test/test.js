const should = require('should')

const { thenify, withCallback } = require('..')

it('fn.name', function () {
  function someCrazyName() {}

  should.equal('someCrazyName', thenify(someCrazyName).name)
  should.equal('someCrazyName', thenify(someCrazyName).name)
  // In ES6 spec, functions can infer the name of an anonymous function from its syntactic position.
  const noname = function () {}
  const name = noname.name

  should.equal(name, thenify(noname).name)
  should.equal(name, withCallback(noname).name)
})

it('fn.name (bound function)', function () {
  function bound() {}
  should.equal('bound', thenify(bound).name)
  should.equal('bound', withCallback(bound).name)

  const noname = function () {}.bind(this)
  should.equal('', thenify(noname).name)
  should.equal('', withCallback(noname).name)
})

it('fn(callback(err))', function () {
  function fn(cb) {
    setTimeout(function () {
      cb(new Error('boom'))
    }, 0)
  }

  return thenify(fn)()
    .then(function () {
      throw new Error('bang')
    })
    .catch(function (err) {
      should.equal(err.message, 'boom')
    })
})

it('fn(callback(null, value))', function () {
  function fn(cb) {
    cb(null, true)
  }

  return thenify(fn)().then(function (val) {
    should.equal(val, true)
  })
})

it('fn(callback(null, values...))', function () {
  function fn(cb) {
    cb(null, 1, 2, 3)
  }

  return thenify(fn)().then(function (values) {
    should.deepEqual(values, [1, 2, 3])
  })
})

it('fn(..args, callback())', function () {
  function fn(a, b, c, cb) {
    cb(null, a, b, c)
  }

  return thenify(fn)(1, 2, 3).then(function (values) {
    should.deepEqual(values, [1, 2, 3])
  })
})

it('unicode function name', function () {
  function 你好$hello_123(a, b, c, cb) {
    cb(null, a, b, c)
  }
  const wrapper = thenify(你好$hello_123)
  should.equal(wrapper.name, '你好$hello_123')
  wrapper(1, 2, 3).then(function (values) {
    should.deepEqual(values, [1, 2, 3])
  })
})

it('invalid function name', function () {
  function fn(a, b, c, cb) {
    cb(null, a, b, c)
  }

  Object.defineProperty(fn, 'name', { value: 'fake(){a.b;})();(function(){//' })
  const wrapper = thenify(fn)
  should.equal(wrapper.name, fn.name)
  wrapper(1, 2, 3).then(function (values) {
    should.deepEqual(values, [1, 2, 3])
  })
})
