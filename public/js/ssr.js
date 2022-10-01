/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@vue/devtools-api/lib/esm/const.js":
/*!*********************************************************!*\
  !*** ./node_modules/@vue/devtools-api/lib/esm/const.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HOOK_PLUGIN_SETTINGS_SET": () => (/* binding */ HOOK_PLUGIN_SETTINGS_SET),
/* harmony export */   "HOOK_SETUP": () => (/* binding */ HOOK_SETUP)
/* harmony export */ });
const HOOK_SETUP = 'devtools-plugin:setup';
const HOOK_PLUGIN_SETTINGS_SET = 'plugin:settings:set';


/***/ }),

/***/ "./node_modules/@vue/devtools-api/lib/esm/env.js":
/*!*******************************************************!*\
  !*** ./node_modules/@vue/devtools-api/lib/esm/env.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getDevtoolsGlobalHook": () => (/* binding */ getDevtoolsGlobalHook),
/* harmony export */   "getTarget": () => (/* binding */ getTarget),
/* harmony export */   "isProxyAvailable": () => (/* binding */ isProxyAvailable)
/* harmony export */ });
function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function getTarget() {
    // @ts-ignore
    return (typeof navigator !== 'undefined' && typeof window !== 'undefined')
        ? window
        : typeof global !== 'undefined'
            ? global
            : {};
}
const isProxyAvailable = typeof Proxy === 'function';


/***/ }),

/***/ "./node_modules/@vue/devtools-api/lib/esm/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@vue/devtools-api/lib/esm/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isPerformanceSupported": () => (/* reexport safe */ _time__WEBPACK_IMPORTED_MODULE_0__.isPerformanceSupported),
/* harmony export */   "now": () => (/* reexport safe */ _time__WEBPACK_IMPORTED_MODULE_0__.now),
/* harmony export */   "setupDevtoolsPlugin": () => (/* binding */ setupDevtoolsPlugin)
/* harmony export */ });
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./env */ "./node_modules/@vue/devtools-api/lib/esm/env.js");
/* harmony import */ var _const__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./const */ "./node_modules/@vue/devtools-api/lib/esm/const.js");
/* harmony import */ var _proxy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./proxy */ "./node_modules/@vue/devtools-api/lib/esm/proxy.js");
/* harmony import */ var _time__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./time */ "./node_modules/@vue/devtools-api/lib/esm/time.js");






function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    const descriptor = pluginDescriptor;
    const target = (0,_env__WEBPACK_IMPORTED_MODULE_1__.getTarget)();
    const hook = (0,_env__WEBPACK_IMPORTED_MODULE_1__.getDevtoolsGlobalHook)();
    const enableProxy = _env__WEBPACK_IMPORTED_MODULE_1__.isProxyAvailable && descriptor.enableEarlyProxy;
    if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
        hook.emit(_const__WEBPACK_IMPORTED_MODULE_2__.HOOK_SETUP, pluginDescriptor, setupFn);
    }
    else {
        const proxy = enableProxy ? new _proxy__WEBPACK_IMPORTED_MODULE_3__.ApiProxy(descriptor, hook) : null;
        const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
        list.push({
            pluginDescriptor: descriptor,
            setupFn,
            proxy,
        });
        if (proxy)
            setupFn(proxy.proxiedTarget);
    }
}


/***/ }),

/***/ "./node_modules/@vue/devtools-api/lib/esm/proxy.js":
/*!*********************************************************!*\
  !*** ./node_modules/@vue/devtools-api/lib/esm/proxy.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApiProxy": () => (/* binding */ ApiProxy)
/* harmony export */ });
/* harmony import */ var _const__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./const */ "./node_modules/@vue/devtools-api/lib/esm/const.js");
/* harmony import */ var _time__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./time */ "./node_modules/@vue/devtools-api/lib/esm/time.js");


class ApiProxy {
    constructor(plugin, hook) {
        this.target = null;
        this.targetQueue = [];
        this.onQueue = [];
        this.plugin = plugin;
        this.hook = hook;
        const defaultSettings = {};
        if (plugin.settings) {
            for (const id in plugin.settings) {
                const item = plugin.settings[id];
                defaultSettings[id] = item.defaultValue;
            }
        }
        const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
        let currentSettings = Object.assign({}, defaultSettings);
        try {
            const raw = localStorage.getItem(localSettingsSaveId);
            const data = JSON.parse(raw);
            Object.assign(currentSettings, data);
        }
        catch (e) {
            // noop
        }
        this.fallbacks = {
            getSettings() {
                return currentSettings;
            },
            setSettings(value) {
                try {
                    localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
                }
                catch (e) {
                    // noop
                }
                currentSettings = value;
            },
            now() {
                return (0,_time__WEBPACK_IMPORTED_MODULE_0__.now)();
            },
        };
        if (hook) {
            hook.on(_const__WEBPACK_IMPORTED_MODULE_1__.HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
                if (pluginId === this.plugin.id) {
                    this.fallbacks.setSettings(value);
                }
            });
        }
        this.proxiedOn = new Proxy({}, {
            get: (_target, prop) => {
                if (this.target) {
                    return this.target.on[prop];
                }
                else {
                    return (...args) => {
                        this.onQueue.push({
                            method: prop,
                            args,
                        });
                    };
                }
            },
        });
        this.proxiedTarget = new Proxy({}, {
            get: (_target, prop) => {
                if (this.target) {
                    return this.target[prop];
                }
                else if (prop === 'on') {
                    return this.proxiedOn;
                }
                else if (Object.keys(this.fallbacks).includes(prop)) {
                    return (...args) => {
                        this.targetQueue.push({
                            method: prop,
                            args,
                            resolve: () => { },
                        });
                        return this.fallbacks[prop](...args);
                    };
                }
                else {
                    return (...args) => {
                        return new Promise(resolve => {
                            this.targetQueue.push({
                                method: prop,
                                args,
                                resolve,
                            });
                        });
                    };
                }
            },
        });
    }
    async setRealTarget(target) {
        this.target = target;
        for (const item of this.onQueue) {
            this.target.on[item.method](...item.args);
        }
        for (const item of this.targetQueue) {
            item.resolve(await this.target[item.method](...item.args));
        }
    }
}


/***/ }),

/***/ "./node_modules/@vue/devtools-api/lib/esm/time.js":
/*!********************************************************!*\
  !*** ./node_modules/@vue/devtools-api/lib/esm/time.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isPerformanceSupported": () => (/* binding */ isPerformanceSupported),
/* harmony export */   "now": () => (/* binding */ now)
/* harmony export */ });
let supported;
let perf;
function isPerformanceSupported() {
    var _a;
    if (supported !== undefined) {
        return supported;
    }
    if (typeof window !== 'undefined' && window.performance) {
        supported = true;
        perf = window.performance;
    }
    else if (typeof global !== 'undefined' && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
        supported = true;
        perf = global.perf_hooks.performance;
    }
    else {
        supported = false;
    }
    return supported;
}
function now() {
    return isPerformanceSupported() ? perf.now() : Date.now();
}


/***/ }),

/***/ "./resources/js/ssr.js":
/*!*****************************!*\
  !*** ./resources/js/ssr.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _vue_server_renderer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vue/server-renderer */ "@vue/server-renderer");
/* harmony import */ var _vue_server_renderer__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_vue_server_renderer__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _inertiajs_inertia_vue3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @inertiajs/inertia-vue3 */ "@inertiajs/inertia-vue3");
/* harmony import */ var _inertiajs_inertia_vue3__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_inertiajs_inertia_vue3__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _inertiajs_server__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @inertiajs/server */ "@inertiajs/server");
/* harmony import */ var _inertiajs_server__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_inertiajs_server__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ziggy__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ziggy */ "./vendor/tightenco/ziggy/dist/vue.js");
/* harmony import */ var ziggy__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ziggy__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var svg_vue3__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! svg-vue3 */ "svg-vue3");
/* harmony import */ var svg_vue3__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(svg_vue3__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var vee_validate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vee-validate */ "./node_modules/vee-validate/dist/vee-validate.esm.js");







_inertiajs_server__WEBPACK_IMPORTED_MODULE_3___default()(function (page) {
  return (0,_inertiajs_inertia_vue3__WEBPACK_IMPORTED_MODULE_2__.createInertiaApp)({
    page: page,
    render: _vue_server_renderer__WEBPACK_IMPORTED_MODULE_1__.renderToString,
    resolve: function resolve(name) {
      return __webpack_require__("./resources/js/Pages lazy recursive ^\\.\\/.*$")("./".concat(name));
    },
    title: function title(_title) {
      return _title || "Vue Inertia";
    },
    setup: function setup(_ref) {
      var app = _ref.app,
          props = _ref.props,
          plugin = _ref.plugin;
      return (0,vue__WEBPACK_IMPORTED_MODULE_0__.createSSRApp)({
        render: function render() {
          return (0,vue__WEBPACK_IMPORTED_MODULE_0__.h)(app, props);
        }
      }).use(plugin).use(ziggy__WEBPACK_IMPORTED_MODULE_4__.ZiggyVue, ziggy__WEBPACK_IMPORTED_MODULE_4__.Ziggy).use((svg_vue3__WEBPACK_IMPORTED_MODULE_5___default())).use(vee_validate__WEBPACK_IMPORTED_MODULE_6__.defineRule).mount(el);
    }
  });
});

/***/ }),

