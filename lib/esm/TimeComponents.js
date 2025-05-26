export default class TimeComponents {
  constructor(num) {
    this.hours = Math.floor(num);
    this.minutes = Math.floor((num - this.hours) * 60);
    this.seconds = Math.floor((num - (this.hours + this.minutes / 60)) * 60 * 60);
    return this;
  }
  utcDate(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), this.hours, this.minutes, this.seconds));
  }
}
//# sourceMappingURL=TimeComponents.js.map