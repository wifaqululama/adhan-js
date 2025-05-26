import SolarTime from './SolarTime';
import { dateByAddingDays } from './DateUtils';
const HighLatitudeFajrRule = {
  Default: 'default',
  //Falls back to HighLatitudeRule
  AqrabYaum: 'aqrabyaum',
  //Uses Aqrab Youm
  MiddleOfTheNight: 'middleofthenight'
};
export default HighLatitudeFajrRule;
export const highLatitudeAqrabulAyyamResolver = (date, coordinates, fajrAngle) => {
  const solarTime = new SolarTime(date, coordinates);
  if (isNaN(solarTime.hourAngle(-1 * fajrAngle, false))) {
    return highLatitudeAqrabulAyyamResolver(dateByAddingDays(date, -1), coordinates, fajrAngle);
  } else {
    return date;
  }
};
//# sourceMappingURL=HighLatitudeFajrRule.js.map