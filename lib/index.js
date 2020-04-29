"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = _interopRequireDefault(require("./utils"));

var _deepClone = _interopRequireDefault(require("mout/lang/deepClone"));

var _deepEquals = _interopRequireDefault(require("mout/lang/deepEquals"));

var _chromaJs = _interopRequireDefault(require("chroma-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaults = {
  count: 5,
  hueMin: 0,
  hueMax: 360,
  chromaMin: 0,
  chromaMax: 100,
  lightMin: 0,
  lightMax: 100,
  quality: 50,
  samples: 800
};

var getClosestIndex = function getClosestIndex(colors, color) {
  var minDist = Number.MAX_SAFE_INTEGER;
  var nearest = 0;

  for (var idx = 0; idx < colors.length; idx += 1) {
    var sample = colors[idx];
    var dist = Math.sqrt(Math.pow(Math.abs(sample[0] - color[0]), 2) + Math.pow(Math.abs(sample[1] - color[1]), 2) + Math.pow(Math.abs(sample[2] - color[2]), 2));

    if (dist < minDist) {
      minDist = dist;
      nearest = idx;
    }
  }

  return nearest;
};

var checkColor = function checkColor(lab, options) {
  var color = _chromaJs["default"].lab(lab);

  var hcl = color.hcl();
  var rgb = color.rgb();

  var compLab = _chromaJs["default"].rgb(rgb).lab();

  var labTolerance = 2;
  return hcl[0] >= options.hueMin && hcl[0] <= options.hueMax && hcl[1] >= options.chromaMin && hcl[1] <= options.chromaMax && hcl[2] >= options.lightMin && hcl[2] <= options.lightMax && compLab[0] >= lab[0] - labTolerance && compLab[0] <= lab[0] + labTolerance && compLab[1] >= lab[1] - labTolerance && compLab[1] <= lab[1] + labTolerance && compLab[2] >= lab[2] - labTolerance && compLab[2] <= lab[2] + labTolerance;
};

var sortByContrast = function sortByContrast(colorList) {
  var unsortedColors = colorList.slice(0);
  var sortedColors = [unsortedColors.shift()];

  while (unsortedColors.length > 0) {
    var lastColor = sortedColors[sortedColors.length - 1];
    var nearest = 0;
    var maxDist = Number.MIN_SAFE_INTEGER;

    for (var i = 0; i < unsortedColors.length; i += 1) {
      var dist = Math.sqrt(Math.pow(Math.abs(lastColor[0] - unsortedColors[i][0]), 2) + Math.pow(Math.abs(lastColor[1] - unsortedColors[i][1]), 2) + Math.pow(Math.abs(lastColor[2] - unsortedColors[i][2]), 2));

      if (dist > maxDist) {
        maxDist = dist;
        nearest = i;
      }
    }

    sortedColors.push(unsortedColors.splice(nearest, 1)[0]);
  }

  return sortedColors;
};

var distinctColors = function distinctColors() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var options = _objectSpread({}, defaults, {}, opts);

  if (options.count <= 0) {
    return [];
  }

  if (options.samples < options.count * 3) {
    options.samples = Math.ceil(options.count * 3);
  }

  var colors = [];
  var zonesProto = [];
  var samples = new Set();
  var rangeDivider = Math.ceil(Math.cbrt(options.samples));
  var hStep = (options.hueMax - options.hueMin) / rangeDivider;
  var cStep = (options.chromaMax - options.chromaMin) / rangeDivider;
  var lStep = (options.lightMax - options.lightMin) / rangeDivider;

  if (hStep <= 0) {
    throw new Error('hueMax must be greater than hueMin!');
  }

  if (cStep <= 0) {
    throw new Error('chromaMax must be greater than chromaMin!');
  }

  if (lStep <= 0) {
    throw new Error('lightMax must be greater than lightMin!');
  }

  for (var h = options.hueMin + hStep / 2; h <= options.hueMax; h += hStep) {
    for (var c = options.chromaMin + cStep / 2; c <= options.chromaMax; c += cStep) {
      for (var l = options.lightMin + lStep / 2; l <= options.lightMax; l += lStep) {
        var color = _chromaJs["default"].hcl(h, c, l).lab();

        if (checkColor(color, options)) {
          samples.add(color.toString());
        }
      }
    }
  }

  samples = Array.from(samples);
  samples = samples.map(function (i) {
    return i.split(',').map(function (j) {
      return parseFloat(j);
    });
  });

  if (samples.length < options.count) {
    throw new Error('Not enough samples to generate palette, increase sample count.');
  }

  var sliceSize = Math.floor(samples.length / options.count);

  for (var i = 0; i < samples.length; i += sliceSize) {
    colors.push(samples[i]);
    zonesProto.push([]);

    if (colors.length >= options.count) {
      break;
    }
  }

  for (var step = 1; step <= options.quality; step += 1) {
    var zones = (0, _deepClone["default"])(zonesProto);
    var sampleList = (0, _deepClone["default"])(samples); // Immediately add the closest sample for each color

    for (var _i = 0; _i < colors.length; _i += 1) {
      var idx = getClosestIndex(sampleList, colors[_i]);

      zones[_i].push(sampleList[idx]);

      sampleList.splice(idx, 1);
    } // Find closest color for each remaining sample


    for (var _i2 = 0; _i2 < sampleList.length; _i2 += 1) {
      var sample = samples[_i2];
      var nearest = getClosestIndex(colors, sample);
      zones[nearest].push(samples[_i2]);
    }

    var lastColors = (0, _deepClone["default"])(colors);

    for (var _i3 = 0; _i3 < zones.length; _i3 += 1) {
      var zone = zones[_i3];
      var size = zone.length;
      var Ls = [];
      var As = [];
      var Bs = [];

      var _iterator = _createForOfIteratorHelper(zone),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _sample = _step.value;
          Ls.push(_sample[0]);
          As.push(_sample[1]);
          Bs.push(_sample[2]);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var lAvg = _utils["default"].sum(Ls) / size;
      var aAvg = _utils["default"].sum(As) / size;
      var bAvg = _utils["default"].sum(Bs) / size;
      colors[_i3] = [lAvg, aAvg, bAvg];
    }

    if ((0, _deepEquals["default"])(lastColors, colors)) {
      break;
    }
  }

  colors = sortByContrast(colors);
  return colors.map(function (lab) {
    return _chromaJs["default"].lab(lab);
  });
};

var _default = distinctColors;
exports["default"] = _default;