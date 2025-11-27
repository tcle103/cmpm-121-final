import { require_stream } from "./chunk-UAIQTZ7I.js";
import { __commonJS } from "./chunk-VUNV25KB.js";

// browser-external:assert
var require_assert = __commonJS({
  "browser-external:assert"(exports, module) {
    module.exports = Object.create(
      new Proxy({}, {
        get(_, key) {
          if (
            key !== "__esModule" && key !== "__proto__" &&
            key !== "constructor" && key !== "splice"
          ) {
            console.warn(
              `Module "assert" has been externalized for browser compatibility. Cannot access "assert.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`,
            );
          }
        },
      }),
    );
  },
});

// browser-external:crypto
var require_crypto = __commonJS({
  "browser-external:crypto"(exports, module) {
    module.exports = Object.create(
      new Proxy({}, {
        get(_, key) {
          if (
            key !== "__esModule" && key !== "__proto__" &&
            key !== "constructor" && key !== "splice"
          ) {
            console.warn(
              `Module "crypto" has been externalized for browser compatibility. Cannot access "crypto.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`,
            );
          }
        },
      }),
    );
  },
});

// browser-external:path
var require_path = __commonJS({
  "browser-external:path"(exports, module) {
    module.exports = Object.create(
      new Proxy({}, {
        get(_, key) {
          if (
            key !== "__esModule" && key !== "__proto__" &&
            key !== "constructor" && key !== "splice"
          ) {
            console.warn(
              `Module "path" has been externalized for browser compatibility. Cannot access "path.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`,
            );
          }
        },
      }),
    );
  },
});