/***/ "./vendor/tightenco/ziggy/dist/vue.js":
/*!********************************************!*\
  !*** ./vendor/tightenco/ziggy/dist/vue.js ***!
  \********************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

!function (t, r) {
  "object" == ( false ? 0 : _typeof(exports)) && "undefined" != "object" ? r(exports) :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (r),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : 0;
}(this, function (t) {
  function r(t, r) {
    for (var n = 0; n < r.length; n++) {
      var e = r[n];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(t, e.key, e);
    }
  }

  function n(t, n, e) {
    return n && r(t.prototype, n), e && r(t, e), Object.defineProperty(t, "prototype", {
      writable: !1
    }), t;
  }

  function e() {
    return e = Object.assign || function (t) {
      for (var r = 1; r < arguments.length; r++) {
        var n = arguments[r];

        for (var e in n) {
          Object.prototype.hasOwnProperty.call(n, e) && (t[e] = n[e]);
        }
      }

      return t;
    }, e.apply(this, arguments);
  }

  function o(t) {
    return o = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
      return t.__proto__ || Object.getPrototypeOf(t);
    }, o(t);
  }

  function i(t, r) {
    return i = Object.setPrototypeOf || function (t, r) {
      return t.__proto__ = r, t;
    }, i(t, r);
  }

  function u() {
    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
    if (Reflect.construct.sham) return !1;
    if ("function" == typeof Proxy) return !0;

    try {
      return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})), !0;
    } catch (t) {
      return !1;
    }
  }

  function f(t, r, n) {
    return f = u() ? Reflect.construct : function (t, r, n) {
      var e = [null];
      e.push.apply(e, r);
      var o = new (Function.bind.apply(t, e))();
      return n && i(o, n.prototype), o;
    }, f.apply(null, arguments);
  }

  function a(t) {
    var r = "function" == typeof Map ? new Map() : void 0;
    return a = function a(t) {
      if (null === t || -1 === Function.toString.call(t).indexOf("[native code]")) return t;
      if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");

      if (void 0 !== r) {
        if (r.has(t)) return r.get(t);
        r.set(t, n);
      }

      function n() {
        return f(t, arguments, o(this).constructor);
      }

      return n.prototype = Object.create(t.prototype, {
        constructor: {
          value: n,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }), i(n, t);
    }, a(t);
  }

  var c = String.prototype.replace,
      l = /%20/g,
      s = "RFC3986",
      p = {
    "default": s,
    formatters: {
      RFC1738: function RFC1738(t) {
        return c.call(t, l, "+");
      },
      RFC3986: function RFC3986(t) {
        return String(t);
      }
    },
    RFC1738: "RFC1738",
    RFC3986: s
  },
      v = Object.prototype.hasOwnProperty,
      y = Array.isArray,
      d = function () {
    for (var t = [], r = 0; r < 256; ++r) {
      t.push("%" + ((r < 16 ? "0" : "") + r.toString(16)).toUpperCase());
    }

    return t;
  }(),
      b = function b(t, r) {
    for (var n = r && r.plainObjects ? Object.create(null) : {}, e = 0; e < t.length; ++e) {
      void 0 !== t[e] && (n[e] = t[e]);
    }

    return n;
  },
      h = {
    arrayToObject: b,
    assign: function assign(t, r) {
      return Object.keys(r).reduce(function (t, n) {
        return t[n] = r[n], t;
      }, t);
    },
    combine: function combine(t, r) {
      return [].concat(t, r);
    },
    compact: function compact(t) {
      for (var r = [{
        obj: {
          o: t
        },
        prop: "o"
      }], n = [], e = 0; e < r.length; ++e) {
        for (var o = r[e], i = o.obj[o.prop], u = Object.keys(i), f = 0; f < u.length; ++f) {
          var a = u[f],
              c = i[a];
          "object" == _typeof(c) && null !== c && -1 === n.indexOf(c) && (r.push({
            obj: i,
            prop: a
          }), n.push(c));
        }
      }

      return function (t) {
        for (; t.length > 1;) {
          var r = t.pop(),
              n = r.obj[r.prop];

          if (y(n)) {
            for (var e = [], o = 0; o < n.length; ++o) {
              void 0 !== n[o] && e.push(n[o]);
            }

            r.obj[r.prop] = e;
          }
        }
      }(r), t;
    },
    decode: function decode(t, r, n) {
      var e = t.replace(/\+/g, " ");
      if ("iso-8859-1" === n) return e.replace(/%[0-9a-f]{2}/gi, unescape);

      try {
        return decodeURIComponent(e);
      } catch (t) {
        return e;
      }
    },
    encode: function encode(t, r, n, e, o) {
      if (0 === t.length) return t;
      var i = t;
      if ("symbol" == _typeof(t) ? i = Symbol.prototype.toString.call(t) : "string" != typeof t && (i = String(t)), "iso-8859-1" === n) return escape(i).replace(/%u[0-9a-f]{4}/gi, function (t) {
        return "%26%23" + parseInt(t.slice(2), 16) + "%3B";
      });

      for (var u = "", f = 0; f < i.length; ++f) {
        var a = i.charCodeAt(f);
        45 === a || 46 === a || 95 === a || 126 === a || a >= 48 && a <= 57 || a >= 65 && a <= 90 || a >= 97 && a <= 122 || o === p.RFC1738 && (40 === a || 41 === a) ? u += i.charAt(f) : a < 128 ? u += d[a] : a < 2048 ? u += d[192 | a >> 6] + d[128 | 63 & a] : a < 55296 || a >= 57344 ? u += d[224 | a >> 12] + d[128 | a >> 6 & 63] + d[128 | 63 & a] : (a = 65536 + ((1023 & a) << 10 | 1023 & i.charCodeAt(f += 1)), u += d[240 | a >> 18] + d[128 | a >> 12 & 63] + d[128 | a >> 6 & 63] + d[128 | 63 & a]);
      }

      return u;
    },
    isBuffer: function isBuffer(t) {
      return !(!t || "object" != _typeof(t) || !(t.constructor && t.constructor.isBuffer && t.constructor.isBuffer(t)));
    },
    isRegExp: function isRegExp(t) {
      return "[object RegExp]" === Object.prototype.toString.call(t);
    },
    maybeMap: function maybeMap(t, r) {
      if (y(t)) {
        for (var n = [], e = 0; e < t.length; e += 1) {
          n.push(r(t[e]));
        }

        return n;
      }

      return r(t);
    },
    merge: function t(r, n, e) {
      if (!n) return r;

      if ("object" != _typeof(n)) {
        if (y(r)) r.push(n);else {
          if (!r || "object" != _typeof(r)) return [r, n];
          (e && (e.plainObjects || e.allowPrototypes) || !v.call(Object.prototype, n)) && (r[n] = !0);
        }
        return r;
      }

      if (!r || "object" != _typeof(r)) return [r].concat(n);
      var o = r;
      return y(r) && !y(n) && (o = b(r, e)), y(r) && y(n) ? (n.forEach(function (n, o) {
        if (v.call(r, o)) {
          var i = r[o];
          i && "object" == _typeof(i) && n && "object" == _typeof(n) ? r[o] = t(i, n, e) : r.push(n);
        } else r[o] = n;
      }), r) : Object.keys(n).reduce(function (r, o) {
        var i = n[o];
        return r[o] = v.call(r, o) ? t(r[o], i, e) : i, r;
      }, o);
    }
  },
      m = Object.prototype.hasOwnProperty,
      g = {
    brackets: function brackets(t) {
      return t + "[]";
    },
    comma: "comma",
    indices: function indices(t, r) {
      return t + "[" + r + "]";
    },
    repeat: function repeat(t) {
      return t;
    }
  },
      j = Array.isArray,
      w = String.prototype.split,
      O = Array.prototype.push,
      E = function E(t, r) {
    O.apply(t, j(r) ? r : [r]);
  },
      R = Date.prototype.toISOString,
      S = p["default"],
      x = {
    addQueryPrefix: !1,
    allowDots: !1,
    charset: "utf-8",
    charsetSentinel: !1,
    delimiter: "&",
    encode: !0,
    encoder: h.encode,
    encodeValuesOnly: !1,
    format: S,
    formatter: p.formatters[S],
    indices: !1,
    serializeDate: function serializeDate(t) {
      return R.call(t);
    },
    skipNulls: !1,
    strictNullHandling: !1
  },
      T = function t(r, n, e, o, i, u, f, a, c, l, s, p, v, y) {
    var d,
        b = r;

    if ("function" == typeof f ? b = f(n, b) : b instanceof Date ? b = l(b) : "comma" === e && j(b) && (b = h.maybeMap(b, function (t) {
      return t instanceof Date ? l(t) : t;
    })), null === b) {
      if (o) return u && !v ? u(n, x.encoder, y, "key", s) : n;
      b = "";
    }

    if ("string" == typeof (d = b) || "number" == typeof d || "boolean" == typeof d || "symbol" == _typeof(d) || "bigint" == typeof d || h.isBuffer(b)) {
      if (u) {
        var m = v ? n : u(n, x.encoder, y, "key", s);

        if ("comma" === e && v) {
          for (var g = w.call(String(b), ","), O = "", R = 0; R < g.length; ++R) {
            O += (0 === R ? "" : ",") + p(u(g[R], x.encoder, y, "value", s));
          }

          return [p(m) + "=" + O];
        }

        return [p(m) + "=" + p(u(b, x.encoder, y, "value", s))];
      }

      return [p(n) + "=" + p(String(b))];
    }

    var S,
        T = [];
    if (void 0 === b) return T;
    if ("comma" === e && j(b)) S = [{
      value: b.length > 0 ? b.join(",") || null : void 0
    }];else if (j(f)) S = f;else {
      var k = Object.keys(b);
      S = a ? k.sort(a) : k;
    }

    for (var N = 0; N < S.length; ++N) {
      var C = S[N],
          D = "object" == _typeof(C) && void 0 !== C.value ? C.value : b[C];

      if (!i || null !== D) {
        var F = j(b) ? "function" == typeof e ? e(n, C) : n : n + (c ? "." + C : "[" + C + "]");
        E(T, t(D, F, e, o, i, u, f, a, c, l, s, p, v, y));
      }
    }

    return T;
  },
      k = Object.prototype.hasOwnProperty,
      N = Array.isArray,
      C = {
    allowDots: !1,
    allowPrototypes: !1,
    arrayLimit: 20,
    charset: "utf-8",
    charsetSentinel: !1,
    comma: !1,
    decoder: h.decode,
    delimiter: "&",
    depth: 5,
    ignoreQueryPrefix: !1,
    interpretNumericEntities: !1,
    parameterLimit: 1e3,
    parseArrays: !0,
    plainObjects: !1,
    strictNullHandling: !1
  },
      D = function D(t) {
    return t.replace(/&#(\d+);/g, function (t, r) {
      return String.fromCharCode(parseInt(r, 10));
    });
  },
      F = function F(t, r) {
    return t && "string" == typeof t && r.comma && t.indexOf(",") > -1 ? t.split(",") : t;
  },
      $ = function $(t, r, n, e) {
    if (t) {
      var o = n.allowDots ? t.replace(/\.([^.[]+)/g, "[$1]") : t,
          i = /(\[[^[\]]*])/g,
          u = n.depth > 0 && /(\[[^[\]]*])/.exec(o),
          f = u ? o.slice(0, u.index) : o,
          a = [];

      if (f) {
        if (!n.plainObjects && k.call(Object.prototype, f) && !n.allowPrototypes) return;
        a.push(f);
      }

      for (var c = 0; n.depth > 0 && null !== (u = i.exec(o)) && c < n.depth;) {
        if (c += 1, !n.plainObjects && k.call(Object.prototype, u[1].slice(1, -1)) && !n.allowPrototypes) return;
        a.push(u[1]);
      }

      return u && a.push("[" + o.slice(u.index) + "]"), function (t, r, n, e) {
        for (var o = e ? r : F(r, n), i = t.length - 1; i >= 0; --i) {
          var u,
              f = t[i];
          if ("[]" === f && n.parseArrays) u = [].concat(o);else {
            u = n.plainObjects ? Object.create(null) : {};
            var a = "[" === f.charAt(0) && "]" === f.charAt(f.length - 1) ? f.slice(1, -1) : f,
                c = parseInt(a, 10);
            n.parseArrays || "" !== a ? !isNaN(c) && f !== a && String(c) === a && c >= 0 && n.parseArrays && c <= n.arrayLimit ? (u = [])[c] = o : "__proto__" !== a && (u[a] = o) : u = {
              0: o
            };
          }
          o = u;
        }

        return o;
      }(a, r, n, e);
    }
  },
      A = function A(t, r) {
    var n = function (t) {
      if (!t) return C;
      if (null != t.decoder && "function" != typeof t.decoder) throw new TypeError("Decoder has to be a function.");
      if (void 0 !== t.charset && "utf-8" !== t.charset && "iso-8859-1" !== t.charset) throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      return {
        allowDots: void 0 === t.allowDots ? C.allowDots : !!t.allowDots,
        allowPrototypes: "boolean" == typeof t.allowPrototypes ? t.allowPrototypes : C.allowPrototypes,
        arrayLimit: "number" == typeof t.arrayLimit ? t.arrayLimit : C.arrayLimit,
        charset: void 0 === t.charset ? C.charset : t.charset,
        charsetSentinel: "boolean" == typeof t.charsetSentinel ? t.charsetSentinel : C.charsetSentinel,
        comma: "boolean" == typeof t.comma ? t.comma : C.comma,
        decoder: "function" == typeof t.decoder ? t.decoder : C.decoder,
        delimiter: "string" == typeof t.delimiter || h.isRegExp(t.delimiter) ? t.delimiter : C.delimiter,
        depth: "number" == typeof t.depth || !1 === t.depth ? +t.depth : C.depth,
        ignoreQueryPrefix: !0 === t.ignoreQueryPrefix,
        interpretNumericEntities: "boolean" == typeof t.interpretNumericEntities ? t.interpretNumericEntities : C.interpretNumericEntities,
        parameterLimit: "number" == typeof t.parameterLimit ? t.parameterLimit : C.parameterLimit,
        parseArrays: !1 !== t.parseArrays,
        plainObjects: "boolean" == typeof t.plainObjects ? t.plainObjects : C.plainObjects,
        strictNullHandling: "boolean" == typeof t.strictNullHandling ? t.strictNullHandling : C.strictNullHandling
      };
    }(r);

    if ("" === t || null == t) return n.plainObjects ? Object.create(null) : {};

    for (var e = "string" == typeof t ? function (t, r) {
      var n,
          e = {},
          o = (r.ignoreQueryPrefix ? t.replace(/^\?/, "") : t).split(r.delimiter, Infinity === r.parameterLimit ? void 0 : r.parameterLimit),
          i = -1,
          u = r.charset;
      if (r.charsetSentinel) for (n = 0; n < o.length; ++n) {
        0 === o[n].indexOf("utf8=") && ("utf8=%E2%9C%93" === o[n] ? u = "utf-8" : "utf8=%26%2310003%3B" === o[n] && (u = "iso-8859-1"), i = n, n = o.length);
      }

      for (n = 0; n < o.length; ++n) {
        if (n !== i) {
          var f,
              a,
              c = o[n],
              l = c.indexOf("]="),
              s = -1 === l ? c.indexOf("=") : l + 1;
          -1 === s ? (f = r.decoder(c, C.decoder, u, "key"), a = r.strictNullHandling ? null : "") : (f = r.decoder(c.slice(0, s), C.decoder, u, "key"), a = h.maybeMap(F(c.slice(s + 1), r), function (t) {
            return r.decoder(t, C.decoder, u, "value");
          })), a && r.interpretNumericEntities && "iso-8859-1" === u && (a = D(a)), c.indexOf("[]=") > -1 && (a = N(a) ? [a] : a), e[f] = k.call(e, f) ? h.combine(e[f], a) : a;
        }
      }

      return e;
    }(t, n) : t, o = n.plainObjects ? Object.create(null) : {}, i = Object.keys(e), u = 0; u < i.length; ++u) {
      var f = i[u],
          a = $(f, e[f], n, "string" == typeof t);
      o = h.merge(o, a, n);
    }

    return h.compact(o);
  },
      I = /*#__PURE__*/function () {
    function t(t, r, n) {
      var e, o;
      this.name = t, this.definition = r, this.bindings = null != (e = r.bindings) ? e : {}, this.wheres = null != (o = r.wheres) ? o : {}, this.config = n;
    }

    var r = t.prototype;
    return r.matchesUrl = function (t) {
      var r = this;
      if (!this.definition.methods.includes("GET")) return !1;
      var n = this.template.replace(/(\/?){([^}?]*)(\??)}/g, function (t, n, e, o) {
        var i,
            u = "(?<" + e + ">" + ((null == (i = r.wheres[e]) ? void 0 : i.replace(/(^\^)|(\$$)/g, "")) || "[^/?]+") + ")";
        return o ? "(" + n + u + ")?" : "" + n + u;
      }).replace(/^\w+:\/\//, ""),
          e = t.replace(/^\w+:\/\//, "").split("?"),
          o = e[0],
          i = e[1],
          u = new RegExp("^" + n + "/?$").exec(o);
      return !!u && {
        params: u.groups,
        query: A(i)
      };
    }, r.compile = function (t) {
      var r = this,
          n = this.parameterSegments;
      return n.length ? this.template.replace(/{([^}?]+)(\??)}/g, function (e, o, i) {
        var u, f, a;
        if (!i && [null, void 0].includes(t[o])) throw new Error("Ziggy error: '" + o + "' parameter is required for route '" + r.name + "'.");
        if (n[n.length - 1].name === o && ".*" === r.wheres[o]) return encodeURIComponent(null != (a = t[o]) ? a : "").replace(/%2F/g, "/");
        if (r.wheres[o] && !new RegExp("^" + (i ? "(" + r.wheres[o] + ")?" : r.wheres[o]) + "$").test(null != (u = t[o]) ? u : "")) throw new Error("Ziggy error: '" + o + "' parameter does not match required format '" + r.wheres[o] + "' for route '" + r.name + "'.");
        return encodeURIComponent(null != (f = t[o]) ? f : "");
      }).replace(/\/+$/, "") : this.template;
    }, n(t, [{
      key: "template",
      get: function get() {
        return ((this.config.absolute ? this.definition.domain ? "" + this.config.url.match(/^\w+:\/\//)[0] + this.definition.domain + (this.config.port ? ":" + this.config.port : "") : this.config.url : "") + "/" + this.definition.uri).replace(/\/+$/, "");
      }
    }, {
      key: "parameterSegments",
      get: function get() {
        var t, r;
        return null != (t = null == (r = this.template.match(/{[^}?]+\??}/g)) ? void 0 : r.map(function (t) {
          return {
            name: t.replace(/{|\??}/g, ""),
            required: !/\?}$/.test(t)
          };
        })) ? t : [];
      }
    }]), t;
  }(),
      P = /*#__PURE__*/function (t) {
    var r, o;

    function u(r, n, o, i) {
      var u;

      if (void 0 === o && (o = !0), (u = t.call(this) || this).t = null != i ? i : "undefined" != typeof Ziggy ? Ziggy : null == globalThis ? void 0 : globalThis.Ziggy, u.t = e({}, u.t, {
        absolute: o
      }), r) {
        if (!u.t.routes[r]) throw new Error("Ziggy error: route '" + r + "' is not in the route list.");
        u.i = new I(r, u.t.routes[r], u.t), u.u = u.l(n);
      }

      return u;
    }

    o = t, (r = u).prototype = Object.create(o.prototype), r.prototype.constructor = r, i(r, o);
    var f = u.prototype;
    return f.toString = function () {
      var t = this,
          r = Object.keys(this.u).filter(function (r) {
        return !t.i.parameterSegments.some(function (t) {
          return t.name === r;
        });
      }).filter(function (t) {
        return "_query" !== t;
      }).reduce(function (r, n) {
        var o;
        return e({}, r, ((o = {})[n] = t.u[n], o));
      }, {});
      return this.i.compile(this.u) + function (t, r) {
        var n,
            e = t,
            o = function (t) {
          if (!t) return x;
          if (null != t.encoder && "function" != typeof t.encoder) throw new TypeError("Encoder has to be a function.");
          var r = t.charset || x.charset;
          if (void 0 !== t.charset && "utf-8" !== t.charset && "iso-8859-1" !== t.charset) throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
          var n = p["default"];

          if (void 0 !== t.format) {
            if (!m.call(p.formatters, t.format)) throw new TypeError("Unknown format option provided.");
            n = t.format;
          }

          var e = p.formatters[n],
              o = x.filter;
          return ("function" == typeof t.filter || j(t.filter)) && (o = t.filter), {
            addQueryPrefix: "boolean" == typeof t.addQueryPrefix ? t.addQueryPrefix : x.addQueryPrefix,
            allowDots: void 0 === t.allowDots ? x.allowDots : !!t.allowDots,
            charset: r,
            charsetSentinel: "boolean" == typeof t.charsetSentinel ? t.charsetSentinel : x.charsetSentinel,
            delimiter: void 0 === t.delimiter ? x.delimiter : t.delimiter,
            encode: "boolean" == typeof t.encode ? t.encode : x.encode,
            encoder: "function" == typeof t.encoder ? t.encoder : x.encoder,
            encodeValuesOnly: "boolean" == typeof t.encodeValuesOnly ? t.encodeValuesOnly : x.encodeValuesOnly,
            filter: o,
            format: n,
            formatter: e,
            serializeDate: "function" == typeof t.serializeDate ? t.serializeDate : x.serializeDate,
            skipNulls: "boolean" == typeof t.skipNulls ? t.skipNulls : x.skipNulls,
            sort: "function" == typeof t.sort ? t.sort : null,
            strictNullHandling: "boolean" == typeof t.strictNullHandling ? t.strictNullHandling : x.strictNullHandling
          };
        }(r);

        "function" == typeof o.filter ? e = (0, o.filter)("", e) : j(o.filter) && (n = o.filter);
        var i = [];
        if ("object" != _typeof(e) || null === e) return "";
        var u = g[r && r.arrayFormat in g ? r.arrayFormat : r && "indices" in r ? r.indices ? "indices" : "repeat" : "indices"];
        n || (n = Object.keys(e)), o.sort && n.sort(o.sort);

        for (var f = 0; f < n.length; ++f) {
          var a = n[f];
          o.skipNulls && null === e[a] || E(i, T(e[a], a, u, o.strictNullHandling, o.skipNulls, o.encode ? o.encoder : null, o.filter, o.sort, o.allowDots, o.serializeDate, o.format, o.formatter, o.encodeValuesOnly, o.charset));
        }

        var c = i.join(o.delimiter),
            l = !0 === o.addQueryPrefix ? "?" : "";
        return o.charsetSentinel && (l += "iso-8859-1" === o.charset ? "utf8=%26%2310003%3B&" : "utf8=%E2%9C%93&"), c.length > 0 ? l + c : "";
      }(e({}, r, this.u._query), {
        addQueryPrefix: !0,
        arrayFormat: "indices",
        encodeValuesOnly: !0,
        skipNulls: !0,
        encoder: function encoder(t, r) {
          return "boolean" == typeof t ? Number(t) : r(t);
        }
      });
    }, f.p = function (t) {
      var r = this;
      t ? this.t.absolute && t.startsWith("/") && (t = this.v().host + t) : t = this.h();
      var n = {},
          o = Object.entries(this.t.routes).find(function (e) {
        return n = new I(e[0], e[1], r.t).matchesUrl(t);
      }) || [void 0, void 0];
      return e({
        name: o[0]
      }, n, {
        route: o[1]
      });
    }, f.h = function () {
      var t = this.v(),
          r = t.pathname,
          n = t.search;
      return (this.t.absolute ? t.host + r : r.replace(this.t.url.replace(/^\w*:\/\/[^/]+/, ""), "").replace(/^\/+/, "/")) + n;
    }, f.current = function (t, r) {
      var n = this.p(),
          o = n.name,
          i = n.params,
          u = n.query,
          f = n.route;
      if (!t) return o;
      var a = new RegExp("^" + t.replace(/\./g, "\\.").replace(/\*/g, ".*") + "$").test(o);
      if ([null, void 0].includes(r) || !a) return a;
      var c = new I(o, f, this.t);
      r = this.l(r, c);
      var l = e({}, i, u);
      return !(!Object.values(r).every(function (t) {
        return !t;
      }) || Object.values(l).some(function (t) {
        return void 0 !== t;
      })) || Object.entries(r).every(function (t) {
        return l[t[0]] == t[1];
      });
    }, f.v = function () {
      var t,
          r,
          n,
          e,
          o,
          i,
          u = "undefined" != typeof window ? window.location : {},
          f = u.host,
          a = u.pathname,
          c = u.search;
      return {
        host: null != (t = null == (r = this.t.location) ? void 0 : r.host) ? t : void 0 === f ? "" : f,
        pathname: null != (n = null == (e = this.t.location) ? void 0 : e.pathname) ? n : void 0 === a ? "" : a,
        search: null != (o = null == (i = this.t.location) ? void 0 : i.search) ? o : void 0 === c ? "" : c
      };
    }, f.has = function (t) {
      return Object.keys(this.t.routes).includes(t);
    }, f.l = function (t, r) {
      var n = this;
      void 0 === t && (t = {}), void 0 === r && (r = this.i), t = ["string", "number"].includes(_typeof(t)) ? [t] : t;
      var o = r.parameterSegments.filter(function (t) {
        return !n.t.defaults[t.name];
      });
      if (Array.isArray(t)) t = t.reduce(function (t, r, n) {
        var i, u;
        return e({}, t, o[n] ? ((i = {})[o[n].name] = r, i) : "object" == _typeof(r) ? r : ((u = {})[r] = "", u));
      }, {});else if (1 === o.length && !t[o[0].name] && (t.hasOwnProperty(Object.values(r.bindings)[0]) || t.hasOwnProperty("id"))) {
        var i;
        (i = {})[o[0].name] = t, t = i;
      }
      return e({}, this.m(r), this.g(t, r));
    }, f.m = function (t) {
      var r = this;
      return t.parameterSegments.filter(function (t) {
        return r.t.defaults[t.name];
      }).reduce(function (t, n, o) {
        var i,
            u = n.name;
        return e({}, t, ((i = {})[u] = r.t.defaults[u], i));
      }, {});
    }, f.g = function (t, r) {
      var n = r.bindings,
          o = r.parameterSegments;
      return Object.entries(t).reduce(function (t, r) {
        var i,
            u,
            f = r[0],
            a = r[1];
        if (!a || "object" != _typeof(a) || Array.isArray(a) || !o.some(function (t) {
          return t.name === f;
        })) return e({}, t, ((u = {})[f] = a, u));

        if (!a.hasOwnProperty(n[f])) {
          if (!a.hasOwnProperty("id")) throw new Error("Ziggy error: object passed as '" + f + "' parameter is missing route model binding key '" + n[f] + "'.");
          n[f] = "id";
        }

        return e({}, t, ((i = {})[f] = a[n[f]], i));
      }, {});
    }, f.valueOf = function () {
      return this.toString();
    }, f.check = function (t) {
      return this.has(t);
    }, n(u, [{
      key: "params",
      get: function get() {
        var t = this.p();
        return e({}, t.params, t.query);
      }
    }]), u;
  }( /*#__PURE__*/a(String));

  t.ZiggyVue = {
    install: function install(t, r) {
      var n = function n(t, _n, e, o) {
        return void 0 === o && (o = r), function (t, r, n, e) {
          var o = new P(t, r, n, e);
          return t ? o.toString() : o;
        }(t, _n, e, o);
      };

      t.mixin({
        methods: {
          route: n
        }
      }), parseInt(t.version) > 2 && t.provide("route", n);
    }
  };
});

