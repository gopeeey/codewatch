import { timezones } from "./timezones";

export function interpolate(
  x: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number
) {
  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0); // returns y
}

// Selects a random number between two numbers a and b
export function randNumBtw(a: number, b: number) {
  const rand = Math.random();
  return interpolate(rand, 0, 1, a, b);
}

export function randomChoice<T>(arr: T[]): T {
  return arr[randNumBtw(0, arr.length - 1)];
}

export function randomBoolean() {
  return Math.random() >= 0.5;
}

export function getTimezoneString(offset: number) {
  const sign = offset >= 0 ? "" : "-";
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;
  const key = `${sign}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:00`;
  return timezones[key];
}