// node_modules/.deno/hoek@6.1.3/node_modules/hoek/lib/deep-equal.js
var require_deep_equal = __commonJS({
  "node_modules/.deno/hoek@6.1.3/node_modules/hoek/lib/deep-equal.js"(
    exports,
    module,
  ) {
    "use strict";
    var internals = {
      arrayType: Symbol("array"),
      bufferType: Symbol("buffer"),
      dateType: Symbol("date"),
      errorType: Symbol("error"),
      genericType: Symbol("generic"),
      mapType: Symbol("map"),
      regexType: Symbol("regex"),
      setType: Symbol("set"),
      weakMapType: Symbol("weak-map"),
      weakSetType: Symbol("weak-set"),
      mismatched: Symbol("mismatched"),
    };
    internals.typeMap = {
      "[object Array]": internals.arrayType,
      "[object Date]": internals.dateType,
      "[object Error]": internals.errorType,
      "[object Map]": internals.mapType,
      "[object RegExp]": internals.regexType,
      "[object Set]": internals.setType,
      "[object WeakMap]": internals.weakMapType,
      "[object WeakSet]": internals.weakSetType,
    };
    internals.SeenEntry = class {
      constructor(obj, ref) {
        this.obj = obj;
        this.ref = ref;
      }
      isSame(obj, ref) {
        return this.obj === obj && this.ref === ref;
      }
    };
    internals.getInternalType = function (obj) {
      const { typeMap, bufferType, genericType } = internals;
      if (obj instanceof Buffer) {
        return bufferType;
      }
      const objName = Object.prototype.toString.call(obj);
      return typeMap[objName] || genericType;
    };
    internals.getSharedType = function (obj, ref, checkPrototype) {
      if (checkPrototype) {
        if (Object.getPrototypeOf(obj) !== Object.getPrototypeOf(ref)) {
          return internals.mismatched;
        }
        return internals.getInternalType(obj);
      }
      const type = internals.getInternalType(obj);
      if (type !== internals.getInternalType(ref)) {
        return internals.mismatched;
      }
      return type;
    };
    internals.valueOf = function (obj) {
      const objValueOf = obj.valueOf;
      if (objValueOf === void 0) {
        return obj;
      }
      try {
        return objValueOf.call(obj);
      } catch (err) {
        return err;
      }
    };
    internals.hasOwnEnumerableProperty = function (obj, key) {
      return Object.prototype.propertyIsEnumerable.call(obj, key);
    };
    internals.isSetSimpleEqual = function (obj, ref) {
      for (const entry of obj) {
        if (!ref.has(entry)) {
          return false;
        }
      }
      return true;
    };
    internals.isDeepEqualObj = function (
      instanceType,
      obj,
      ref,
      options,
      seen,
    ) {
      const { isDeepEqual, valueOf, hasOwnEnumerableProperty } = internals;
      const { keys, getOwnPropertySymbols } = Object;
      if (instanceType === internals.arrayType) {
        if (options.part) {
          for (let i = 0; i < obj.length; ++i) {
            const objValue = obj[i];
            for (let j = 0; j < ref.length; ++j) {
              if (isDeepEqual(objValue, ref[j], options, seen)) {
                return true;
              }
            }
          }
        } else {
          if (obj.length !== ref.length) {
            return false;
          }
          for (let i = 0; i < obj.length; ++i) {
            if (!isDeepEqual(obj[i], ref[i], options, seen)) {
              return false;
            }
          }
          return true;
        }
      } else if (instanceType === internals.setType) {
        if (obj.size !== ref.size) {
          return false;
        }
        if (!internals.isSetSimpleEqual(obj, ref)) {
          const ref2 = new Set(ref);
          for (const objEntry of obj) {
            if (ref2.delete(objEntry)) {
              continue;
            }
            let found = false;
            for (const refEntry of ref2) {
              if (isDeepEqual(objEntry, refEntry, options, seen)) {
                ref2.delete(refEntry);
                found = true;
                break;
              }
            }
            if (!found) {
              return false;
            }
          }
        }
      } else if (instanceType === internals.mapType) {
        if (obj.size !== ref.size) {
          return false;
        }
        for (const [key, value] of obj) {
          if (value === void 0 && !ref.has(key)) {
            return false;
          }
          if (!isDeepEqual(value, ref.get(key), options, seen)) {
            return false;
          }
        }
      } else if (instanceType === internals.errorType) {
        if (obj.name !== ref.name || obj.message !== ref.message) {
          return false;
        }
      }
      const valueOfObj = valueOf(obj);
      const valueOfRef = valueOf(ref);
      if (
        !(obj === valueOfObj && ref === valueOfRef) &&
        !isDeepEqual(valueOfObj, valueOfRef, options, seen)
      ) {
        return false;
      }
      const objKeys = keys(obj);
      if (!options.part && objKeys.length !== keys(ref).length) {
        return false;
      }
      for (let i = 0; i < objKeys.length; ++i) {
        const key = objKeys[i];
        if (!hasOwnEnumerableProperty(ref, key)) {
          return false;
        }
        if (!isDeepEqual(obj[key], ref[key], options, seen)) {
          return false;
        }
      }
      if (options.symbols) {
        const objSymbols = getOwnPropertySymbols(obj);
        const refSymbols = new Set(getOwnPropertySymbols(ref));
        for (let i = 0; i < objSymbols.length; ++i) {
          const key = objSymbols[i];
          if (hasOwnEnumerableProperty(obj, key)) {
            if (!hasOwnEnumerableProperty(ref, key)) {
              return false;
            }
            if (!isDeepEqual(obj[key], ref[key], options, seen)) {
              return false;
            }
          } else if (hasOwnEnumerableProperty(ref, key)) {
            return false;
          }
          refSymbols.delete(key);
        }
        for (const key of refSymbols) {
          if (hasOwnEnumerableProperty(ref, key)) {
            return false;
          }
        }
      }
      return true;
    };
    internals.isDeepEqual = function (obj, ref, options, seen) {
      if (obj === ref) {
        return obj !== 0 || 1 / obj === 1 / ref;
      }
      const type = typeof obj;
      if (type !== typeof ref) {
        return false;
      }
      if (type !== "object" || obj === null || ref === null) {
        return obj !== obj && ref !== ref;
      }
      const instanceType = internals.getSharedType(
        obj,
        ref,
        !!options.prototype,
      );
      switch (instanceType) {
        case internals.bufferType:
          return Buffer.prototype.equals.call(obj, ref);
        case internals.regexType:
          return obj.toString() === ref.toString();
        case internals.mismatched:
          return false;
      }
      for (let i = seen.length - 1; i >= 0; --i) {
        if (seen[i].isSame(obj, ref)) {
          return true;
        }
      }
      seen.push(new internals.SeenEntry(obj, ref));
      try {
        return !!internals.isDeepEqualObj(
          instanceType,
          obj,
          ref,
          options,
          seen,
        );
      } finally {
        seen.pop();
      }
    };
    module.exports = function (obj, ref, options) {
      options = options || { prototype: true };
      return !!internals.isDeepEqual(obj, ref, options, []);
    };
  },
});