/***/ }),

/***/ "./resources/sass/app.scss":
/*!*********************************!*\
  !*** ./resources/sass/app.scss ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/vee-validate/dist/vee-validate.esm.js":
/*!************************************************************!*\
  !*** ./node_modules/vee-validate/dist/vee-validate.esm.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ErrorMessage": () => (/* binding */ ErrorMessage),
/* harmony export */   "Field": () => (/* binding */ Field),
/* harmony export */   "FieldArray": () => (/* binding */ FieldArray),
/* harmony export */   "FieldContextKey": () => (/* binding */ FieldContextKey),
/* harmony export */   "Form": () => (/* binding */ Form),
/* harmony export */   "FormContextKey": () => (/* binding */ FormContextKey),
/* harmony export */   "configure": () => (/* binding */ configure),
/* harmony export */   "defineRule": () => (/* binding */ defineRule),
/* harmony export */   "useField": () => (/* binding */ useField),
/* harmony export */   "useFieldArray": () => (/* binding */ useFieldArray),
/* harmony export */   "useFieldError": () => (/* binding */ useFieldError),
/* harmony export */   "useFieldValue": () => (/* binding */ useFieldValue),
/* harmony export */   "useForm": () => (/* binding */ useForm),
/* harmony export */   "useFormErrors": () => (/* binding */ useFormErrors),
/* harmony export */   "useFormValues": () => (/* binding */ useFormValues),
/* harmony export */   "useIsFieldDirty": () => (/* binding */ useIsFieldDirty),
/* harmony export */   "useIsFieldTouched": () => (/* binding */ useIsFieldTouched),
/* harmony export */   "useIsFieldValid": () => (/* binding */ useIsFieldValid),
/* harmony export */   "useIsFormDirty": () => (/* binding */ useIsFormDirty),
/* harmony export */   "useIsFormTouched": () => (/* binding */ useIsFormTouched),
/* harmony export */   "useIsFormValid": () => (/* binding */ useIsFormValid),
/* harmony export */   "useIsSubmitting": () => (/* binding */ useIsSubmitting),
/* harmony export */   "useResetForm": () => (/* binding */ useResetForm),
/* harmony export */   "useSubmitCount": () => (/* binding */ useSubmitCount),
/* harmony export */   "useSubmitForm": () => (/* binding */ useSubmitForm),
/* harmony export */   "useValidateField": () => (/* binding */ useValidateField),
/* harmony export */   "useValidateForm": () => (/* binding */ useValidateForm),
/* harmony export */   "validate": () => (/* binding */ validate)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _vue_devtools_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vue/devtools-api */ "./node_modules/@vue/devtools-api/lib/esm/index.js");
/**
  * vee-validate v4.5.11
  * (c) 2022 Abdelrahman Awad
  * @license MIT
  */



function isCallable(fn) {
    return typeof fn === 'function';
}
function isNullOrUndefined(value) {
    return value === null || value === undefined;
}
const isObject = (obj) => obj !== null && !!obj && typeof obj === 'object' && !Array.isArray(obj);
function isIndex(value) {
    return Number(value) >= 0;
}
function toNumber(value) {
    const n = parseFloat(value);
    return isNaN(n) ? value : n;
}

const RULES = {};
/**
 * Adds a custom validator to the list of validation rules.
 */
function defineRule(id, validator) {
    // makes sure new rules are properly formatted.
    guardExtend(id, validator);
    RULES[id] = validator;
}
/**
 * Gets an already defined rule
 */
function resolveRule(id) {
    return RULES[id];
}
/**
 * Guards from extension violations.
 */
function guardExtend(id, validator) {
    if (isCallable(validator)) {
        return;
    }
    throw new Error(`Extension Error: The validator '${id}' must be a function.`);
}

const FormContextKey = Symbol('vee-validate-form');
const FieldContextKey = Symbol('vee-validate-field-instance');
const IS_ABSENT = Symbol('Default empty value');

function isLocator(value) {
    return isCallable(value) && !!value.__locatorRef;
}
/**
 * Checks if an tag name is a native HTML tag and not a Vue component
 */
function isHTMLTag(tag) {
    return ['input', 'textarea', 'select'].includes(tag);
}
/**
 * Checks if an input is of type file
 */
function isFileInputNode(tag, attrs) {
    return isHTMLTag(tag) && attrs.type === 'file';
}
function isYupValidator(value) {
    return !!value && isCallable(value.validate);
}
function hasCheckedAttr(type) {
    return type === 'checkbox' || type === 'radio';
}
function isContainerValue(value) {
    return isObject(value) || Array.isArray(value);
}
/**
 * True if the value is an empty object or array
 */
function isEmptyContainer(value) {
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    return isObject(value) && Object.keys(value).length === 0;
}
/**
 * Checks if the path opted out of nested fields using `[fieldName]` syntax
 */
function isNotNestedPath(path) {
    return /^\[.+\]$/i.test(path);
}
/**
 * Checks if an element is a native HTML5 multi-select input element
 */
function isNativeMultiSelect(el) {
    return isNativeSelect(el) && el.multiple;
}
/**
 * Checks if an element is a native HTML5 select input element
 */
function isNativeSelect(el) {
    return el.tagName === 'SELECT';
}
/**
 * Checks if a tag name with attrs object will render a native multi-select element
 */
function isNativeMultiSelectNode(tag, attrs) {
    // The falsy value array is the values that Vue won't add the `multiple` prop if it has one of these values
    const hasTruthyBindingValue = ![false, null, undefined, 0].includes(attrs.multiple) && !Number.isNaN(attrs.multiple);
    return tag === 'select' && 'multiple' in attrs && hasTruthyBindingValue;
}
/**
 * Checks if a node should have a `:value` binding or not
 *
 * These nodes should not have a value binding
 * For files, because they are not reactive
 * For multi-selects because the value binding will reset the value
 */
function shouldHaveValueBinding(tag, attrs) {
    return isNativeMultiSelectNode(tag, attrs) || isFileInputNode(tag, attrs);
}
function isFormSubmitEvent(evt) {
    return isEvent(evt) && evt.target && 'submit' in evt.target;
}
function isEvent(evt) {
    if (!evt) {
        return false;
    }
    if (typeof Event !== 'undefined' && isCallable(Event) && evt instanceof Event) {
        return true;
    }
    // this is for IE and Cypress #3161
    /* istanbul ignore next */
    if (evt && evt.srcElement) {
        return true;
    }
    return false;
}
function isPropPresent(obj, prop) {
    return prop in obj && obj[prop] !== IS_ABSENT;
}

function cleanupNonNestedPath(path) {
    if (isNotNestedPath(path)) {
        return path.replace(/\[|\]/gi, '');
    }
    return path;
}
function getFromPath(object, path, fallback) {
    if (!object) {
        return fallback;
    }
    if (isNotNestedPath(path)) {
        return object[cleanupNonNestedPath(path)];
    }
    const resolvedValue = (path || '')
        .split(/\.|\[(\d+)\]/)
        .filter(Boolean)
        .reduce((acc, propKey) => {
        if (isContainerValue(acc) && propKey in acc) {
            return acc[propKey];
        }
        return fallback;
    }, object);
    return resolvedValue;
}
/**
 * Sets a nested property value in a path, creates the path properties if it doesn't exist
 */
function setInPath(object, path, value) {
    if (isNotNestedPath(path)) {
        object[cleanupNonNestedPath(path)] = value;
        return;
    }
    const keys = path.split(/\.|\[(\d+)\]/).filter(Boolean);
    let acc = object;
    for (let i = 0; i < keys.length; i++) {
        // Last key, set it
        if (i === keys.length - 1) {
            acc[keys[i]] = value;
            return;
        }
        // Key does not exist, create a container for it
        if (!(keys[i] in acc) || isNullOrUndefined(acc[keys[i]])) {
            // container can be either an object or an array depending on the next key if it exists
            acc[keys[i]] = isIndex(keys[i + 1]) ? [] : {};
        }
        acc = acc[keys[i]];
    }
}
function unset(object, key) {
    if (Array.isArray(object) && isIndex(key)) {
        object.splice(Number(key), 1);
        return;
    }
    if (isObject(object)) {
        delete object[key];
    }
}
/**
 * Removes a nested property from object
 */
function unsetPath(object, path) {
    if (isNotNestedPath(path)) {
        delete object[cleanupNonNestedPath(path)];
        return;
    }
    const keys = path.split(/\.|\[(\d+)\]/).filter(Boolean);
    let acc = object;
    for (let i = 0; i < keys.length; i++) {
        // Last key, unset it
        if (i === keys.length - 1) {
            unset(acc, keys[i]);
            break;
        }
        // Key does not exist, exit
        if (!(keys[i] in acc) || isNullOrUndefined(acc[keys[i]])) {
            break;
        }
        acc = acc[keys[i]];
    }
    const pathValues = keys.map((_, idx) => {
        return getFromPath(object, keys.slice(0, idx).join('.'));
    });
    for (let i = pathValues.length - 1; i >= 0; i--) {
        if (!isEmptyContainer(pathValues[i])) {
            continue;
        }
        if (i === 0) {
            unset(object, keys[0]);
            continue;
        }
        unset(pathValues[i - 1], keys[i - 1]);
    }
}
/**
 * A typed version of Object.keys
 */
function keysOf(record) {
    return Object.keys(record);
}
// Uses same component provide as its own injections
// Due to changes in https://github.com/vuejs/vue-next/pull/2424
function injectWithSelf(symbol, def = undefined) {
    const vm = (0,vue__WEBPACK_IMPORTED_MODULE_0__.getCurrentInstance)();
    return (vm === null || vm === void 0 ? void 0 : vm.provides[symbol]) || (0,vue__WEBPACK_IMPORTED_MODULE_0__.inject)(symbol, def);
}
function warn(message) {
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.warn)(`[vee-validate]: ${message}`);
}
/**
 * Ensures we deal with a singular field value
 */
function normalizeField(field) {
    if (Array.isArray(field)) {
        return field[0];
    }
    return field;
}
function resolveNextCheckboxValue(currentValue, checkedValue, uncheckedValue) {
    if (Array.isArray(currentValue)) {
        const newVal = [...currentValue];
        const idx = newVal.indexOf(checkedValue);
        idx >= 0 ? newVal.splice(idx, 1) : newVal.push(checkedValue);
        return newVal;
    }
    return currentValue === checkedValue ? uncheckedValue : checkedValue;
}
/**
 * Creates a throttled function that only invokes the provided function (`func`) at most once per within a given number of milliseconds
 * (`limit`)
 */
