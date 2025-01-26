"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCallback = exports.thenify = void 0;
const any_promise_1 = __importDefault(require("any-promise"));
const assert_1 = __importDefault(require("assert"));
/**
 * Turn async functions into promises
 *
 * @param {Function} fn
 * @return {Function}
 * @api public
 */
function thenify(fn, options) {
    (0, assert_1.default)(typeof fn === 'function');
    return createWrapper(fn, options);
}
exports.thenify = thenify;
/**
 * Turn async functions into promises and backward compatible with callback
 */
function withCallback(fn, options) {
    (0, assert_1.default)(typeof fn === 'function');
    options = options || {};
    options.withCallback = true;
    return createWrapper(fn, options);
}
exports.withCallback = withCallback;
function createCallback(resolve, reject, multiArgs) {
    // default to true
    if (multiArgs === undefined)
        multiArgs = true;
    return function (err, value) {
        if (err)
            return reject(err);
        const length = arguments.length;
        if (length <= 2 || !multiArgs)
            return resolve(value);
        if (Array.isArray(multiArgs)) {
            const values = {};
            for (let i = 1; i < length; i++) {
                values[multiArgs[i - 1]] = arguments[i];
            }
            return resolve(values);
        }
        const values = new Array(length - 1);
        for (let i = 1; i < length; ++i)
            values[i - 1] = arguments[i];
        resolve(values);
    };
}
function createWrapper(fn, options) {
    options = options || {};
    let name = fn.name;
    name = (name || '').replace(/\s|bound(?!$)/g, '');
    const newFn = function () {
        const self = this;
        const len = arguments.length;
        if (options.withCallback) {
            const lastType = typeof arguments[len - 1];
            if (lastType === 'function')
                return fn.apply(self, arguments);
        }
        const args = new Array(len + 1);
        for (let i = 0; i < len; ++i)
            args[i] = arguments[i];
        const lastIndex = len;
        return new any_promise_1.default(function (resolve, reject) {
            args[lastIndex] = createCallback(resolve, reject, options === null || options === void 0 ? void 0 : options.multiArgs);
            fn.apply(self, args);
        });
    };
    Object.defineProperty(newFn, 'name', { value: name });
    return newFn;
}
//# sourceMappingURL=index.js.map