// node_modules/.deno/hoek@6.1.3/node_modules/hoek/lib/escape.js
var require_escape = __commonJS({
  "node_modules/.deno/hoek@6.1.3/node_modules/hoek/lib/escape.js"(exports) {
    "use strict";
    var internals = {};
    exports.escapeHtml = function (input) {
      if (!input) {
        return "";
      }
      let escaped = "";
      for (let i = 0; i < input.length; ++i) {
        const charCode = input.charCodeAt(i);
        if (internals.isSafe(charCode)) {
          escaped += input[i];
        } else {
          escaped += internals.escapeHtmlChar(charCode);
        }
      }
      return escaped;
    };
    exports.escapeJson = function (input) {
      if (!input) {
        return "";
      }
      const lessThan = 60;
      const greaterThan = 62;
      const andSymbol = 38;
      const lineSeperator = 8232;
      let charCode;
      return input.replace(/[<>&\u2028\u2029]/g, (match) => {
        charCode = match.charCodeAt(0);
        if (charCode === lessThan) {
          return "\\u003c";
        }
        if (charCode === greaterThan) {
          return "\\u003e";
        }
        if (charCode === andSymbol) {
          return "\\u0026";
        }
        if (charCode === lineSeperator) {
          return "\\u2028";
        }
        return "\\u2029";
      });
    };
    internals.escapeHtmlChar = function (charCode) {
      const namedEscape = internals.namedHtml[charCode];
      if (typeof namedEscape !== "undefined") {
        return namedEscape;
      }
      if (charCode >= 256) {
        return "&#" + charCode + ";";
      }
      const hexValue = Buffer.from(String.fromCharCode(charCode), "ascii")
        .toString("hex");
      return `&#x${hexValue};`;
    };
    internals.isSafe = function (charCode) {
      return typeof internals.safeCharCodes[charCode] !== "undefined";
    };
    internals.namedHtml = {
      "38": "&amp;",
      "60": "&lt;",
      "62": "&gt;",
      "34": "&quot;",
      "160": "&nbsp;",
      "162": "&cent;",
      "163": "&pound;",
      "164": "&curren;",
      "169": "&copy;",
      "174": "&reg;",
    };
    internals.safeCharCodes = (function () {
      const safe = {};
      for (let i = 32; i < 123; ++i) {
        if (
          i >= 97 || // a-z
          i >= 65 && i <= 90 || // A-Z
          i >= 48 && i <= 57 || // 0-9
          i === 32 || // space
          i === 46 || // .
          i === 44 || // ,
          i === 45 || // -
          i === 58 || // :
          i === 95
        ) {
          safe[i] = null;
        }
      }
      return safe;
    })();
  },
});

