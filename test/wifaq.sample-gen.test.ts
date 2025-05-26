import Coordinates from '../src/Coordinates';
import CalculationMethod from '../src/CalculationMethod';
import PrayerTimes from '../src/PrayerTimes';
import HighLatitudeFajrRule from '../src/HighLatitudeFajrRule';

describe('Wifaq Annual Sample Gather Test', () => {
  it('Print annual data', () => {
    // const londonCoordinates = new Coordinates(52.575825, -1.989605);
    const londonCoordinates = new Coordinates(51.507194, -0.116711);
    const params = CalculationMethod.UnitedKingdom();
    params.highLatitudeFajrRule = HighLatitudeFajrRule.AqrabYaum;
    const arr = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(2024, i, 1, 12);
      const prayerTimes = new PrayerTimes(londonCoordinates, date, params);
      const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0]; // Format date as "YYYY-MM-DD"
      };

      const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }); // Format time as "hh:mm AM/PM"
      };

      const data = {
        date: formatDate(date),
        fajr: formatTime(prayerTimes.fajr),
        sunrise: formatTime(prayerTimes.sunrise),
        dhuhr: formatTime(prayerTimes.dhuhr),
        asr: formatTime(prayerTimes.asr),
        maghrib: formatTime(prayerTimes.maghrib),
        isha: formatTime(prayerTimes.isha),
      };
      arr.push(data);
    }
    console.log(JSON.stringify(arr));
  });
});