function throttle(func, limit) {
    let inThrottle;
    let lastResult;
    return function (...args) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this;
        if (!inThrottle) {
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
            lastResult = func.apply(context, args);
        }
        return lastResult;
    };
}
function debounceAsync(inner, ms = 0) {
    let timer = null;
    let resolves = [];
    return function (...args) {
        // Run the function after a certain amount of time
        if (timer) {
            window.clearTimeout(timer);
        }
        timer = window.setTimeout(() => {
            // Get the result of the inner function, then apply it to the resolve function of
            // each promise that has been created since the last time the inner function was run
            const result = inner(...args);
            resolves.forEach(r => r(result));
            resolves = [];
        }, ms);
        return new Promise(resolve => resolves.push(resolve));
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeChildren = (tag, context, slotProps) => {
    if (!context.slots.default) {
        return context.slots.default;
    }
    if (typeof tag === 'string' || !tag) {
        return context.slots.default(slotProps());
    }
    return {
        default: () => { var _a, _b; return (_b = (_a = context.slots).default) === null || _b === void 0 ? void 0 : _b.call(_a, slotProps()); },
    };
};
/**
 * Vue adds a `_value` prop at the moment on the input elements to store the REAL value on them, real values are different than the `value` attribute
 * as they do not get casted to strings unlike `el.value` which preserves user-code behavior
 */
function getBoundValue(el) {
    if (hasValueBinding(el)) {
        return el._value;
    }
    return undefined;
}
/**
 * Vue adds a `_value` prop at the moment on the input elements to store the REAL value on them, real values are different than the `value` attribute
 * as they do not get casted to strings unlike `el.value` which preserves user-code behavior
 */
function hasValueBinding(el) {
    return '_value' in el;
}

function normalizeEventValue(value) {
    if (!isEvent(value)) {
        return value;
    }
    const input = value.target;
    // Vue sets the current bound value on `_value` prop
    // for checkboxes it it should fetch the value binding type as is (boolean instead of string)
    if (hasCheckedAttr(input.type) && hasValueBinding(input)) {
        return getBoundValue(input);
    }
    if (input.type === 'file' && input.files) {
        return Array.from(input.files);
    }
    if (isNativeMultiSelect(input)) {
        return Array.from(input.options)
            .filter(opt => opt.selected && !opt.disabled)
            .map(getBoundValue);
    }
    // makes sure we get the actual `option` bound value
    // #3440
    if (isNativeSelect(input)) {
        const selectedOption = Array.from(input.options).find(opt => opt.selected);
        return selectedOption ? getBoundValue(selectedOption) : input.value;
    }
    return input.value;
}

/**
 * Normalizes the given rules expression.
 */
function normalizeRules(rules) {
    const acc = {};
    Object.defineProperty(acc, '_$$isNormalized', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false,
    });
    if (!rules) {
        return acc;
    }
    // Object is already normalized, skip.
    if (isObject(rules) && rules._$$isNormalized) {
        return rules;
    }
    if (isObject(rules)) {
        return Object.keys(rules).reduce((prev, curr) => {
            const params = normalizeParams(rules[curr]);
            if (rules[curr] !== false) {
                prev[curr] = buildParams(params);
            }
            return prev;
        }, acc);
    }
    /* istanbul ignore if */
    if (typeof rules !== 'string') {
        return acc;
    }
    return rules.split('|').reduce((prev, rule) => {
        const parsedRule = parseRule(rule);
        if (!parsedRule.name) {
            return prev;
        }
        prev[parsedRule.name] = buildParams(parsedRule.params);
        return prev;
    }, acc);
}
/**
 * Normalizes a rule param.
 */
function normalizeParams(params) {
    if (params === true) {
        return [];
    }
    if (Array.isArray(params)) {
        return params;
    }
    if (isObject(params)) {
        return params;
    }
    return [params];
}
function buildParams(provided) {
    const mapValueToLocator = (value) => {
        // A target param using interpolation
        if (typeof value === 'string' && value[0] === '@') {
            return createLocator(value.slice(1));
        }
        return value;
    };
    if (Array.isArray(provided)) {
        return provided.map(mapValueToLocator);
    }
    // #3073
    if (provided instanceof RegExp) {
        return [provided];
    }
    return Object.keys(provided).reduce((prev, key) => {
        prev[key] = mapValueToLocator(provided[key]);
        return prev;
    }, {});
}
/**
 * Parses a rule string expression.
 */
const parseRule = (rule) => {
    let params = [];
    const name = rule.split(':')[0];
    if (rule.includes(':')) {
        params = rule.split(':').slice(1).join(':').split(',');
    }
    return { name, params };
};
function createLocator(value) {
    const locator = (crossTable) => {
        const val = getFromPath(crossTable, value) || crossTable[value];
        return val;
    };
    locator.__locatorRef = value;
    return locator;
}
function extractLocators(params) {
    if (Array.isArray(params)) {
        return params.filter(isLocator);
    }
    return keysOf(params)
        .filter(key => isLocator(params[key]))
        .map(key => params[key]);
}

const DEFAULT_CONFIG = {
    generateMessage: ({ field }) => `${field} is not valid.`,
    bails: true,
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: false,
    validateOnModelUpdate: true,
};
let currentConfig = Object.assign({}, DEFAULT_CONFIG);
const getConfig = () => currentConfig;
const setConfig = (newConf) => {
    currentConfig = Object.assign(Object.assign({}, currentConfig), newConf);
};
const configure = setConfig;

/**
 * Validates a value against the rules.
 */
async function validate(value, rules, options = {}) {
    const shouldBail = options === null || options === void 0 ? void 0 : options.bails;
    const field = {
        name: (options === null || options === void 0 ? void 0 : options.name) || '{field}',
        rules,
        bails: shouldBail !== null && shouldBail !== void 0 ? shouldBail : true,
        formData: (options === null || options === void 0 ? void 0 : options.values) || {},
    };
    const result = await _validate(field, value);
    const errors = result.errors;
    return {
        errors,
        valid: !errors.length,
    };
}
/**
 * Starts the validation process.
 */
async function _validate(field, value) {
    if (isYupValidator(field.rules)) {
        return validateFieldWithYup(value, field.rules, { bails: field.bails });
    }
    // if a generic function or chain of generic functions
    if (isCallable(field.rules) || Array.isArray(field.rules)) {
        const ctx = {
            field: field.name,
            form: field.formData,
            value: value,
        };
        // Normalize the pipeline
        const pipeline = Array.isArray(field.rules) ? field.rules : [field.rules];
        const length = pipeline.length;
        const errors = [];
        for (let i = 0; i < length; i++) {
            const rule = pipeline[i];
            const result = await rule(value, ctx);
            const isValid = typeof result !== 'string' && result;
            if (isValid) {
                continue;
            }
            const message = typeof result === 'string' ? result : _generateFieldError(ctx);
            errors.push(message);
            if (field.bails) {
                return {
                    errors,
                };
            }
        }
        return {
            errors,
        };
    }
    const normalizedContext = Object.assign(Object.assign({}, field), { rules: normalizeRules(field.rules) });
    const errors = [];
    const rulesKeys = Object.keys(normalizedContext.rules);
    const length = rulesKeys.length;
    for (let i = 0; i < length; i++) {
        const rule = rulesKeys[i];
        const result = await _test(normalizedContext, value, {
            name: rule,
            params: normalizedContext.rules[rule],
        });
        if (result.error) {
            errors.push(result.error);
            if (field.bails) {
                return {
                    errors,
                };
            }
        }
    }
    return {
        errors,
    };
}
/**
 * Handles yup validation
 */
async function validateFieldWithYup(value, validator, opts) {
    var _a;
    const errors = await validator
        .validate(value, {
        abortEarly: (_a = opts.bails) !== null && _a !== void 0 ? _a : true,
    })
        .then(() => [])
        .catch((err) => {
        // Yup errors have a name prop one them.
        // https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
        if (err.name === 'ValidationError') {
            return err.errors;
        }
        // re-throw the error so we don't hide it
        throw err;
    });
    return {
        errors,
    };
}
/**
 * Tests a single input value against a rule.
 */
async function _test(field, value, rule) {
    const validator = resolveRule(rule.name);
    if (!validator) {
        throw new Error(`No such validator '${rule.name}' exists.`);
    }
    const params = fillTargetValues(rule.params, field.formData);
    const ctx = {
        field: field.name,
        value,
        form: field.formData,
        rule: Object.assign(Object.assign({}, rule), { params }),
    };
    const result = await validator(value, params, ctx);
    if (typeof result === 'string') {
        return {
            error: result,
        };
    }
    return {
        error: result ? undefined : _generateFieldError(ctx),
    };
}
/**
 * Generates error messages.
 */
function _generateFieldError(fieldCtx) {
    const message = getConfig().generateMessage;
    if (!message) {
        return 'Field is invalid';
    }
    return message(fieldCtx);
}
function fillTargetValues(params, crossTable) {
    const normalize = (value) => {
        if (isLocator(value)) {
            return value(crossTable);
        }
        return value;
    };
    if (Array.isArray(params)) {
        return params.map(normalize);
    }
    return Object.keys(params).reduce((acc, param) => {
        acc[param] = normalize(params[param]);
        return acc;
    }, {});
}
async function validateYupSchema(schema, values) {
    const errorObjects = await schema
        .validate(values, { abortEarly: false })
        .then(() => [])
        .catch((err) => {
        // Yup errors have a name prop one them.
        // https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
        if (err.name !== 'ValidationError') {
            throw err;
        }
        // list of aggregated errors
        return err.inner || [];
    });
    const results = {};
    const errors = {};
    for (const error of errorObjects) {
        const messages = error.errors;
        results[error.path] = { valid: !messages.length, errors: messages };
        if (messages.length) {
            errors[error.path] = messages[0];
        }
    }
    return {
        valid: !errorObjects.length,
        results,
        errors,
    };
}
async function validateObjectSchema(schema, values, opts) {
    const paths = keysOf(schema);
    const validations = paths.map(async (path) => {
        var _a, _b, _c;
        const fieldResult = await validate(getFromPath(values, path), schema[path], {
            name: ((_a = opts === null || opts === void 0 ? void 0 : opts.names) === null || _a === void 0 ? void 0 : _a[path]) || path,
            values: values,
            bails: (_c = (_b = opts === null || opts === void 0 ? void 0 : opts.bailsMap) === null || _b === void 0 ? void 0 : _b[path]) !== null && _c !== void 0 ? _c : true,
        });
        return Object.assign(Object.assign({}, fieldResult), { path });
    });
    let isAllValid = true;
    const validationResults = await Promise.all(validations);
    const results = {};
    const errors = {};
    for (const result of validationResults) {
        results[result.path] = {
            valid: result.valid,
            errors: result.errors,
        };
        if (!result.valid) {
            isAllValid = false;
            errors[result.path] = result.errors[0];
        }
    }
    return {
        valid: isAllValid,
        results,
        errors,
    };
}

function set(obj, key, val) {
	if (typeof val.value === 'object') val.value = klona(val.value);
	if (!val.enumerable || val.get || val.set || !val.configurable || !val.writable || key === '__proto__') {
		Object.defineProperty(obj, key, val);
	} else obj[key] = val.value;
}

function klona(x) {
	if (typeof x !== 'object') return x;

	var i=0, k, list, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		tmp = Object.create(x.__proto__ || null);
	} else if (str === '[object Array]') {
		tmp = Array(x.length);
	} else if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
	} else if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
	} else if (str === '[object Date]') {
		tmp = new Date(+x);
	} else if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
	} else if (str === '[object DataView]') {
		tmp = new x.constructor( klona(x.buffer) );
	} else if (str === '[object ArrayBuffer]') {
		tmp = x.slice(0);
	} else if (str.slice(-6) === 'Array]') {
		// ArrayBuffer.isView(x)
		// ~> `new` bcuz `Buffer.slice` => ref
		tmp = new x.constructor(x);
	}

	if (tmp) {
		for (list=Object.getOwnPropertySymbols(x); i < list.length; i++) {
			set(tmp, list[i], Object.getOwnPropertyDescriptor(x, list[i]));
		}

		for (i=0, list=Object.getOwnPropertyNames(x); i < list.length; i++) {
			if (Object.hasOwnProperty.call(tmp, k=list[i]) && tmp[k] === x[k]) continue;
			set(tmp, k, Object.getOwnPropertyDescriptor(x, k));
		}
	}

	return tmp || x;
}

var es6 = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }


    if ((a instanceof Map) && (b instanceof Map)) {
      if (a.size !== b.size) return false;
      for (i of a.entries())
        if (!b.has(i[0])) return false;
      for (i of a.entries())
        if (!equal(i[1], b.get(i[0]))) return false;
      return true;
    }

    if ((a instanceof Set) && (b instanceof Set)) {
      if (a.size !== b.size) return false;
      for (i of a.entries())
        if (!b.has(i[0])) return false;
      return true;
    }

    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (a[i] !== b[i]) return false;
      return true;
    }


    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};

let ID_COUNTER = 0;
function useFieldState(path, init) {
    const { value, initialValue, setInitialValue } = _useFieldValue(path, init.modelValue, !init.standalone);
    const { errorMessage, errors, setErrors } = _useFieldErrors(path, !init.standalone);
    const meta = _useFieldMeta(value, initialValue, errors);
    const id = ID_COUNTER >= Number.MAX_SAFE_INTEGER ? 0 : ++ID_COUNTER;
    function setState(state) {
        var _a;
        if ('value' in state) {
            value.value = state.value;
        }
        if ('errors' in state) {
            setErrors(state.errors);
        }
        if ('touched' in state) {
            meta.touched = (_a = state.touched) !== null && _a !== void 0 ? _a : meta.touched;
        }
        if ('initialValue' in state) {
            setInitialValue(state.initialValue);
        }
    }
    return {
        id,
        path,
        value,
        initialValue,
        meta,
        errors,
        errorMessage,
        setState,
    };
}
/**
 * Creates the field value and resolves the initial value
 */
