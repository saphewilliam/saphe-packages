import { Util } from '../src';

describe('Util', () => {
  it('detects a promise object', () => {
    const p = Util.isPromise;
    expect(p(new Promise<void>((r) => r()))).toBeTruthy();
    expect(p({})).toBeFalsy();
    expect(p({ hello: 'world' })).toBeFalsy();
    expect(p('Hello world')).toBeFalsy();
    expect(p(42)).toBeFalsy();
    expect(p(true)).toBeFalsy();
    expect(p('[object Promise]')).toBeFalsy();
  });
});
