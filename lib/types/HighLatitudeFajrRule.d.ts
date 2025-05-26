import type Coordinates from './Coordinates';
declare const HighLatitudeFajrRule: {
    Default: string;
    AqrabYaum: string;
    MiddleOfTheNight: string;
};
export default HighLatitudeFajrRule;
export declare const highLatitudeAqrabulAyyamResolver: (date: Date, coordinates: Coordinates, fajrAngle: number) => Date;