function _useFieldValue(path, modelValue, shouldInjectForm) {
    const form = shouldInjectForm ? injectWithSelf(FormContextKey, undefined) : undefined;
    const modelRef = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)((0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(modelValue));
    function resolveInitialValue() {
        if (!form) {
            return (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(modelRef);
        }
        return getFromPath(form.meta.value.initialValues, (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path), (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(modelRef));
    }
    function setInitialValue(value) {
        if (!form) {
            modelRef.value = value;
            return;
        }
        form.setFieldInitialValue((0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path), value);
    }
    const initialValue = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(resolveInitialValue);
    // if no form is associated, use a regular ref.
    if (!form) {
        const value = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(resolveInitialValue());
        return {
            value,
            initialValue,
            setInitialValue,
        };
    }
    // to set the initial value, first check if there is a current value, if there is then use it.
    // otherwise use the configured initial value if it exists.
    // prioritize model value over form values
    // #3429
    const currentValue = modelValue ? (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(modelValue) : getFromPath(form.values, (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path), (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(initialValue));
    form.stageInitialValue((0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path), currentValue);
    // otherwise use a computed setter that triggers the `setFieldValue`
    const value = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)({
        get() {
            return getFromPath(form.values, (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path));
        },
        set(newVal) {
            form.setFieldValue((0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path), newVal);
        },
    });
    return {
        value,
        initialValue,
        setInitialValue,
    };
}
/**
 * Creates meta flags state and some associated effects with them
 */
function _useFieldMeta(currentValue, initialValue, errors) {
    const meta = (0,vue__WEBPACK_IMPORTED_MODULE_0__.reactive)({
        touched: false,
        pending: false,
        valid: true,
        validated: !!(0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(errors).length,
        initialValue: (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(initialValue)),
        dirty: (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
            return !es6((0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(currentValue), (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(initialValue));
        }),
    });
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.watch)(errors, value => {
        meta.valid = !value.length;
    }, {
        immediate: true,
        flush: 'sync',
    });
    return meta;
}
/**
 * Creates the error message state for the field state
 */
function _useFieldErrors(path, shouldInjectForm) {
    const form = shouldInjectForm ? injectWithSelf(FormContextKey, undefined) : undefined;
    function normalizeErrors(messages) {
        if (!messages) {
            return [];
        }
        return Array.isArray(messages) ? messages : [messages];
    }
    if (!form) {
        const errors = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)([]);
        return {
            errors,
            errorMessage: (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => errors.value[0]),
            setErrors: (messages) => {
                errors.value = normalizeErrors(messages);
            },
        };
    }
    const errors = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => form.errorBag.value[(0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path)] || []);
    return {
        errors,
        errorMessage: (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => errors.value[0]),
        setErrors: (messages) => {
            form.setFieldErrorBag((0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path), normalizeErrors(messages));
        },
    };
}

function installDevtoolsPlugin(app) {
    if ((true)) {
        (0,_vue_devtools_api__WEBPACK_IMPORTED_MODULE_1__.setupDevtoolsPlugin)({
            id: 'vee-validate-devtools-plugin',
            label: 'VeeValidate Plugin',
            packageName: 'vee-validate',
            homepage: 'https://vee-validate.logaretm.com/v4',
            app,
            logo: 'https://vee-validate.logaretm.com/v4/logo.png',
        }, setupApiHooks);
    }
}
const DEVTOOLS_FORMS = {};
const DEVTOOLS_FIELDS = {};
let API;
const refreshInspector = throttle(() => {
    setTimeout(async () => {
        await (0,vue__WEBPACK_IMPORTED_MODULE_0__.nextTick)();
        API === null || API === void 0 ? void 0 : API.sendInspectorState(INSPECTOR_ID);
        API === null || API === void 0 ? void 0 : API.sendInspectorTree(INSPECTOR_ID);
    }, 100);
}, 100);
function registerFormWithDevTools(form) {
    const vm = (0,vue__WEBPACK_IMPORTED_MODULE_0__.getCurrentInstance)();
    if (!API) {
        const app = vm === null || vm === void 0 ? void 0 : vm.appContext.app;
        if (!app) {
            return;
        }
        installDevtoolsPlugin(app);
    }
    DEVTOOLS_FORMS[form.formId] = Object.assign({}, form);
    DEVTOOLS_FORMS[form.formId]._vm = vm;
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(() => {
        delete DEVTOOLS_FORMS[form.formId];
        refreshInspector();
    });
    refreshInspector();
}
function registerSingleFieldWithDevtools(field) {
    const vm = (0,vue__WEBPACK_IMPORTED_MODULE_0__.getCurrentInstance)();
    if (!API) {
        const app = vm === null || vm === void 0 ? void 0 : vm.appContext.app;
        if (!app) {
            return;
        }
        installDevtoolsPlugin(app);
    }
    DEVTOOLS_FIELDS[field.id] = Object.assign({}, field);
    DEVTOOLS_FIELDS[field.id]._vm = vm;
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(() => {
        delete DEVTOOLS_FIELDS[field.id];
        refreshInspector();
    });
    refreshInspector();
}
const INSPECTOR_ID = 'vee-validate-inspector';
const COLORS = {
    error: 0xbd4b4b,
    success: 0x06d77b,
    unknown: 0x54436b,
    white: 0xffffff,
    black: 0x000000,
    blue: 0x035397,
    purple: 0xb980f0,
    orange: 0xf5a962,
    gray: 0xbbbfca,
};
let SELECTED_NODE = null;
function setupApiHooks(api) {
    API = api;
    api.addInspector({
        id: INSPECTOR_ID,
        icon: 'rule',
        label: 'vee-validate',
        noSelectionText: 'Select a vee-validate node to inspect',
        actions: [
            {
                icon: 'done_outline',
                tooltip: 'Validate selected item',
                action: async () => {
                    if (!SELECTED_NODE) {
                        console.error('There is not a valid selected vee-validate node or component');
                        return;
                    }
                    const result = await SELECTED_NODE.validate();
                    console.log(result);
                },
            },
            {
                icon: 'delete_sweep',
                tooltip: 'Clear validation state of the selected item',
                action: () => {
                    if (!SELECTED_NODE) {
                        console.error('There is not a valid selected vee-validate node or component');
                        return;
                    }
                    if ('id' in SELECTED_NODE) {
                        SELECTED_NODE.resetField();
                        return;
                    }
                    SELECTED_NODE.resetForm();
                },
            },
        ],
    });
    api.on.getInspectorTree(payload => {
        if (payload.inspectorId !== INSPECTOR_ID) {
            return;
        }
        const forms = Object.values(DEVTOOLS_FORMS);
        const fields = Object.values(DEVTOOLS_FIELDS);
        payload.rootNodes = [
            ...forms.map(mapFormForDevtoolsInspector),
            ...fields.map(field => mapFieldForDevtoolsInspector(field)),
        ];
    });
    api.on.getInspectorState((payload, ctx) => {
        if (payload.inspectorId !== INSPECTOR_ID || ctx.currentTab !== `custom-inspector:${INSPECTOR_ID}`) {
            return;
        }
        const { form, field, type } = decodeNodeId(payload.nodeId);
        if (form && type === 'form') {
            payload.state = buildFormState(form);
            SELECTED_NODE = form;
            return;
        }
        if (field && type === 'field') {
            payload.state = buildFieldState(field);
            SELECTED_NODE = field;
            return;
        }
        SELECTED_NODE = null;
    });
}
function mapFormForDevtoolsInspector(form) {
    const { textColor, bgColor } = getTagTheme(form);
    const formTreeNodes = {};
    Object.values(form.fieldsByPath.value).forEach(field => {
        const fieldInstance = Array.isArray(field) ? field[0] : field;
        if (!fieldInstance) {
            return;
        }
        setInPath(formTreeNodes, (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(fieldInstance.name), mapFieldForDevtoolsInspector(fieldInstance, form));
    });
    function buildFormTree(tree, path = []) {
        const key = [...path].pop();
        if ('id' in tree) {
            return Object.assign(Object.assign({}, tree), { label: key || tree.label });
        }
        if (isObject(tree)) {
            return {
                id: `${path.join('.')}`,
                label: key || '',
                children: Object.keys(tree).map(key => buildFormTree(tree[key], [...path, key])),
            };
        }
        if (Array.isArray(tree)) {
            return {
                id: `${path.join('.')}`,
                label: `${key}[]`,
                children: tree.map((c, idx) => buildFormTree(c, [...path, String(idx)])),
            };
        }
        return { id: '', label: '', children: [] };
    }
    const { children } = buildFormTree(formTreeNodes);
    return {
        id: encodeNodeId(form),
        label: 'Form',
        children,
        tags: [
            {
                label: 'Form',
                textColor,
                backgroundColor: bgColor,
            },
            {
                label: `${Object.keys(form.fieldsByPath.value).length} fields`,
                textColor: COLORS.white,
                backgroundColor: COLORS.unknown,
            },
        ],
    };
}
function mapFieldForDevtoolsInspector(field, form) {
    const fieldInstance = normalizeField(field);
    const { textColor, bgColor } = getTagTheme(fieldInstance);
    const isGroup = Array.isArray(field) && field.length > 1;
    return {
        id: encodeNodeId(form, fieldInstance, !isGroup),
        label: (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(fieldInstance.name),
        children: Array.isArray(field) ? field.map(fieldItem => mapFieldForDevtoolsInspector(fieldItem, form)) : undefined,
        tags: [
            isGroup
                ? undefined
                : {
                    label: 'Field',
                    textColor,
                    backgroundColor: bgColor,
                },
            !form
                ? {
                    label: 'Standalone',
                    textColor: COLORS.black,
                    backgroundColor: COLORS.gray,
                }
                : undefined,
            !isGroup && fieldInstance.type === 'checkbox'
                ? {
                    label: 'Checkbox',
                    textColor: COLORS.white,
                    backgroundColor: COLORS.blue,
                }
                : undefined,
            !isGroup && fieldInstance.type === 'radio'
                ? {
                    label: 'Radio',
                    textColor: COLORS.white,
                    backgroundColor: COLORS.purple,
                }
                : undefined,
            isGroup
                ? {
                    label: 'Group',
                    textColor: COLORS.black,
                    backgroundColor: COLORS.orange,
                }
                : undefined,
        ].filter(Boolean),
    };
}
function encodeNodeId(form, field, encodeIndex = true) {
    const fieldPath = form ? (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(field === null || field === void 0 ? void 0 : field.name) : field === null || field === void 0 ? void 0 : field.id;
    const fieldGroup = fieldPath ? form === null || form === void 0 ? void 0 : form.fieldsByPath.value[fieldPath] : undefined;
    let idx;
    if (encodeIndex && field && Array.isArray(fieldGroup)) {
        idx = fieldGroup.indexOf(field);
    }
    const idObject = { f: form === null || form === void 0 ? void 0 : form.formId, ff: fieldPath, idx, type: field ? 'field' : 'form' };
    return btoa(JSON.stringify(idObject));
}
function decodeNodeId(nodeId) {
    try {
        const idObject = JSON.parse(atob(nodeId));
        const form = DEVTOOLS_FORMS[idObject.f];
        if (!form && idObject.ff) {
            const field = DEVTOOLS_FIELDS[idObject.ff];
            if (!field) {
                return {};
            }
            return {
                type: idObject.type,
                field,
            };
        }
        if (!form) {
            return {};
        }
        const fieldGroup = form.fieldsByPath.value[idObject.ff];
        return {
            type: idObject.type,
            form,
            field: Array.isArray(fieldGroup) ? fieldGroup[idObject.idx || 0] : fieldGroup,
        };
    }
    catch (err) {
        // console.error(`Devtools: [vee-validate] Failed to parse node id ${nodeId}`);
    }
    return {};
}
function buildFieldState(field) {
    const { errors, meta, value } = field;
    return {
        'Field state': [
            { key: 'errors', value: errors.value },
            {
                key: 'initialValue',
                value: meta.initialValue,
            },
            {
                key: 'currentValue',
                value: value.value,
            },
            {
                key: 'touched',
                value: meta.touched,
            },
            {
                key: 'dirty',
                value: meta.dirty,
            },
            {
                key: 'valid',
                value: meta.valid,
            },
        ],
    };
}
function buildFormState(form) {
    const { errorBag, meta, values, isSubmitting, submitCount } = form;
    return {
        'Form state': [
            {
                key: 'submitCount',
                value: submitCount.value,
            },
            {
                key: 'isSubmitting',
                value: isSubmitting.value,
            },
            {
                key: 'touched',
                value: meta.value.touched,
            },
            {
                key: 'dirty',
                value: meta.value.dirty,
            },
            {
                key: 'valid',
                value: meta.value.valid,
            },
            {
                key: 'initialValues',
                value: meta.value.initialValues,
            },
            {
                key: 'currentValues',
                value: values,
            },
            {
                key: 'errors',
                value: keysOf(errorBag.value).reduce((acc, key) => {
                    var _a;
                    const message = (_a = errorBag.value[key]) === null || _a === void 0 ? void 0 : _a[0];
                    if (message) {
                        acc[key] = message;
                    }
                    return acc;
                }, {}),
            },
        ],
    };
}
/**
 * Resolves the tag color based on the form state
 */
function getTagTheme(fieldOrForm) {
    // const fallbackColors = {
    //   bgColor: COLORS.unknown,
    //   textColor: COLORS.white,
    // };
    const isValid = 'id' in fieldOrForm ? fieldOrForm.meta.valid : fieldOrForm.meta.value.valid;
    return {
        bgColor: isValid ? COLORS.success : COLORS.error,
        textColor: isValid ? COLORS.black : COLORS.white,
    };
}

/**
 * Creates a field composite.
 */
function useField(name, rules, opts) {
    if (hasCheckedAttr(opts === null || opts === void 0 ? void 0 : opts.type)) {
        return useCheckboxField(name, rules, opts);
    }
    return _useField(name, rules, opts);
}
function _useField(name, rules, opts) {
    const { initialValue: modelValue, validateOnMount, bails, type, checkedValue, label, validateOnValueUpdate, uncheckedValue, standalone, } = normalizeOptions((0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(name), opts);
    const form = !standalone ? injectWithSelf(FormContextKey) : undefined;
    // a flag indicating if the field is about to be removed/unmounted.
    let markedForRemoval = false;
    const { id, value, initialValue, meta, setState, errors, errorMessage } = useFieldState(name, {
        modelValue,
        standalone,
    });
    /**
     * Handles common onBlur meta update
     */
    const handleBlur = () => {
        meta.touched = true;
    };
    const normalizedRules = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        let rulesValue = (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(rules);
        const schema = (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(form === null || form === void 0 ? void 0 : form.schema);
        if (schema && !isYupValidator(schema)) {
            rulesValue = extractRuleFromSchema(schema, (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(name)) || rulesValue;
        }
        if (isYupValidator(rulesValue) || isCallable(rulesValue) || Array.isArray(rulesValue)) {
            return rulesValue;
        }
        return normalizeRules(rulesValue);
    });
    async function validateCurrentValue(mode) {
        var _a, _b;
        if (form === null || form === void 0 ? void 0 : form.validateSchema) {
            return (_a = (await form.validateSchema(mode)).results[(0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(name)]) !== null && _a !== void 0 ? _a : { valid: true, errors: [] };
        }
        return validate(value.value, normalizedRules.value, {
            name: (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(label) || (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(name),
            values: (_b = form === null || form === void 0 ? void 0 : form.values) !== null && _b !== void 0 ? _b : {},
            bails,
        });
    }
    async function validateWithStateMutation() {
        meta.pending = true;
        meta.validated = true;
        const result = await validateCurrentValue('validated-only');
        if (markedForRemoval) {
            result.valid = true;
            result.errors = [];
        }
        setState({ errors: result.errors });
        meta.pending = false;
        return result;
    }
    async function validateValidStateOnly() {
        const result = await validateCurrentValue('silent');
        if (markedForRemoval) {
            result.valid = true;
        }
        meta.valid = result.valid;
        return result;
    }
    function validate$1(opts) {
        if (!(opts === null || opts === void 0 ? void 0 : opts.mode) || (opts === null || opts === void 0 ? void 0 : opts.mode) === 'force') {
            return validateWithStateMutation();
        }
        if ((opts === null || opts === void 0 ? void 0 : opts.mode) === 'validated-only') {
            return validateWithStateMutation();
        }
        return validateValidStateOnly();
    }
    // Common input/change event handler
    const handleChange = (e, shouldValidate = true) => {
        const newValue = normalizeEventValue(e);
        value.value = newValue;
        if (!validateOnValueUpdate && shouldValidate) {
            validateWithStateMutation();
        }
    };
    // Runs the initial validation
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.onMounted)(() => {
        if (validateOnMount) {
            return validateWithStateMutation();
        }
        // validate self initially if no form was handling this
        // forms should have their own initial silent validation run to make things more efficient
        if (!form || !form.validateSchema) {
            validateValidStateOnly();
        }
    });
    function setTouched(isTouched) {
        meta.touched = isTouched;
    }
    let unwatchValue;
    function watchValue() {
        unwatchValue = (0,vue__WEBPACK_IMPORTED_MODULE_0__.watch)(value, validateOnValueUpdate ? validateWithStateMutation : validateValidStateOnly, {
            deep: true,
        });
    }
    watchValue();
    function resetField(state) {
        var _a;
        unwatchValue === null || unwatchValue === void 0 ? void 0 : unwatchValue();
        const newValue = state && 'value' in state ? state.value : initialValue.value;
        setState({
            value: klona(newValue),
            initialValue: klona(newValue),
            touched: (_a = state === null || state === void 0 ? void 0 : state.touched) !== null && _a !== void 0 ? _a : false,
            errors: (state === null || state === void 0 ? void 0 : state.errors) || [],
        });
        meta.pending = false;
        meta.validated = false;
        validateValidStateOnly();
        // need to watch at next tick to avoid triggering the value watcher
        (0,vue__WEBPACK_IMPORTED_MODULE_0__.nextTick)(() => {
            watchValue();
        });
    }
    function setValue(newValue) {
        value.value = newValue;
    }
    function setErrors(errors) {
        setState({ errors: Array.isArray(errors) ? errors : [errors] });
    }
    const field = {
        id,
        name,
        label,
        value,
        meta,
        errors,
        errorMessage,
        type,
        checkedValue,
        uncheckedValue,
        bails,
        resetField,
        handleReset: () => resetField(),
        validate: validate$1,
        handleChange,
        handleBlur,
        setState,
        setTouched,
        setErrors,
        setValue,
    };
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.provide)(FieldContextKey, field);
    if ((0,vue__WEBPACK_IMPORTED_MODULE_0__.isRef)(rules) && typeof (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(rules) !== 'function') {
        (0,vue__WEBPACK_IMPORTED_MODULE_0__.watch)(rules, (value, oldValue) => {
            if (es6(value, oldValue)) {
                return;
            }
            meta.validated ? validateWithStateMutation() : validateValidStateOnly();
        }, {
            deep: true,
        });
    }
    if ((true)) {
        field._vm = (0,vue__WEBPACK_IMPORTED_MODULE_0__.getCurrentInstance)();
        (0,vue__WEBPACK_IMPORTED_MODULE_0__.watch)(() => (Object.assign(Object.assign({ errors: errors.value }, meta), { value: value.value })), refreshInspector, {
            deep: true,
        });
        if (!form) {
            registerSingleFieldWithDevtools(field);
        }
    }
    // if no associated form return the field API immediately
    if (!form) {
        return field;
    }
    // associate the field with the given form
    form.register(field);
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.onBeforeUnmount)(() => {
        markedForRemoval = true;
        form.unregister(field);
    });
    // extract cross-field dependencies in a computed prop
    const dependencies = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        const rulesVal = normalizedRules.value;
        // is falsy, a function schema or a yup schema
        if (!rulesVal || isCallable(rulesVal) || isYupValidator(rulesVal) || Array.isArray(rulesVal)) {
            return {};
        }
        return Object.keys(rulesVal).reduce((acc, rule) => {
            const deps = extractLocators(rulesVal[rule])
                .map((dep) => dep.__locatorRef)
                .reduce((depAcc, depName) => {
                const depValue = getFromPath(form.values, depName) || form.values[depName];
                if (depValue !== undefined) {
                    depAcc[depName] = depValue;
                }
                return depAcc;
            }, {});
            Object.assign(acc, deps);
            return acc;
        }, {});
    });
    // Adds a watcher that runs the validation whenever field dependencies change
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.watch)(dependencies, (deps, oldDeps) => {
        // Skip if no dependencies or if the field wasn't manipulated
        if (!Object.keys(deps).length) {
            return;
        }
        const shouldValidate = !es6(deps, oldDeps);
        if (shouldValidate) {
            meta.validated ? validateWithStateMutation() : validateValidStateOnly();
        }
    });
    return field;
}
/**
 * Normalizes partial field options to include the full options
 */
function normalizeOptions(name, opts) {
    const defaults = () => ({
        initialValue: undefined,
        validateOnMount: false,
        bails: true,
        rules: '',
        label: name,
        validateOnValueUpdate: true,
        standalone: false,
    });
    if (!opts) {
        return defaults();
    }
    // TODO: Deprecate this in next major release
    const checkedValue = 'valueProp' in opts ? opts.valueProp : opts.checkedValue;
    return Object.assign(Object.assign(Object.assign({}, defaults()), (opts || {})), { checkedValue });
}
/**
 * Extracts the validation rules from a schema
 */
function extractRuleFromSchema(schema, fieldName) {
    // no schema at all
    if (!schema) {
        return undefined;
    }
    // there is a key on the schema object for this field
    return schema[fieldName];
}
function useCheckboxField(name, rules, opts) {
    const form = !(opts === null || opts === void 0 ? void 0 : opts.standalone) ? injectWithSelf(FormContextKey) : undefined;
    const checkedValue = opts === null || opts === void 0 ? void 0 : opts.checkedValue;
    const uncheckedValue = opts === null || opts === void 0 ? void 0 : opts.uncheckedValue;
    function patchCheckboxApi(field) {
        const handleChange = field.handleChange;
        const checked = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
            const currentValue = (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(field.value);
            const checkedVal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(checkedValue);
            return Array.isArray(currentValue) ? currentValue.includes(checkedVal) : checkedVal === currentValue;
        });
        function handleCheckboxChange(e, shouldValidate = true) {
            var _a, _b;
            if (checked.value === ((_b = (_a = e) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.checked)) {
                return;
            }
            let newValue = normalizeEventValue(e);
            // Single checkbox field without a form to toggle it's value
            if (!form) {
                newValue = resolveNextCheckboxValue((0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(field.value), (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(checkedValue), (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(uncheckedValue));
            }
            handleChange(newValue, shouldValidate);
        }
        (0,vue__WEBPACK_IMPORTED_MODULE_0__.onBeforeUnmount)(() => {
            // toggles the checkbox value if it was checked
            if (checked.value) {
                handleCheckboxChange((0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(checkedValue), false);
            }
        });
        return Object.assign(Object.assign({}, field), { checked,
            checkedValue,
            uncheckedValue, handleChange: handleCheckboxChange });
    }
    return patchCheckboxApi(_useField(name, rules, opts));
}

const FieldImpl = (0,vue__WEBPACK_IMPORTED_MODULE_0__.defineComponent)({
    name: 'Field',
    inheritAttrs: false,
    props: {
        as: {
            type: [String, Object],
            default: undefined,
        },
        name: {
            type: String,
            required: true,
        },
        rules: {
            type: [Object, String, Function],
            default: undefined,
        },
        validateOnMount: {
            type: Boolean,
            default: false,
        },
        validateOnBlur: {
            type: Boolean,
            default: undefined,
        },
        validateOnChange: {
            type: Boolean,
            default: undefined,
        },
        validateOnInput: {
            type: Boolean,
            default: undefined,
        },
        validateOnModelUpdate: {
            type: Boolean,
            default: undefined,
        },
        bails: {
            type: Boolean,
            default: () => getConfig().bails,
        },
        label: {
            type: String,
            default: undefined,
        },
        uncheckedValue: {
            type: null,
            default: undefined,
        },
        modelValue: {
            type: null,
            default: IS_ABSENT,
        },
        modelModifiers: {
            type: null,
            default: () => ({}),
        },
        'onUpdate:modelValue': {
            type: null,
            default: undefined,
        },
        standalone: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, ctx) {
        const rules = (0,vue__WEBPACK_IMPORTED_MODULE_0__.toRef)(props, 'rules');
        const name = (0,vue__WEBPACK_IMPORTED_MODULE_0__.toRef)(props, 'name');
        const label = (0,vue__WEBPACK_IMPORTED_MODULE_0__.toRef)(props, 'label');
        const uncheckedValue = (0,vue__WEBPACK_IMPORTED_MODULE_0__.toRef)(props, 'uncheckedValue');
        const hasModelEvents = isPropPresent(props, 'onUpdate:modelValue');
        const { errors, value, errorMessage, validate: validateField, handleChange, handleBlur, setTouched, resetField, handleReset, meta, checked, setErrors, } = useField(name, rules, {
            validateOnMount: props.validateOnMount,
            bails: props.bails,
            standalone: props.standalone,
            type: ctx.attrs.type,
            initialValue: resolveInitialValue(props, ctx),
            // Only for checkboxes and radio buttons
            checkedValue: ctx.attrs.value,
            uncheckedValue,
            label,
            validateOnValueUpdate: false,
        });
        // If there is a v-model applied on the component we need to emit the `update:modelValue` whenever the value binding changes
        const onChangeHandler = hasModelEvents
            ? function handleChangeWithModel(e, shouldValidate = true) {
                handleChange(e, shouldValidate);
                ctx.emit('update:modelValue', value.value);
            }
            : handleChange;
        const handleInput = (e) => {
            if (!hasCheckedAttr(ctx.attrs.type)) {
                value.value = normalizeEventValue(e);
            }
        };
        const onInputHandler = hasModelEvents
            ? function handleInputWithModel(e) {
                handleInput(e);
                ctx.emit('update:modelValue', value.value);
            }
            : handleInput;
        const fieldProps = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
            const { validateOnInput, validateOnChange, validateOnBlur, validateOnModelUpdate } = resolveValidationTriggers(props);
            const baseOnBlur = [handleBlur, ctx.attrs.onBlur, validateOnBlur ? validateField : undefined].filter(Boolean);
            const baseOnInput = [(e) => onChangeHandler(e, validateOnInput), ctx.attrs.onInput].filter(Boolean);
            const baseOnChange = [(e) => onChangeHandler(e, validateOnChange), ctx.attrs.onChange].filter(Boolean);
            const attrs = {
                name: props.name,
                onBlur: baseOnBlur,
                onInput: baseOnInput,
                onChange: baseOnChange,
            };
            attrs['onUpdate:modelValue'] = e => onChangeHandler(e, validateOnModelUpdate);
            if (hasCheckedAttr(ctx.attrs.type) && checked) {
                attrs.checked = checked.value;
            }
            else {
                attrs.value = value.value;
            }
            const tag = resolveTag(props, ctx);
            if (shouldHaveValueBinding(tag, ctx.attrs)) {
                delete attrs.value;
            }
            return attrs;
        });
        const modelValue = (0,vue__WEBPACK_IMPORTED_MODULE_0__.toRef)(props, 'modelValue');
        (0,vue__WEBPACK_IMPORTED_MODULE_0__.watch)(modelValue, newModelValue => {
            // Don't attempt to sync absent values
            if (newModelValue === IS_ABSENT && value.value === undefined) {
                return;
            }
            if (newModelValue !== applyModifiers(value.value, props.modelModifiers)) {
                value.value = newModelValue === IS_ABSENT ? undefined : newModelValue;
                validateField();
            }
        });
        function slotProps() {
            return {
                field: fieldProps.value,
                value: value.value,
                meta,
                errors: errors.value,
                errorMessage: errorMessage.value,
                validate: validateField,
                resetField,
                handleChange: onChangeHandler,
                handleInput: onInputHandler,
                handleReset,
                handleBlur,
                setTouched,
                setErrors,
            };
        }
        ctx.expose({
            setErrors,
            setTouched,
            reset: resetField,
            validate: validateField,
            handleChange,
        });
        return () => {
            const tag = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDynamicComponent)(resolveTag(props, ctx));
            const children = normalizeChildren(tag, ctx, slotProps);
            if (tag) {
                return (0,vue__WEBPACK_IMPORTED_MODULE_0__.h)(tag, Object.assign(Object.assign({}, ctx.attrs), fieldProps.value), children);
            }
            return children;
        };
    },
});
function resolveTag(props, ctx) {
    let tag = props.as || '';
    if (!props.as && !ctx.slots.default) {
        tag = 'input';
    }
    return tag;
}
function resolveValidationTriggers(props) {
    var _a, _b, _c, _d;
    const { validateOnInput, validateOnChange, validateOnBlur, validateOnModelUpdate } = getConfig();
    return {
        validateOnInput: (_a = props.validateOnInput) !== null && _a !== void 0 ? _a : validateOnInput,
        validateOnChange: (_b = props.validateOnChange) !== null && _b !== void 0 ? _b : validateOnChange,
        validateOnBlur: (_c = props.validateOnBlur) !== null && _c !== void 0 ? _c : validateOnBlur,
        validateOnModelUpdate: (_d = props.validateOnModelUpdate) !== null && _d !== void 0 ? _d : validateOnModelUpdate,
    };
}
function applyModifiers(value, modifiers) {
    if (modifiers.number) {
        return toNumber(value);
    }
    return value;
}
function resolveInitialValue(props, ctx) {
    // Gets the initial value either from `value` prop/attr or `v-model` binding (modelValue)
    // For checkboxes and radio buttons it will always be the model value not the `value` attribute
    if (!hasCheckedAttr(ctx.attrs.type)) {
        return isPropPresent(props, 'modelValue') ? props.modelValue : ctx.attrs.value;
    }
    return isPropPresent(props, 'modelValue') ? props.modelValue : undefined;
}
const Field = FieldImpl;

let FORM_COUNTER = 0;
function useForm(opts) {
    const formId = FORM_COUNTER++;
    // Prevents fields from double resetting their values, which causes checkboxes to toggle their initial value
    // TODO: This won't be needed if we centralize all the state inside the `form` for form inputs
    let RESET_LOCK = false;
    // A lookup containing fields or field groups
    const fieldsByPath = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)({});
    // If the form is currently submitting
    const isSubmitting = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(false);
    // The number of times the user tried to submit the form
    const submitCount = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(0);
    // dictionary for field arrays to receive various signals like reset
    const fieldArraysLookup = {};
    // a private ref for all form values
    const formValues = (0,vue__WEBPACK_IMPORTED_MODULE_0__.reactive)(klona((0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(opts === null || opts === void 0 ? void 0 : opts.initialValues) || {}));
    // the source of errors for the form fields
    const { errorBag, setErrorBag, setFieldErrorBag } = useErrorBag(opts === null || opts === void 0 ? void 0 : opts.initialErrors);
    // Gets the first error of each field
    const errors = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        return keysOf(errorBag.value).reduce((acc, key) => {
            const bag = errorBag.value[key];
            if (bag && bag.length) {
                acc[key] = bag[0];
            }
            return acc;
        }, {});
    });
    function getFirstFieldAtPath(path) {
        const fieldOrGroup = fieldsByPath.value[path];
        return Array.isArray(fieldOrGroup) ? fieldOrGroup[0] : fieldOrGroup;
    }
    function fieldExists(path) {
        return !!fieldsByPath.value[path];
    }
    /**
     * Holds a computed reference to all fields names and labels
     */
    const fieldNames = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        return keysOf(fieldsByPath.value).reduce((names, path) => {
            const field = getFirstFieldAtPath(path);
            if (field) {
                names[path] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(field.label || field.name) || '';
            }
            return names;
        }, {});
    });
    const fieldBailsMap = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        return keysOf(fieldsByPath.value).reduce((map, path) => {
            var _a;
            const field = getFirstFieldAtPath(path);
            if (field) {
                map[path] = (_a = field.bails) !== null && _a !== void 0 ? _a : true;
            }
            return map;
        }, {});
    });
    // mutable non-reactive reference to initial errors
    // we need this to process initial errors then unset them
    const initialErrors = Object.assign({}, ((opts === null || opts === void 0 ? void 0 : opts.initialErrors) || {}));
    // initial form values
    const { initialValues, originalInitialValues, setInitialValues } = useFormInitialValues(fieldsByPath, formValues, opts === null || opts === void 0 ? void 0 : opts.initialValues);
    // form meta aggregations
    const meta = useFormMeta(fieldsByPath, formValues, initialValues, errors);
    const schema = opts === null || opts === void 0 ? void 0 : opts.validationSchema;
    const formCtx = {
        formId,
        fieldsByPath,
        values: formValues,
        errorBag,
        errors,
        schema,
        submitCount,
        meta,
        isSubmitting,
        fieldArraysLookup,
        validateSchema: (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(schema) ? validateSchema : undefined,
        validate,
        register: registerField,
        unregister: unregisterField,
        setFieldErrorBag,
        validateField,
        setFieldValue,
        setValues,
        setErrors,
        setFieldError,
        setFieldTouched,
        setTouched,
        resetForm,
        handleSubmit,
        stageInitialValue,
        unsetInitialValue,
        setFieldInitialValue,
    };
    function isFieldGroup(fieldOrGroup) {
        return Array.isArray(fieldOrGroup);
    }
    function applyFieldMutation(fieldOrGroup, mutation) {
        if (Array.isArray(fieldOrGroup)) {
            return fieldOrGroup.forEach(mutation);
        }
        return mutation(fieldOrGroup);
    }
    function mutateAllFields(mutation) {
        Object.values(fieldsByPath.value).forEach(field => {
            if (!field) {
                return;
            }
            // avoid resetting the field values, because they should've been reset already.
            applyFieldMutation(field, mutation);
        });
    }
    /**
     * Manually sets an error message on a specific field
     */
    function setFieldError(field, message) {
        setFieldErrorBag(field, message);
    }
    /**
     * Sets errors for the fields specified in the object
     */
    function setErrors(fields) {
        setErrorBag(fields);
    }
    /**
     * Sets a single field value
     */
    function setFieldValue(field, value, { force } = { force: false }) {
        var _a;
        const fieldInstance = fieldsByPath.value[field];
        const clonedValue = klona(value);
        // field wasn't found, create a virtual field as a placeholder
        if (!fieldInstance) {
            setInPath(formValues, field, clonedValue);
            return;
        }
        if (isFieldGroup(fieldInstance) && ((_a = fieldInstance[0]) === null || _a === void 0 ? void 0 : _a.type) === 'checkbox' && !Array.isArray(value)) {
            // Multiple checkboxes, and only one of them got updated
            const newValue = klona(resolveNextCheckboxValue(getFromPath(formValues, field) || [], value, undefined));
            setInPath(formValues, field, newValue);
            return;
        }
        let newValue = value;
        // Single Checkbox: toggles the field value unless the field is being reset then force it
        if (!isFieldGroup(fieldInstance) && fieldInstance.type === 'checkbox' && !force && !RESET_LOCK) {
            newValue = klona(resolveNextCheckboxValue(getFromPath(formValues, field), value, (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(fieldInstance.uncheckedValue)));
        }
        setInPath(formValues, field, newValue);
    }
    /**
     * Sets multiple fields values
     */
    function setValues(fields) {
        // clean up old values
        keysOf(formValues).forEach(key => {
            delete formValues[key];
        });
        // set up new values
        keysOf(fields).forEach(path => {
            setFieldValue(path, fields[path]);
        });
        // regenerate the arrays when the form values change
        Object.values(fieldArraysLookup).forEach(f => f && f.reset());
    }
    /**
     * Sets the touched meta state on a field
     */
    function setFieldTouched(field, isTouched) {
        const fieldInstance = fieldsByPath.value[field];
        if (fieldInstance) {
            applyFieldMutation(fieldInstance, f => f.setTouched(isTouched));
        }
    }
    /**
     * Sets the touched meta state on multiple fields
     */
    function setTouched(fields) {
        keysOf(fields).forEach(field => {
            setFieldTouched(field, !!fields[field]);
        });
    }
    /**
     * Resets all fields
     */
    function resetForm(state) {
        RESET_LOCK = true;
        // set initial values if provided
        if (state === null || state === void 0 ? void 0 : state.values) {
            setInitialValues(state.values);
            setValues(state === null || state === void 0 ? void 0 : state.values);
        }
        else {
            // clean up the initial values back to the original
            setInitialValues(originalInitialValues.value);
            // otherwise clean the current values
            setValues(originalInitialValues.value);
        }
        // avoid resetting the field values, because they should've been reset already.
        mutateAllFields(f => f.resetField());
        if (state === null || state === void 0 ? void 0 : state.touched) {
            setTouched(state.touched);
        }
        setErrors((state === null || state === void 0 ? void 0 : state.errors) || {});
        submitCount.value = (state === null || state === void 0 ? void 0 : state.submitCount) || 0;
        (0,vue__WEBPACK_IMPORTED_MODULE_0__.nextTick)(() => {
            RESET_LOCK = false;
        });
    }
    function insertFieldAtPath(field, path) {
        const rawField = (0,vue__WEBPACK_IMPORTED_MODULE_0__.markRaw)(field);
        const fieldPath = path;
        // first field at that path
        if (!fieldsByPath.value[fieldPath]) {
            fieldsByPath.value[fieldPath] = rawField;
            return;
        }
        const fieldAtPath = fieldsByPath.value[fieldPath];
        if (fieldAtPath && !Array.isArray(fieldAtPath)) {
            fieldsByPath.value[fieldPath] = [fieldAtPath];
        }
        // add the new array to that path
        fieldsByPath.value[fieldPath] = [...fieldsByPath.value[fieldPath], rawField];
    }
    function removeFieldFromPath(field, path) {
        const fieldPath = path;
        const fieldAtPath = fieldsByPath.value[fieldPath];
        if (!fieldAtPath) {
            return;
        }
        // same field at path
        if (!isFieldGroup(fieldAtPath) && field.id === fieldAtPath.id) {
            delete fieldsByPath.value[fieldPath];
            return;
        }
        if (isFieldGroup(fieldAtPath)) {
            const idx = fieldAtPath.findIndex(f => f.id === field.id);
            if (idx === -1) {
                return;
            }
            fieldAtPath.splice(idx, 1);
            if (fieldAtPath.length === 1) {
                fieldsByPath.value[fieldPath] = fieldAtPath[0];
                return;
            }
            if (!fieldAtPath.length) {
                delete fieldsByPath.value[fieldPath];
            }
        }
    }
    function registerField(field) {
        const fieldPath = (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(field.name);
        insertFieldAtPath(field, fieldPath);
        if ((0,vue__WEBPACK_IMPORTED_MODULE_0__.isRef)(field.name)) {
            // ensures when a field's name was already taken that it preserves its same value
            // necessary for fields generated by loops
            (0,vue__WEBPACK_IMPORTED_MODULE_0__.watch)(field.name, async (newPath, oldPath) => {
                // cache the value
                await (0,vue__WEBPACK_IMPORTED_MODULE_0__.nextTick)();
                removeFieldFromPath(field, oldPath);
                insertFieldAtPath(field, newPath);
                // re-validate if either path had errors before
                if (errors.value[oldPath] || errors.value[newPath]) {
                    // clear up both paths errors
                    setFieldError(oldPath, undefined);
                    validateField(newPath);
                }
                // clean up the old path if no other field is sharing that name
                // #3325
                await (0,vue__WEBPACK_IMPORTED_MODULE_0__.nextTick)();
                if (!fieldExists(oldPath)) {
                    unsetPath(formValues, oldPath);
                }
            });
        }
        // if field already had errors (initial errors) that's not user-set, validate it again to ensure state is correct
        // the difference being that `initialErrors` will contain the error message while other errors (pre-validated schema) won't have them as initial errors
        // #3342
        const initialErrorMessage = (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(field.errorMessage);
        if (initialErrorMessage && (initialErrors === null || initialErrors === void 0 ? void 0 : initialErrors[fieldPath]) !== initialErrorMessage) {
            validateField(fieldPath);
        }
        // marks the initial error as "consumed" so it won't be matched later with same non-initial error
        delete initialErrors[fieldPath];
    }
    function unregisterField(field) {
        const fieldName = (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(field.name);
        removeFieldFromPath(field, fieldName);
        (0,vue__WEBPACK_IMPORTED_MODULE_0__.nextTick)(() => {
            // clears a field error on unmounted
            // we wait till next tick to make sure if the field is completely removed and doesn't have any siblings like checkboxes
            // #3384
            if (!fieldExists(fieldName)) {
                setFieldError(fieldName, undefined);
                unsetPath(formValues, fieldName);
            }
        });
    }
    async function validate(opts) {
        mutateAllFields(f => (f.meta.validated = true));
        if (formCtx.validateSchema) {
            return formCtx.validateSchema((opts === null || opts === void 0 ? void 0 : opts.mode) || 'force');
        }
        // No schema, each field is responsible to validate itself
        const validations = await Promise.all(Object.values(fieldsByPath.value).map(field => {
            const fieldInstance = Array.isArray(field) ? field[0] : field;
            if (!fieldInstance) {
                return Promise.resolve({ key: '', valid: true, errors: [] });
            }
            return fieldInstance.validate(opts).then((result) => {
                return {
                    key: (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(fieldInstance.name),
                    valid: result.valid,
                    errors: result.errors,
                };
            });
        }));
        const results = {};
        const errors = {};
        for (const validation of validations) {
            results[validation.key] = {
                valid: validation.valid,
                errors: validation.errors,
            };
            if (validation.errors.length) {
                errors[validation.key] = validation.errors[0];
            }
        }
        return {
            valid: validations.every(r => r.valid),
            results,
            errors,
        };
    }
    async function validateField(field) {
        const fieldInstance = fieldsByPath.value[field];
        if (!fieldInstance) {
            (0,vue__WEBPACK_IMPORTED_MODULE_0__.warn)(`field with name ${field} was not found`);
            return Promise.resolve({ errors: [], valid: true });
        }
        if (Array.isArray(fieldInstance)) {
            return fieldInstance.map(f => f.validate())[0];
        }
        return fieldInstance.validate();
    }
    function handleSubmit(fn, onValidationError) {
        return function submissionHandler(e) {
            if (e instanceof Event) {
                e.preventDefault();
                e.stopPropagation();
            }
            // Touch all fields
            setTouched(keysOf(fieldsByPath.value).reduce((acc, field) => {
                acc[field] = true;
                return acc;
            }, {}));
            isSubmitting.value = true;
            submitCount.value++;
            return validate()
                .then(result => {
                if (result.valid && typeof fn === 'function') {
                    return fn(klona(formValues), {
                        evt: e,
                        setErrors,
                        setFieldError,
                        setTouched,
                        setFieldTouched,
                        setValues,
                        setFieldValue,
                        resetForm,
                    });
                }
                if (!result.valid && typeof onValidationError === 'function') {
                    onValidationError({
                        values: klona(formValues),
                        evt: e,
                        errors: result.errors,
                        results: result.results,
                    });
                }
            })
                .then(returnVal => {
                isSubmitting.value = false;
                return returnVal;
            }, err => {
                isSubmitting.value = false;
                // re-throw the err so it doesn't go silent
                throw err;
            });
        };
    }
    function setFieldInitialValue(path, value) {
        setInPath(initialValues.value, path, klona(value));
    }
    function unsetInitialValue(path) {
        unsetPath(initialValues.value, path);
    }
    /**
     * Sneaky function to set initial field values
     */
    function stageInitialValue(path, value) {
        setInPath(formValues, path, value);
        setFieldInitialValue(path, value);
    }
    async function _validateSchema() {
        const schemaValue = (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(schema);
        if (!schemaValue) {
            return { valid: true, results: {}, errors: {} };
        }
        const formResult = isYupValidator(schemaValue)
            ? await validateYupSchema(schemaValue, formValues)
            : await validateObjectSchema(schemaValue, formValues, {
                names: fieldNames.value,
                bailsMap: fieldBailsMap.value,
            });
        return formResult;
    }
    /**
     * Batches validation runs in 5ms batches
     */
    const debouncedSchemaValidation = debounceAsync(_validateSchema, 5);
    async function validateSchema(mode) {
        const formResult = await debouncedSchemaValidation();
        // fields by id lookup
        const fieldsById = formCtx.fieldsByPath.value || {};
        // errors fields names, we need it to also check if custom errors are updated
        const currentErrorsPaths = keysOf(formCtx.errorBag.value);
        // collect all the keys from the schema and all fields
        // this ensures we have a complete keymap of all the fields
        const paths = [
            ...new Set([...keysOf(formResult.results), ...keysOf(fieldsById), ...currentErrorsPaths]),
        ];
        // aggregates the paths into a single result object while applying the results on the fields
        return paths.reduce((validation, path) => {
            const field = fieldsById[path];
            const messages = (formResult.results[path] || { errors: [] }).errors;
            const fieldResult = {
                errors: messages,
                valid: !messages.length,
            };
            validation.results[path] = fieldResult;
            if (!fieldResult.valid) {
                validation.errors[path] = fieldResult.errors[0];
            }
            // field not rendered
            if (!field) {
                setFieldError(path, messages);
                return validation;
            }
            // always update the valid flag regardless of the mode
            applyFieldMutation(field, f => (f.meta.valid = fieldResult.valid));
            if (mode === 'silent') {
                return validation;
            }
            const wasValidated = Array.isArray(field) ? field.some(f => f.meta.validated) : field.meta.validated;
            if (mode === 'validated-only' && !wasValidated) {
                return validation;
            }
            applyFieldMutation(field, f => f.setState({ errors: fieldResult.errors }));
            return validation;
        }, { valid: formResult.valid, results: {}, errors: {} });
    }
    const submitForm = handleSubmit((_, { evt }) => {
        if (isFormSubmitEvent(evt)) {
            evt.target.submit();
        }
    });
    // Trigger initial validation
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.onMounted)(() => {
        if (opts === null || opts === void 0 ? void 0 : opts.initialErrors) {
            setErrors(opts.initialErrors);
        }
        if (opts === null || opts === void 0 ? void 0 : opts.initialTouched) {
            setTouched(opts.initialTouched);
        }
        // if validate on mount was enabled
        if (opts === null || opts === void 0 ? void 0 : opts.validateOnMount) {
            validate();
            return;
        }
        // otherwise run initial silent validation through schema if available
        // the useField should skip their own silent validation if a yup schema is present
        if (formCtx.validateSchema) {
            formCtx.validateSchema('silent');
        }
    });
    if ((0,vue__WEBPACK_IMPORTED_MODULE_0__.isRef)(schema)) {
        (0,vue__WEBPACK_IMPORTED_MODULE_0__.watch)(schema, () => {
            var _a;
            (_a = formCtx.validateSchema) === null || _a === void 0 ? void 0 : _a.call(formCtx, 'validated-only');
        });
    }
    // Provide injections
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.provide)(FormContextKey, formCtx);
    if ((true)) {
        registerFormWithDevTools(formCtx);
        (0,vue__WEBPACK_IMPORTED_MODULE_0__.watch)(() => (Object.assign(Object.assign({ errors: errorBag.value }, meta.value), { values: formValues, isSubmitting: isSubmitting.value, submitCount: submitCount.value })), refreshInspector, {
            deep: true,
        });
    }
    return {
        errors,
        meta,
        values: formValues,
        isSubmitting,
        submitCount,
        validate,
        validateField,
        handleReset: () => resetForm(),
        resetForm,
        handleSubmit,
        submitForm,
        setFieldError,
        setErrors,
        setFieldValue,
        setValues,
        setFieldTouched,
        setTouched,
    };
}
/**
 * Manages form meta aggregation
 */
function useFormMeta(fieldsByPath, currentValues, initialValues, errors) {
    const MERGE_STRATEGIES = {
        touched: 'some',
        pending: 'some',
        valid: 'every',
    };
    const isDirty = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        return !es6(currentValues, (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(initialValues));
    });
    function calculateFlags() {
        const fields = Object.values(fieldsByPath.value).flat(1).filter(Boolean);
        return keysOf(MERGE_STRATEGIES).reduce((acc, flag) => {
            const mergeMethod = MERGE_STRATEGIES[flag];
            acc[flag] = fields[mergeMethod](field => field.meta[flag]);
            return acc;
        }, {});
    }
    const flags = (0,vue__WEBPACK_IMPORTED_MODULE_0__.reactive)(calculateFlags());
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.watchEffect)(() => {
        const value = calculateFlags();
        flags.touched = value.touched;
        flags.valid = value.valid;
        flags.pending = value.pending;
    });
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        return Object.assign(Object.assign({ initialValues: (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(initialValues) }, flags), { valid: flags.valid && !keysOf(errors.value).length, dirty: isDirty.value });
    });
}
/**
 * Manages the initial values prop
 */
function useFormInitialValues(fields, formValues, providedValues) {
    // these are the mutable initial values as the fields are mounted/unmounted
    const initialValues = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(klona((0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(providedValues)) || {});
    // these are the original initial value as provided by the user initially, they don't keep track of conditional fields
    // this is important because some conditional fields will overwrite the initial values for other fields who had the same name
    // like array fields, any push/insert operation will overwrite the initial values because they "create new fields"
    // so these are the values that the reset function should use
    // these only change when the user explicitly chanegs the initial values or when the user resets them with new values.
    const originalInitialValues = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(klona((0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(providedValues)) || {});
    function setInitialValues(values, updateFields = false) {
        initialValues.value = klona(values);
        originalInitialValues.value = klona(values);
        if (!updateFields) {
            return;
        }
        // update the pristine non-touched fields
        // those are excluded because it's unlikely you want to change the form values using initial values
        // we mostly watch them for API population or newly inserted fields
        // if the user API is taking too much time before user interaction they should consider disabling or hiding their inputs until the values are ready
        keysOf(fields.value).forEach(fieldPath => {
            const field = fields.value[fieldPath];
            const wasTouched = Array.isArray(field) ? field.some(f => f.meta.touched) : field === null || field === void 0 ? void 0 : field.meta.touched;
            if (!field || wasTouched) {
                return;
            }
            const newValue = getFromPath(initialValues.value, fieldPath);
            setInPath(formValues, fieldPath, klona(newValue));
        });
    }
    if ((0,vue__WEBPACK_IMPORTED_MODULE_0__.isRef)(providedValues)) {
        (0,vue__WEBPACK_IMPORTED_MODULE_0__.watch)(providedValues, value => {
            setInitialValues(value, true);
        }, {
            deep: true,
        });
    }
    return {
        initialValues,
        originalInitialValues,
        setInitialValues,
    };
}
function useErrorBag(initialErrors) {
    const errorBag = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)({});
    function normalizeErrorItem(message) {
        return Array.isArray(message) ? message : message ? [message] : [];
    }
    /**
     * Manually sets an error message on a specific field
     */
    function setFieldErrorBag(field, message) {
        if (!message) {
            delete errorBag.value[field];
            return;
        }
        errorBag.value[field] = normalizeErrorItem(message);
    }
    /**
     * Sets errors for the fields specified in the object
     */
    function setErrorBag(fields) {
        errorBag.value = keysOf(fields).reduce((acc, key) => {
            const message = fields[key];
            if (message) {
                acc[key] = normalizeErrorItem(message);
            }
            return acc;
        }, {});
    }
    if (initialErrors) {
        setErrorBag(initialErrors);
    }
    return {
        errorBag,
        setErrorBag,
        setFieldErrorBag,
    };
}

const FormImpl = (0,vue__WEBPACK_IMPORTED_MODULE_0__.defineComponent)({
    name: 'Form',
    inheritAttrs: false,
    props: {
        as: {
            type: String,
            default: 'form',
        },
        validationSchema: {
            type: Object,
            default: undefined,
        },
        initialValues: {
            type: Object,
            default: undefined,
        },
        initialErrors: {
            type: Object,
            default: undefined,
        },
        initialTouched: {
            type: Object,
            default: undefined,
        },
        validateOnMount: {
            type: Boolean,
            default: false,
        },
        onSubmit: {
            type: Function,
            default: undefined,
        },
        onInvalidSubmit: {
            type: Function,
            default: undefined,
        },
    },
    setup(props, ctx) {
        const initialValues = (0,vue__WEBPACK_IMPORTED_MODULE_0__.toRef)(props, 'initialValues');
        const validationSchema = (0,vue__WEBPACK_IMPORTED_MODULE_0__.toRef)(props, 'validationSchema');
        const { errors, values, meta, isSubmitting, submitCount, validate, validateField, handleReset, resetForm, handleSubmit, submitForm, setErrors, setFieldError, setFieldValue, setValues, setFieldTouched, setTouched, } = useForm({
            validationSchema: validationSchema.value ? validationSchema : undefined,
            initialValues,
            initialErrors: props.initialErrors,
            initialTouched: props.initialTouched,
            validateOnMount: props.validateOnMount,
        });
        const onSubmit = props.onSubmit ? handleSubmit(props.onSubmit, props.onInvalidSubmit) : submitForm;
        function handleFormReset(e) {
            if (isEvent(e)) {
                // Prevent default form reset behavior
                e.preventDefault();
            }
            handleReset();
            if (typeof ctx.attrs.onReset === 'function') {
                ctx.attrs.onReset();
            }
        }
        function handleScopedSlotSubmit(evt, onSubmit) {
            const onSuccess = typeof evt === 'function' && !onSubmit ? evt : onSubmit;
            return handleSubmit(onSuccess, props.onInvalidSubmit)(evt);
        }
        function slotProps() {
            return {
                meta: meta.value,
                errors: errors.value,
                values: values,
                isSubmitting: isSubmitting.value,
                submitCount: submitCount.value,
                validate,
                validateField,
                handleSubmit: handleScopedSlotSubmit,
                handleReset,
                submitForm,
                setErrors,
                setFieldError,
                setFieldValue,
                setValues,
                setFieldTouched,
                setTouched,
                resetForm,
            };
        }
        // expose these functions and methods as part of public API
        ctx.expose({
            setFieldError,
            setErrors,
            setFieldValue,
            setValues,
            setFieldTouched,
            setTouched,
            resetForm,
            validate,
            validateField,
        });
        return function renderForm() {
            // avoid resolving the form component as itself
            const tag = props.as === 'form' ? props.as : (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDynamicComponent)(props.as);
            const children = normalizeChildren(tag, ctx, slotProps);
            if (!props.as) {
                return children;
            }
            // Attributes to add on a native `form` tag
            const formAttrs = props.as === 'form'
                ? {
                    // Disables native validation as vee-validate will handle it.
                    novalidate: true,
                }
                : {};
            return (0,vue__WEBPACK_IMPORTED_MODULE_0__.h)(tag, Object.assign(Object.assign(Object.assign({}, formAttrs), ctx.attrs), { onSubmit, onReset: handleFormReset }), children);
        };
    },
});
const Form = FormImpl;

let FIELD_ARRAY_COUNTER = 0;
function useFieldArray(arrayPath) {
    const id = FIELD_ARRAY_COUNTER++;
    const form = injectWithSelf(FormContextKey, undefined);
    const fields = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)([]);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noOp = () => { };
    const noOpApi = {
        fields: (0,vue__WEBPACK_IMPORTED_MODULE_0__.readonly)(fields),
        remove: noOp,
        push: noOp,
        swap: noOp,
        insert: noOp,
        update: noOp,
        replace: noOp,
        prepend: noOp,
    };
    if (!form) {
        warn('FieldArray requires being a child of `<Form/>` or `useForm` being called before it. Array fields may not work correctly');
        return noOpApi;
    }
    if (!(0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(arrayPath)) {
        warn('FieldArray requires a field path to be provided, did you forget to pass the `name` prop?');
        return noOpApi;
    }
    let entryCounter = 0;
    function initFields() {
        const currentValues = getFromPath(form === null || form === void 0 ? void 0 : form.values, (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(arrayPath), []);
        fields.value = currentValues.map(createEntry);
        updateEntryFlags();
    }
    initFields();
    function updateEntryFlags() {
        const fieldsLength = fields.value.length;
        for (let i = 0; i < fieldsLength; i++) {
            const entry = fields.value[i];
            entry.isFirst = i === 0;
            entry.isLast = i === fieldsLength - 1;
        }
    }
    function createEntry(value) {
        const key = entryCounter++;
        const entry = {
            key,
            value: (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
                const currentValues = getFromPath(form === null || form === void 0 ? void 0 : form.values, (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(arrayPath), []);
                const idx = fields.value.findIndex(e => e.key === key);
                return idx === -1 ? value : currentValues[idx];
            }),
            isFirst: false,
            isLast: false,
        };
        return entry;
    }
    function remove(idx) {
        const pathName = (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(arrayPath);
        const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
        if (!pathValue || !Array.isArray(pathValue)) {
            return;
        }
        const newValue = [...pathValue];
        newValue.splice(idx, 1);
        form === null || form === void 0 ? void 0 : form.unsetInitialValue(pathName + `[${idx}]`);
        form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, newValue);
        fields.value.splice(idx, 1);
        updateEntryFlags();
    }
    function push(value) {
        const pathName = (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(arrayPath);
        const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
        const normalizedPathValue = isNullOrUndefined(pathValue) ? [] : pathValue;
        if (!Array.isArray(normalizedPathValue)) {
            return;
        }
        const newValue = [...normalizedPathValue];
        newValue.push(value);
        form === null || form === void 0 ? void 0 : form.stageInitialValue(pathName + `[${newValue.length - 1}]`, value);
        form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, newValue);
        fields.value.push(createEntry(value));
        updateEntryFlags();
    }
    function swap(indexA, indexB) {
        const pathName = (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(arrayPath);
        const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
        if (!Array.isArray(pathValue) || !(indexA in pathValue) || !(indexB in pathValue)) {
            return;
        }
        const newValue = [...pathValue];
        const newFields = [...fields.value];
        // the old switcheroo
        const temp = newValue[indexA];
        newValue[indexA] = newValue[indexB];
        newValue[indexB] = temp;
        const tempEntry = newFields[indexA];
        newFields[indexA] = newFields[indexB];
        newFields[indexB] = tempEntry;
        form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, newValue);
        fields.value = newFields;
        updateEntryFlags();
    }
    function insert(idx, value) {
        const pathName = (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(arrayPath);
        const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
        if (!Array.isArray(pathValue) || pathValue.length < idx) {
            return;
        }
        const newValue = [...pathValue];
        const newFields = [...fields.value];
        newValue.splice(idx, 0, value);
        newFields.splice(idx, 0, createEntry(value));
        form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, newValue);
        fields.value = newFields;
        updateEntryFlags();
    }
    function replace(arr) {
        const pathName = (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(arrayPath);
        form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, arr);
        initFields();
    }
    function update(idx, value) {
        const pathName = (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(arrayPath);
        const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
        if (!Array.isArray(pathValue) || pathValue.length - 1 < idx) {
            return;
        }
        form === null || form === void 0 ? void 0 : form.setFieldValue(`${pathName}[${idx}]`, value);
    }
    function prepend(value) {
        const pathName = (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(arrayPath);
        const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
        const normalizedPathValue = isNullOrUndefined(pathValue) ? [] : pathValue;
        if (!Array.isArray(normalizedPathValue)) {
            return;
        }
        const newValue = [value, ...normalizedPathValue];
        form === null || form === void 0 ? void 0 : form.stageInitialValue(pathName + `[${newValue.length - 1}]`, value);
        form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, newValue);
        fields.value.unshift(createEntry(value));
        updateEntryFlags();
    }
    form.fieldArraysLookup[id] = {
        reset: initFields,
    };
    (0,vue__WEBPACK_IMPORTED_MODULE_0__.onBeforeUnmount)(() => {
        delete form.fieldArraysLookup[id];
    });
    return {
        fields: (0,vue__WEBPACK_IMPORTED_MODULE_0__.readonly)(fields),
        remove,
        push,
        swap,
        insert,
        update,
        replace,
        prepend,
    };
}

const FieldArrayImpl = (0,vue__WEBPACK_IMPORTED_MODULE_0__.defineComponent)({
    name: 'FieldArray',
    inheritAttrs: false,
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    setup(props, ctx) {
        const { push, remove, swap, insert, replace, update, prepend, fields } = useFieldArray((0,vue__WEBPACK_IMPORTED_MODULE_0__.toRef)(props, 'name'));
        function slotProps() {
            return {
                fields: fields.value,
                push,
                remove,
                swap,
                insert,
                update,
                replace,
                prepend,
            };
        }
        ctx.expose({
            push,
            remove,
            swap,
            insert,
            update,
            replace,
            prepend,
        });
        return () => {
            const children = normalizeChildren(undefined, ctx, slotProps);
            return children;
        };
    },
});
const FieldArray = FieldArrayImpl;

const ErrorMessageImpl = (0,vue__WEBPACK_IMPORTED_MODULE_0__.defineComponent)({
    name: 'ErrorMessage',
    props: {
        as: {
            type: String,
            default: undefined,
        },
        name: {
            type: String,
            required: true,
        },
    },
    setup(props, ctx) {
        const form = (0,vue__WEBPACK_IMPORTED_MODULE_0__.inject)(FormContextKey, undefined);
        const message = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
            return form === null || form === void 0 ? void 0 : form.errors.value[props.name];
        });
        function slotProps() {
            return {
                message: message.value,
            };
        }
        return () => {
            // Renders nothing if there are no messages
            if (!message.value) {
                return undefined;
            }
            const tag = (props.as ? (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDynamicComponent)(props.as) : props.as);
            const children = normalizeChildren(tag, ctx, slotProps);
            const attrs = Object.assign({ role: 'alert' }, ctx.attrs);
            // If no tag was specified and there are children
            // render the slot as is without wrapping it
            if (!tag && (Array.isArray(children) || !children) && (children === null || children === void 0 ? void 0 : children.length)) {
                return children;
            }
            // If no children in slot
            // render whatever specified and fallback to a <span> with the message in it's contents
            if ((Array.isArray(children) || !children) && !(children === null || children === void 0 ? void 0 : children.length)) {
                return (0,vue__WEBPACK_IMPORTED_MODULE_0__.h)(tag || 'span', attrs, message.value);
            }
            return (0,vue__WEBPACK_IMPORTED_MODULE_0__.h)(tag, attrs, children);
        };
    },
});
const ErrorMessage = ErrorMessageImpl;

function useResetForm() {
    const form = injectWithSelf(FormContextKey);
    if (!form) {
        warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
    }
    return function resetForm(state) {
        if (!form) {
            return;
        }
        return form.resetForm(state);
    };
}

/**
 * If a field is dirty or not
 */
function useIsFieldDirty(path) {
    const form = injectWithSelf(FormContextKey);
    let field = path ? undefined : (0,vue__WEBPACK_IMPORTED_MODULE_0__.inject)(FieldContextKey);
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        if (path) {
            field = normalizeField(form === null || form === void 0 ? void 0 : form.fieldsByPath.value[(0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path)]);
        }
        if (!field) {
            warn(`field with name ${(0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path)} was not found`);
            return false;
        }
        return field.meta.dirty;
    });
}

/**
 * If a field is touched or not
 */
function useIsFieldTouched(path) {
    const form = injectWithSelf(FormContextKey);
    let field = path ? undefined : (0,vue__WEBPACK_IMPORTED_MODULE_0__.inject)(FieldContextKey);
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        if (path) {
            field = normalizeField(form === null || form === void 0 ? void 0 : form.fieldsByPath.value[(0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path)]);
        }
        if (!field) {
            warn(`field with name ${(0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path)} was not found`);
            return false;
        }
        return field.meta.touched;
    });
}

