"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.highLatitudeAqrabulAyyamResolver = exports["default"] = void 0;
var _SolarTime = _interopRequireDefault(require("./SolarTime"));
var _DateUtils = require("./DateUtils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var HighLatitudeFajrRule = {
  Default: 'default',
  //Falls back to HighLatitudeRule
  AqrabYaum: 'aqrabyaum',
  //Uses Aqrab Youm
  MiddleOfTheNight: 'middleofthenight'
};
var _default = exports["default"] = HighLatitudeFajrRule;
var _highLatitudeAqrabulAyyamResolver = exports.highLatitudeAqrabulAyyamResolver = function highLatitudeAqrabulAyyamResolver(date, coordinates, fajrAngle) {
  var solarTime = new _SolarTime["default"](date, coordinates);
  if (isNaN(solarTime.hourAngle(-1 * fajrAngle, false))) {
    return _highLatitudeAqrabulAyyamResolver((0, _DateUtils.dateByAddingDays)(date, -1), coordinates, fajrAngle);
  } else {
    return date;
  }
};
//# sourceMappingURL=HighLatitudeFajrRule.js.map