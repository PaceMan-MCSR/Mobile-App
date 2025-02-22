export default interface Event {
  _id: string;
  name: string;
  starts: number[];
  ends: number[];
  whitelist: string[];
  vanity: string;
  host?: string;
  points?: PointDistribution[];
}
export interface PointDistribution {
  barrier: number;
  points: number;
}