/**
 * If a field is validated and is valid
 */
function useIsFieldValid(path) {
    const form = injectWithSelf(FormContextKey);
    let field = path ? undefined : (0,vue__WEBPACK_IMPORTED_MODULE_0__.inject)(FieldContextKey);
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        if (path) {
            field = normalizeField(form === null || form === void 0 ? void 0 : form.fieldsByPath.value[(0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path)]);
        }
        if (!field) {
            warn(`field with name ${(0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path)} was not found`);
            return false;
        }
        return field.meta.valid;
    });
}

/**
 * If the form is submitting or not
 */
function useIsSubmitting() {
    const form = injectWithSelf(FormContextKey);
    if (!form) {
        warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
    }
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        var _a;
        return (_a = form === null || form === void 0 ? void 0 : form.isSubmitting.value) !== null && _a !== void 0 ? _a : false;
    });
}

/**
 * Validates a single field
 */
function useValidateField(path) {
    const form = injectWithSelf(FormContextKey);
    let field = path ? undefined : (0,vue__WEBPACK_IMPORTED_MODULE_0__.inject)(FieldContextKey);
    return function validateField() {
        if (path) {
            field = normalizeField(form === null || form === void 0 ? void 0 : form.fieldsByPath.value[(0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path)]);
        }
        if (!field) {
            warn(`field with name ${(0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path)} was not found`);
            return Promise.resolve({
                errors: [],
                valid: true,
            });
        }
        return field.validate();
    };
}

