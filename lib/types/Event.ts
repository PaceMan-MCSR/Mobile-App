export default interface Event {
  _id: string;
  name: string;
  starts: number[];
  ends: number[];
  whitelist: string[];
  vanity: string;
  points?: Points[];
  host?: string;
}
interface Points {
  barrier: number;
  points: number;
}
