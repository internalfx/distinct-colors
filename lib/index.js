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

    for (var i = 0; i < unsortedColors.length; i++) {
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

  if (options.samples < options.count * 5) {
    options.samples = options.count * 5;
  }

  var colors = [];
  var zonesProto = [];
  var samples = new Set();
  var rangeDivider = Math.cbrt(options.samples);
  rangeDivider *= 1.001;
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

  for (var h = options.hueMin; h <= options.hueMax; h += hStep) {
    for (var c = options.chromaMin; c <= options.chromaMax; c += cStep) {
      for (var l = options.lightMin; l <= options.lightMax; l += lStep) {
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

  for (var step = 1; step <= options.quality; step++) {
    var zones = (0, _deepClone["default"])(zonesProto); // Find closest color for each sample

    for (var _i = 0; _i < samples.length; _i++) {
      var minDist = Number.MAX_SAFE_INTEGER;
      var nearest = 0;
      var sample = samples[_i];

      for (var j = 0; j < colors.length; j++) {
        var _color = colors[j];
        var dist = Math.sqrt(Math.pow(Math.abs(sample[0] - _color[0]), 2) + Math.pow(Math.abs(sample[1] - _color[1]), 2) + Math.pow(Math.abs(sample[2] - _color[2]), 2));

        if (dist < minDist) {
          minDist = dist;
          nearest = j;
        }
      }

      zones[nearest].push(samples[_i]);
    }

    var lastColors = (0, _deepClone["default"])(colors);

    for (var _i2 = 0; _i2 < zones.length; _i2++) {
      var zone = zones[_i2];
      var size = zone.length;
      var Ls = [];
      var As = [];
      var Bs = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = zone[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _sample = _step.value;
          Ls.push(_sample[0]);
          As.push(_sample[1]);
          Bs.push(_sample[2]);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var lAvg = _utils["default"].sum(Ls) / size;
      var aAvg = _utils["default"].sum(As) / size;
      var bAvg = _utils["default"].sum(Bs) / size;
      colors[_i2] = [lAvg, aAvg, bAvg];
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