/**
 * If the form is dirty or not
 */
function useIsFormDirty() {
    const form = injectWithSelf(FormContextKey);
    if (!form) {
        warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
    }
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        var _a;
        return (_a = form === null || form === void 0 ? void 0 : form.meta.value.dirty) !== null && _a !== void 0 ? _a : false;
    });
}

/**
 * If the form is touched or not
 */
function useIsFormTouched() {
    const form = injectWithSelf(FormContextKey);
    if (!form) {
        warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
    }
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        var _a;
        return (_a = form === null || form === void 0 ? void 0 : form.meta.value.touched) !== null && _a !== void 0 ? _a : false;
    });
}

/**
 * If the form has been validated and is valid
 */
function useIsFormValid() {
    const form = injectWithSelf(FormContextKey);
    if (!form) {
        warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
    }
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        var _a;
        return (_a = form === null || form === void 0 ? void 0 : form.meta.value.valid) !== null && _a !== void 0 ? _a : false;
    });
}

/**
 * Validate multiple fields
 */
function useValidateForm() {
    const form = injectWithSelf(FormContextKey);
    if (!form) {
        warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
    }
    return function validateField() {
        if (!form) {
            return Promise.resolve({ results: {}, errors: {}, valid: true });
        }
        return form.validate();
    };
}

