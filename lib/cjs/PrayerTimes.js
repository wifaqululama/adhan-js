"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _SolarTime = _interopRequireDefault(require("./SolarTime"));
var _TimeComponents = _interopRequireDefault(require("./TimeComponents"));
var _Prayer = _interopRequireDefault(require("./Prayer"));
var _Astronomical = _interopRequireDefault(require("./Astronomical"));
var _DateUtils = require("./DateUtils");
var _Madhab = require("./Madhab");
var _PolarCircleResolution = require("./PolarCircleResolution");
var _HighLatitudeFajrRule = _interopRequireWildcard(require("./HighLatitudeFajrRule"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var PrayerTimes = exports["default"] = /*#__PURE__*/function () {
  // eslint-disable-next-line complexity
  function PrayerTimes(coordinates, date, calculationParameters) {
    _classCallCheck(this, PrayerTimes);
    this.coordinates = coordinates;
    this.date = date;
    this.calculationParameters = calculationParameters;
    var solarTime = new _SolarTime["default"](date, coordinates);
    var fajrTime;
    var sunriseTime;
    var dhuhrTime;
    var asrTime;
    var sunsetTime;
    var maghribTime;
    var ishaTime;
    var nightFraction;
    dhuhrTime = new _TimeComponents["default"](solarTime.transit).utcDate(date);
    sunriseTime = new _TimeComponents["default"](solarTime.sunrise).utcDate(date);
    sunsetTime = new _TimeComponents["default"](solarTime.sunset).utcDate(date);
    var tomorrow = (0, _DateUtils.dateByAddingDays)(date, 1);
    var tomorrowSolarTime = new _SolarTime["default"](tomorrow, coordinates);
    var polarCircleResolver = calculationParameters.polarCircleResolution;
    if ((!(0, _DateUtils.isValidDate)(sunriseTime) || !(0, _DateUtils.isValidDate)(sunsetTime) || isNaN(tomorrowSolarTime.sunrise)) && polarCircleResolver !== _PolarCircleResolution.PolarCircleResolution.Unresolved) {
      var resolved = (0, _PolarCircleResolution.polarCircleResolvedValues)(polarCircleResolver, date, coordinates);
      solarTime = resolved.solarTime;
      tomorrowSolarTime = resolved.tomorrowSolarTime;
      dhuhrTime = new _TimeComponents["default"](solarTime.transit).utcDate(date);
      sunriseTime = new _TimeComponents["default"](solarTime.sunrise).utcDate(date);
      sunsetTime = new _TimeComponents["default"](solarTime.sunset).utcDate(date);
    }

    // eslint-disable-next-line prefer-const
    asrTime = new _TimeComponents["default"](solarTime.afternoon((0, _Madhab.shadowLength)(calculationParameters.madhab))).utcDate(date);
    var tomorrowSunrise = new _TimeComponents["default"](tomorrowSolarTime.sunrise).utcDate(tomorrow);
    var night = (Number(tomorrowSunrise) - Number(sunsetTime)) / 1000;
    fajrTime = new _TimeComponents["default"](solarTime.hourAngle(-1 * calculationParameters.fajrAngle, false)).utcDate(date);

    // special case for moonsighting committee above latitude 55
    if (calculationParameters.method === 'MoonsightingCommittee' && coordinates.latitude >= 55) {
      nightFraction = night / 7;
      fajrTime = (0, _DateUtils.dateByAddingSeconds)(sunriseTime, -nightFraction);
    }
    var safeFajr = function () {
      if (calculationParameters.method === 'MoonsightingCommittee') {
        return _Astronomical["default"].seasonAdjustedMorningTwilight(coordinates.latitude, (0, _DateUtils.dayOfYear)(date), date.getFullYear(), sunriseTime);
      } else if (calculationParameters.method === 'UnitedKingdom' && !isNaN(fajrTime.getTime())) {
        return fajrTime;
      } else if (calculationParameters.highLatitudeFajrRule === _HighLatitudeFajrRule["default"].AqrabYaum && isNaN(solarTime.hourAngle(-1 * calculationParameters.fajrAngle, false))) {
        var lastFajrDate = (0, _HighLatitudeFajrRule.highLatitudeAqrabulAyyamResolver)(date, coordinates, calculationParameters.fajrAngle);
        var lastFajrSolarTime = new _SolarTime["default"](lastFajrDate, coordinates);
        return new _TimeComponents["default"](lastFajrSolarTime.hourAngle(-1 * calculationParameters.fajrAngle, false)).utcDate(date);
      } else {
        var portion = calculationParameters.nightPortions().fajr;
        nightFraction = portion * night;
        return (0, _DateUtils.dateByAddingSeconds)(sunriseTime, -nightFraction);
      }
    }();
    if (isNaN(fajrTime.getTime()) || safeFajr > fajrTime) {
      fajrTime = safeFajr;
    }
    if (calculationParameters.ishaInterval > 0) {
      ishaTime = (0, _DateUtils.dateByAddingMinutes)(sunsetTime, calculationParameters.ishaInterval);
    } else {
      ishaTime = new _TimeComponents["default"](solarTime.hourAngle(-1 * calculationParameters.ishaAngle, true)).utcDate(date);

      // special case for moonsighting committee above latitude 55
      if (calculationParameters.method === 'MoonsightingCommittee' && coordinates.latitude >= 55) {
        nightFraction = night / 7;
        ishaTime = (0, _DateUtils.dateByAddingSeconds)(sunsetTime, nightFraction);
      }
      var safeIsha = function () {
        if (calculationParameters.method === 'MoonsightingCommittee') {
          return _Astronomical["default"].seasonAdjustedEveningTwilight(coordinates.latitude, (0, _DateUtils.dayOfYear)(date), date.getFullYear(), sunsetTime, calculationParameters.shafaq);
        } else {
          var portion = calculationParameters.nightPortions().isha;
          nightFraction = portion * night;
          return (0, _DateUtils.dateByAddingSeconds)(sunsetTime, nightFraction);
        }
      }();
      if (isNaN(ishaTime.getTime()) || safeIsha < ishaTime) {
        ishaTime = safeIsha;
      }
    }
    maghribTime = sunsetTime;
    if (calculationParameters.maghribAngle) {
      var angleBasedMaghrib = new _TimeComponents["default"](solarTime.hourAngle(-1 * calculationParameters.maghribAngle, true)).utcDate(date);
      if (sunsetTime < angleBasedMaghrib && ishaTime > angleBasedMaghrib) {
        maghribTime = angleBasedMaghrib;
      }
    }
    var fajrAdjustment = (calculationParameters.adjustments.fajr || 0) + (calculationParameters.methodAdjustments.fajr || 0);
    var sunriseAdjustment = (calculationParameters.adjustments.sunrise || 0) + (calculationParameters.methodAdjustments.sunrise || 0);
    var dhuhrAdjustment = (calculationParameters.adjustments.dhuhr || 0) + (calculationParameters.methodAdjustments.dhuhr || 0);
    var asrAdjustment = (calculationParameters.adjustments.asr || 0) + (calculationParameters.methodAdjustments.asr || 0);
    var maghribAdjustment = (calculationParameters.adjustments.maghrib || 0) + (calculationParameters.methodAdjustments.maghrib || 0);
    var ishaAdjustment = (calculationParameters.adjustments.isha || 0) + (calculationParameters.methodAdjustments.isha || 0);
    this.fajr = (0, _DateUtils.roundedMinute)((0, _DateUtils.dateByAddingMinutes)(fajrTime, fajrAdjustment), calculationParameters.rounding);
    this.sunrise = (0, _DateUtils.roundedMinute)((0, _DateUtils.dateByAddingMinutes)(sunriseTime, sunriseAdjustment), calculationParameters.rounding);
    this.dhuhr = (0, _DateUtils.roundedMinute)((0, _DateUtils.dateByAddingMinutes)(dhuhrTime, dhuhrAdjustment), calculationParameters.rounding);
    this.asr = (0, _DateUtils.roundedMinute)((0, _DateUtils.dateByAddingMinutes)(asrTime, asrAdjustment), calculationParameters.rounding);
    this.sunset = (0, _DateUtils.roundedMinute)(sunsetTime, calculationParameters.rounding);
    this.maghrib = (0, _DateUtils.roundedMinute)((0, _DateUtils.dateByAddingMinutes)(maghribTime, maghribAdjustment), calculationParameters.rounding);
    this.isha = (0, _DateUtils.roundedMinute)((0, _DateUtils.dateByAddingMinutes)(ishaTime, ishaAdjustment), calculationParameters.rounding);
  }
  return _createClass(PrayerTimes, [{
    key: "timeForPrayer",
    value: function timeForPrayer(prayer) {
      if (prayer === _Prayer["default"].Fajr) {
        return this.fajr;
      } else if (prayer === _Prayer["default"].Sunrise) {
        return this.sunrise;
      } else if (prayer === _Prayer["default"].Dhuhr) {
        return this.dhuhr;
      } else if (prayer === _Prayer["default"].Asr) {
        return this.asr;
      } else if (prayer === _Prayer["default"].Maghrib) {
        return this.maghrib;
      } else if (prayer === _Prayer["default"].Isha) {
        return this.isha;
      } else {
        return null;
      }
    }
  }, {
    key: "currentPrayer",
    value: function currentPrayer() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
      if (date >= this.isha) {
        return _Prayer["default"].Isha;
      } else if (date >= this.maghrib) {
        return _Prayer["default"].Maghrib;
      } else if (date >= this.asr) {
        return _Prayer["default"].Asr;
      } else if (date >= this.dhuhr) {
        return _Prayer["default"].Dhuhr;
      } else if (date >= this.sunrise) {
        return _Prayer["default"].Sunrise;
      } else if (date >= this.fajr) {
        return _Prayer["default"].Fajr;
      } else {
        return _Prayer["default"].None;
      }
    }
  }, {
    key: "nextPrayer",
    value: function nextPrayer() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
      if (date >= this.isha) {
        return _Prayer["default"].None;
      } else if (date >= this.maghrib) {
        return _Prayer["default"].Isha;
      } else if (date >= this.asr) {
        return _Prayer["default"].Maghrib;
      } else if (date >= this.dhuhr) {
        return _Prayer["default"].Asr;
      } else if (date >= this.sunrise) {
        return _Prayer["default"].Dhuhr;
      } else if (date >= this.fajr) {
        return _Prayer["default"].Sunrise;
      } else {
        return _Prayer["default"].Fajr;
      }
    }
  }]);
}();
//# sourceMappingURL=PrayerTimes.js.map