// node_modules/.deno/hoek@6.1.3/node_modules/hoek/lib/index.js
var require_lib = __commonJS({
  "node_modules/.deno/hoek@6.1.3/node_modules/hoek/lib/index.js"(exports) {
    "use strict";
    var Assert = require_assert();
    var Crypto = require_crypto();
    var Path = require_path();
    var DeepEqual = require_deep_equal();
    var Escape = require_escape();
    var internals = {};
    exports.deepEqual = DeepEqual;
    exports.clone = function (obj, options = {}, _seen = null) {
      if (typeof obj !== "object" || obj === null) {
        return obj;
      }
      const seen = _seen || /* @__PURE__ */ new Map();
      const lookup = seen.get(obj);
      if (lookup) {
        return lookup;
      }
      let newObj;
      let cloneDeep = false;
      const isArray = Array.isArray(obj);
      if (!isArray) {
        if (Buffer.isBuffer(obj)) {
          newObj = Buffer.from(obj);
        } else if (obj instanceof Date) {
          newObj = new Date(obj.getTime());
        } else if (obj instanceof RegExp) {
          newObj = new RegExp(obj);
        } else {
          if (options.prototype !== false) {
            const proto = Object.getPrototypeOf(obj);
            if (proto && proto.isImmutable) {
              newObj = obj;
            } else {
              newObj = Object.create(proto);
              cloneDeep = true;
            }
          } else {
            newObj = {};
            cloneDeep = true;
          }
        }
      } else {
        newObj = [];
        cloneDeep = true;
      }
      seen.set(obj, newObj);
      if (cloneDeep) {
        const keys = internals.keys(obj, options);
        for (let i = 0; i < keys.length; ++i) {
          const key = keys[i];
          if (isArray && key === "length") {
            continue;
          }
          const descriptor = Object.getOwnPropertyDescriptor(obj, key);
          if (descriptor && (descriptor.get || descriptor.set)) {
            Object.defineProperty(newObj, key, descriptor);
          } else {
            Object.defineProperty(newObj, key, {
              enumerable: descriptor ? descriptor.enumerable : true,
              writable: true,
              configurable: true,
              value: exports.clone(obj[key], options, seen),
            });
          }
        }
        if (isArray) {
          newObj.length = obj.length;
        }
      }
      return newObj;
    };
    internals.keys = function (obj, options = {}) {
      return options.symbols
        ? Reflect.ownKeys(obj)
        : Object.getOwnPropertyNames(obj);
    };
    exports.merge = function (target, source, isNullOverride, isMergeArrays) {
      exports.assert(
        target && typeof target === "object",
        "Invalid target value: must be an object",
      );
      exports.assert(
        source === null || source === void 0 || typeof source === "object",
        "Invalid source value: must be null, undefined, or an object",
      );
      if (!source) {
        return target;
      }
      if (Array.isArray(source)) {
        exports.assert(
          Array.isArray(target),
          "Cannot merge array onto an object",
        );
        if (isMergeArrays === false) {
          target.length = 0;
        }
        for (let i = 0; i < source.length; ++i) {
          target.push(exports.clone(source[i]));
        }
        return target;
      }
      const keys = internals.keys(source);
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (
          key === "__proto__" ||
          !Object.prototype.propertyIsEnumerable.call(source, key)
        ) {
          continue;
        }
        const value = source[key];
        if (value && typeof value === "object") {
          if (
            !target[key] || typeof target[key] !== "object" ||
            Array.isArray(target[key]) !== Array.isArray(value) ||
            value instanceof Date || Buffer.isBuffer(value) ||
            value instanceof RegExp
          ) {
            target[key] = exports.clone(value);
          } else {
            exports.merge(target[key], value, isNullOverride, isMergeArrays);
          }
        } else {
          if (value !== null && value !== void 0) {
            target[key] = value;
          } else if (isNullOverride !== false) {
            target[key] = value;
          }
        }
      }
      return target;
    };
    exports.applyToDefaults = function (defaults, options, isNullOverride) {
      exports.assert(
        defaults && typeof defaults === "object",
        "Invalid defaults value: must be an object",
      );
      exports.assert(
        !options || options === true || typeof options === "object",
        "Invalid options value: must be true, falsy or an object",
      );
      if (!options) {
        return null;
      }
      const copy = exports.clone(defaults);
      if (options === true) {
        return copy;
      }
      return exports.merge(copy, options, isNullOverride === true, false);
    };
    exports.cloneWithShallow = function (source, keys, options) {
      if (!source || typeof source !== "object") {
        return source;
      }
      const storage = internals.store(source, keys);
      const copy = exports.clone(source, options);
      internals.restore(copy, source, storage);
      return copy;
    };
    internals.store = function (source, keys) {
      const storage = /* @__PURE__ */ new Map();
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const value = exports.reach(source, key);
        if (typeof value === "object" || typeof value === "function") {
          storage.set(key, value);
          internals.reachSet(source, key, void 0);
        }
      }
      return storage;
    };
    internals.restore = function (copy, source, storage) {
      for (const [key, value] of storage) {
        internals.reachSet(copy, key, value);
        internals.reachSet(source, key, value);
      }
    };
    internals.reachSet = function (obj, key, value) {
      const path = Array.isArray(key) ? key : key.split(".");
      let ref = obj;
      for (let i = 0; i < path.length; ++i) {
        const segment = path[i];
        if (i + 1 === path.length) {
          ref[segment] = value;
        }
        ref = ref[segment];
      }
    };
    exports.applyToDefaultsWithShallow = function (defaults, options, keys) {
      exports.assert(
        defaults && typeof defaults === "object",
        "Invalid defaults value: must be an object",
      );
      exports.assert(
        !options || options === true || typeof options === "object",
        "Invalid options value: must be true, falsy or an object",
      );
      exports.assert(keys && Array.isArray(keys), "Invalid keys");
      if (!options) {
        return null;
      }
      const copy = exports.cloneWithShallow(defaults, keys);
      if (options === true) {
        return copy;
      }
      const storage = internals.store(options, keys);
      exports.merge(copy, options, false, false);
      internals.restore(copy, options, storage);
      return copy;
    };
    exports.intersect = function (array1, array2, justFirst) {
      if (!array1 || !array2) {
        return justFirst ? null : [];
      }
      const common = [];
      const hash = Array.isArray(array1) ? new Set(array1) : array1;
      const found = /* @__PURE__ */ new Set();
      for (const value of array2) {
        if (internals.has(hash, value) && !found.has(value)) {
          if (justFirst) {
            return value;
          }
          common.push(value);
          found.add(value);
        }
      }
      return justFirst ? null : common;
    };
    internals.has = function (ref, key) {
      if (typeof ref.has === "function") {
        return ref.has(key);
      }
      return ref[key] !== void 0;
    };
    exports.contain = function (ref, values, options = {}) {
      let valuePairs = null;
      if (
        typeof ref === "object" && typeof values === "object" &&
        !Array.isArray(ref) && !Array.isArray(values)
      ) {
        valuePairs = values;
        const symbols = Object.getOwnPropertySymbols(values).filter(
          Object.prototype.propertyIsEnumerable.bind(values),
        );
        values = [...Object.keys(values), ...symbols];
      } else {
        values = [].concat(values);
      }
      exports.assert(
        typeof ref === "string" || typeof ref === "object",
        "Reference must be string or an object",
      );
      exports.assert(values.length, "Values array cannot be empty");
      let compare;
      let compareFlags;
      if (options.deep) {
        compare = exports.deepEqual;
        const hasOnly = options.hasOwnProperty("only");
        const hasPart = options.hasOwnProperty("part");
        compareFlags = {
          prototype: hasOnly ? options.only : hasPart ? !options.part : false,
          part: hasOnly ? !options.only : hasPart ? options.part : false,
        };
      } else {
        compare = (a, b) => a === b;
      }
      let misses = false;
      const matches = new Array(values.length);
      for (let i = 0; i < matches.length; ++i) {
        matches[i] = 0;
      }
      if (typeof ref === "string") {
        let pattern = "(";
        for (let i = 0; i < values.length; ++i) {
          const value = values[i];
          exports.assert(
            typeof value === "string",
            "Cannot compare string reference to non-string value",
          );
          pattern += (i ? "|" : "") + exports.escapeRegex(value);
        }
        const regex = new RegExp(pattern + ")", "g");
        const leftovers = ref.replace(regex, ($0, $1) => {
          const index = values.indexOf($1);
          ++matches[index];
          return "";
        });
        misses = !!leftovers;
      } else if (Array.isArray(ref)) {
        const onlyOnce = !!(options.only && options.once);
        if (onlyOnce && ref.length !== values.length) {
          return false;
        }
        for (let i = 0; i < ref.length; ++i) {
          let matched = false;
          for (let j = 0; j < values.length && matched === false; ++j) {
            if (!onlyOnce || matches[j] === 0) {
              matched = compare(values[j], ref[i], compareFlags) && j;
            }
          }
          if (matched !== false) {
            ++matches[matched];
          } else {
            misses = true;
          }
        }
      } else {
        const keys = internals.keys(ref, options);
        for (let i = 0; i < keys.length; ++i) {
          const key = keys[i];
          const pos = values.indexOf(key);
          if (pos !== -1) {
            if (
              valuePairs && !compare(valuePairs[key], ref[key], compareFlags)
            ) {
              return false;
            }
            ++matches[pos];
          } else {
            misses = true;
          }
        }
      }
      if (options.only) {
        if (misses || !options.once) {
          return !misses;
        }
      }
      let result = false;
      for (let i = 0; i < matches.length; ++i) {
        result = result || !!matches[i];
        if (options.once && matches[i] > 1 || !options.part && !matches[i]) {
          return false;
        }
      }
      return result;
    };
    exports.flatten = function (array, target) {
      const result = target || [];
      for (let i = 0; i < array.length; ++i) {
        if (Array.isArray(array[i])) {
          exports.flatten(array[i], result);
        } else {
          result.push(array[i]);
        }
      }
      return result;
    };
    exports.reach = function (obj, chain, options) {
      if (chain === false || chain === null || typeof chain === "undefined") {
        return obj;
      }
      options = options || {};
      if (typeof options === "string") {
        options = { separator: options };
      }
      const isChainArray = Array.isArray(chain);
      exports.assert(
        !isChainArray || !options.separator,
        "Separator option no valid for array-based chain",
      );
      const path = isChainArray ? chain : chain.split(options.separator || ".");
      let ref = obj;
      for (let i = 0; i < path.length; ++i) {
        let key = path[i];
        if (Array.isArray(ref)) {
          const number = Number(key);
          if (Number.isInteger(number) && number < 0) {
            key = ref.length + number;
          }
        }
        if (
          !ref ||
          !((typeof ref === "object" || typeof ref === "function") &&
            key in ref) ||
          typeof ref !== "object" && options.functions === false
        ) {
          exports.assert(
            !options.strict || i + 1 === path.length,
            "Missing segment",
            key,
            "in reach path ",
            chain,
          );
          exports.assert(
            typeof ref === "object" || options.functions === true ||
              typeof ref !== "function",
            "Invalid segment",
            key,
            "in reach path ",
            chain,
          );
          ref = options.default;
          break;
        }
        ref = ref[key];
      }
      return ref;
    };
    exports.reachTemplate = function (obj, template, options) {
      return template.replace(/{([^}]+)}/g, ($0, chain) => {
        const value = exports.reach(obj, chain, options);
        return value === void 0 || value === null ? "" : value;
      });
    };
    exports.assert = function (condition, ...args) {
      if (condition) {
        return;
      }
      if (args.length === 1 && args[0] instanceof Error) {
        throw args[0];
      }
      const msgs = args.filter((arg) => arg !== "").map((arg) => {
        return typeof arg === "string"
          ? arg
          : arg instanceof Error
          ? arg.message
          : exports.stringify(arg);
      });
      throw new Assert.AssertionError({
        message: msgs.join(" ") || "Unknown error",
        actual: false,
        expected: true,
        operator: "==",
        stackStartFunction: exports.assert,
      });
    };
    exports.Bench = function () {
      this.ts = 0;
      this.reset();
    };
    exports.Bench.prototype.reset = function () {
      this.ts = exports.Bench.now();
    };
    exports.Bench.prototype.elapsed = function () {
      return exports.Bench.now() - this.ts;
    };
    exports.Bench.now = function () {
      const ts = process.hrtime();
      return ts[0] * 1e3 + ts[1] / 1e6;
    };
    exports.escapeRegex = function (string) {
      return string.replace(
        /[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g,
        "\\$&",
      );
    };
    exports.escapeHeaderAttribute = function (attribute) {
      exports.assert(
        /^[ \w\!#\$%&'\(\)\*\+,\-\.\/\:;<\=>\?@\[\]\^`\{\|\}~\"\\]*$/.test(
          attribute,
        ),
        "Bad attribute value (" + attribute + ")",
      );
      return attribute.replace(/\\/g, "\\\\").replace(/\"/g, '\\"');
    };
    exports.escapeHtml = function (string) {
      return Escape.escapeHtml(string);
    };
    exports.escapeJson = function (string) {
      return Escape.escapeJson(string);
    };
    exports.once = function (method) {
      if (method._hoekOnce) {
        return method;
      }
      let once = false;
      const wrapped = function (...args) {
        if (!once) {
          once = true;
          method(...args);
        }
      };
      wrapped._hoekOnce = true;
      return wrapped;
    };
    exports.ignore = function () {
    };
    exports.uniqueFilename = function (path, extension) {
      if (extension) {
        extension = extension[0] !== "." ? "." + extension : extension;
      } else {
        extension = "";
      }
      path = Path.resolve(path);
      const name =
        [Date.now(), process.pid, Crypto.randomBytes(8).toString("hex")].join(
          "-",
        ) + extension;
      return Path.join(path, name);
    };
    exports.stringify = function (...args) {
      try {
        return JSON.stringify.apply(null, args);
      } catch (err) {
        return "[Cannot display object: " + err.message + "]";
      }
    };
    exports.wait = function (timeout) {
      return new Promise((resolve) => setTimeout(resolve, timeout));
    };
    exports.block = function () {
      return new Promise(exports.ignore);
    };
  },
});