/**
 * The number of form's submission count
 */
function useSubmitCount() {
    const form = injectWithSelf(FormContextKey);
    if (!form) {
        warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
    }
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        var _a;
        return (_a = form === null || form === void 0 ? void 0 : form.submitCount.value) !== null && _a !== void 0 ? _a : 0;
    });
}

/**
 * Gives access to a field's current value
 */
function useFieldValue(path) {
    const form = injectWithSelf(FormContextKey);
    // We don't want to use self injected context as it doesn't make sense
    const field = path ? undefined : (0,vue__WEBPACK_IMPORTED_MODULE_0__.inject)(FieldContextKey);
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        if (path) {
            return getFromPath(form === null || form === void 0 ? void 0 : form.values, (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path));
        }
        return (0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(field === null || field === void 0 ? void 0 : field.value);
    });
}

/**
 * Gives access to a form's values
 */
function useFormValues() {
    const form = injectWithSelf(FormContextKey);
    if (!form) {
        warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
    }
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        return (form === null || form === void 0 ? void 0 : form.values) || {};
    });
}

/**
 * Gives access to all form errors
 */
function useFormErrors() {
    const form = injectWithSelf(FormContextKey);
    if (!form) {
        warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
    }
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        return ((form === null || form === void 0 ? void 0 : form.errors.value) || {});
    });
}

/**
 * Gives access to a single field error
 */
function useFieldError(path) {
    const form = injectWithSelf(FormContextKey);
    // We don't want to use self injected context as it doesn't make sense
    const field = path ? undefined : (0,vue__WEBPACK_IMPORTED_MODULE_0__.inject)(FieldContextKey);
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
        if (path) {
            return form === null || form === void 0 ? void 0 : form.errors.value[(0,vue__WEBPACK_IMPORTED_MODULE_0__.unref)(path)];
        }
        return field === null || field === void 0 ? void 0 : field.errorMessage.value;
    });
}

function useSubmitForm(cb) {
    const form = injectWithSelf(FormContextKey);
    if (!form) {
        warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
    }
    const onSubmit = form ? form.handleSubmit(cb) : undefined;
    return function submitForm(e) {
        if (!onSubmit) {
            return;
        }
        return onSubmit(e);
    };
}




/***/ }),

/***/ "./resources/js/Pages lazy recursive ^\\.\\/.*$":
/*!************************************************************!*\
  !*** ./resources/js/Pages/ lazy ^\.\/.*$ namespace object ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./Auth/Login": [
		"./resources/js/Pages/Auth/Login.vue",
		"resources_js_Pages_Auth_Login_vue"
	],
	"./Auth/Login.vue": [
		"./resources/js/Pages/Auth/Login.vue",
		"resources_js_Pages_Auth_Login_vue"
	],
	"./Auth/Signup": [
		"./resources/js/Pages/Auth/Signup.vue",
		"resources_js_Pages_Auth_Signup_vue"
	],
	"./Auth/Signup.vue": [
		"./resources/js/Pages/Auth/Signup.vue",
		"resources_js_Pages_Auth_Signup_vue"
	],
	"./Home/Index": [
		"./resources/js/Pages/Home/Index.vue",
		"resources_js_Pages_Home_Index_vue"
	],
	"./Home/Index.vue": [
		"./resources/js/Pages/Home/Index.vue",
		"resources_js_Pages_Home_Index_vue"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(() => {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return __webpack_require__.e(ids[1]).then(() => {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = "./resources/js/Pages lazy recursive ^\\.\\/.*$";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "@inertiajs/inertia-vue3":
/*!******************************************!*\
  !*** external "@inertiajs/inertia-vue3" ***!
  \******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@inertiajs/inertia-vue3");

/***/ }),

/***/ "@inertiajs/server":
/*!************************************!*\
  !*** external "@inertiajs/server" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@inertiajs/server");

/***/ }),

/***/ "@vue/server-renderer":
/*!***************************************!*\
  !*** external "@vue/server-renderer" ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@vue/server-renderer");

/***/ }),

/***/ "svg-vue3":
/*!***************************!*\
  !*** external "svg-vue3" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("svg-vue3");

/***/ }),

/***/ "vue":
/*!**********************!*\
  !*** external "vue" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("vue");

/***/ }),

/***/ "vue/server-renderer":
/*!**************************************!*\
  !*** external "vue/server-renderer" ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = require("vue/server-renderer");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		__webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/js/ssr.js")))
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/sass/app.scss")))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames not based on template
/******/ 			if (chunkId === "css/app") return "" + chunkId + ".js";
/******/ 			// return url for filenames based on template
/******/ 			return "js/" + chunkId + ".js?id=" + {"resources_js_Pages_Auth_Login_vue":"16455459ce78e15b","resources_js_Pages_Auth_Signup_vue":"9a94bb84dadace98","resources_js_Pages_Home_Index_vue":"a72fc6411b491d34"}[chunkId] + "";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".css";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			"/js/ssr": 1,
/******/ 			"css/app": 1
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.O.require = (chunkId) => (installedChunks[chunkId]);
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 			__webpack_require__.O();
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if("css/app" != chunkId) {
/******/ 					installChunk(require("../../" + __webpack_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			__webpack_require__.e("css/app");
/******/ 			return next();
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;