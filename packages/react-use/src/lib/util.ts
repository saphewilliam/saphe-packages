// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPromise<T>(obj: any): obj is Promise<T> {
  return typeof obj !== 'string' && String(obj) === '[object Promise]';
}