// node_modules/.deno/ammo@3.0.3/node_modules/ammo/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/.deno/ammo@3.0.3/node_modules/ammo/lib/index.js"(exports) {
    var Stream = require_stream();
    var Hoek = require_lib();
    var internals = {};
    internals.Range = class {
      constructor(from, to) {
        this.from = from;
        this.to = to;
      }
    };
    exports.header = function (header, length) {
      const parts = header.split("=");
      if (parts.length !== 2 || parts[0] !== "bytes") {
        return null;
      }
      const lastPos = length - 1;
      const result = [];
      const ranges = parts[1].match(/\d*\-\d*/g);
      for (let i = 0; i < ranges.length; ++i) {
        let range = ranges[i];
        if (range.length === 1) {
          return null;
        }
        let from;
        let to;
        range = range.split("-");
        if (range[0]) {
          from = parseInt(range[0], 10);
        }
        if (range[1]) {
          to = parseInt(range[1], 10);
          if (from !== void 0) {
            if (to > lastPos) {
              to = lastPos;
            }
          } else {
            from = length - to;
            to = lastPos;
          }
        } else {
          to = lastPos;
        }
        if (from > to) {
          return null;
        }
        result.push(new internals.Range(from, to));
      }
      if (result.length === 1) {
        return result;
      }
      result.sort((a, b) => a.from - b.from);
      const consolidated = [];
      for (let i = result.length - 1; i > 0; --i) {
        const current = result[i];
        const before = result[i - 1];
        if (current.from <= before.to + 1) {
          before.to = current.to;
        } else {
          consolidated.unshift(current);
        }
      }
      consolidated.unshift(result[0]);
      return consolidated;
    };
    exports.Stream = internals.Stream = class extends Stream.Transform {
      constructor(range) {
        if (!(range instanceof internals.Range)) {
          Hoek.assert(typeof range === "object", 'Expected "range" object');
          const from = range.from || 0;
          Hoek.assert(
            typeof from === "number",
            '"range.from" must be falsy, or a number',
          );
          Hoek.assert(
            from === parseInt(from, 10) && from >= 0,
            '"range.from" must be a positive integer',
          );
          const to = range.to || 0;
          Hoek.assert(
            typeof to === "number",
            '"range.to" must be falsy, or a number',
          );
          Hoek.assert(
            to === parseInt(to, 10) && to >= 0,
            '"range.to" must be a positive integer',
          );
          Hoek.assert(
            to >= from,
            '"range.to" must be greater than or equal to "range.from"',
          );
          range = new internals.Range(from, to);
        }
        super();
        this._range = range;
        this._next = 0;
      }
      processChunk(chunk) {
        const pos = this._next;
        this._next = this._next + chunk.length;
        if (
          this._next <= this._range.from || // Before range
          pos > this._range.to
        ) {
          return;
        }
        const from = Math.max(0, this._range.from - pos);
        const to = Math.min(chunk.length, this._range.to - pos + 1);
        this.push(chunk.slice(from, to));
      }
      _transform(chunk, encoding, done) {
        try {
          this.processChunk(chunk);
        } catch (err) {
          return done(err);
        }
        return done();
      }
    };
  },
});
export default require_lib2();
//# sourceMappingURL=ammo.js.map
