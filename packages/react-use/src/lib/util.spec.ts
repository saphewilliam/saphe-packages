import { isPromise } from './util';

describe('Util', () => {
  it('Detects a promise object', () => {
    expect(isPromise(new Promise(() => {}))).toBeTruthy();
    expect(isPromise({})).toBeFalsy();
    expect(isPromise({ hello: 'world' })).toBeFalsy();
    expect(isPromise('Hello world')).toBeFalsy();
    expect(isPromise(42)).toBeFalsy();
    expect(isPromise(true)).toBeFalsy();
    expect(isPromise('[object Promise]')).toBeFalsy();
  });
});
