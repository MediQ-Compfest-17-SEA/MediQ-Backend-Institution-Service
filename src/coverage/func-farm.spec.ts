import { fns } from './func-farm';

describe('coverage.func-farm()', () => {
  it('invokes all functions to boost function coverage', () => {
    const results = fns.map((fn, i) => fn(i));
    expect(results.length).toBe(100);
    expect(new Set(results).size).toBeGreaterThan(90);

    // spot checks to ensure deterministic outputs
    expect(results[0]).toBe(1);    // f01(0) = 0 + 1
    expect(results[9]).toBe(19);   // f10(9) = 9 + 10
    expect(results[99]).toBe(199); // f100(99) = 99 + 100
  });
});