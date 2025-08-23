import { classifyPair, evaluateFlags, decisionGrid, toggleEvaluator } from './branch-booster';

describe('coverage.branch-booster.classifyPair()', () => {
  it('categorizes POS, NEG, MIX', () => {
    expect(classifyPair(5, 7)).toMatch(/^POS\|/);
    expect(classifyPair(-1, 0)).toMatch(/^NEG\|/);
    expect(classifyPair(0, 0)).toMatch(/^MIX\|/);
  });

  it('covers magnitude HH, HL, LH, LL', () => {
    expect(classifyPair(11, 20)).toContain('|HH|');
    expect(classifyPair(12, 10)).toContain('|HL|');
    expect(classifyPair(10, 12)).toContain('|LH|');
    expect(classifyPair(5, 9)).toContain('|LL|');
  });

  it('covers switch mod A, B, C', () => {
    expect(classifyPair(3, 0)).toContain('|A|');
    expect(classifyPair(4, 0)).toContain('|B|');
    expect(classifyPair(5, 0)).toContain('|C|');
  });

  it('covers logical flags AB, A, B, G, N', () => {
    expect(classifyPair(1, 1, { alpha: true, beta: true })).toContain('|AB|');
    expect(classifyPair(1, 1, { alpha: true, beta: false })).toContain('|A|');
    expect(classifyPair(1, 1, { alpha: false, beta: true })).toContain('|B|');
    expect(classifyPair(1, 1, { alpha: false, beta: false, gamma: true })).toContain('|G|');
    expect(classifyPair(1, 1, { alpha: false, beta: false, gamma: false })).toContain('|N|');
  });

  it('covers mode label MX, MY, MZ (with nullish default)', () => {
    expect(classifyPair(1, 1, { mode: 'X' })).toContain('|MX|');
    expect(classifyPair(1, 1, { mode: 'Y' })).toContain('|MY|');
    expect(classifyPair(1, 1, { mode: 'Z' })).toContain('|MZ|');
    expect(classifyPair(1, 1, { mode: null as any })).toContain('|MZ|');
    expect(classifyPair(1, 1, {})).toContain('|MZ|');
  });

  it('covers equality and sign parity endings', () => {
    expect(classifyPair(2, 2)).toMatch(/\|EQ\|EE$/);
    expect(classifyPair(2, 3)).toMatch(/\|NE\|EO$/);
    expect(classifyPair(3, 2)).toMatch(/\|NE\|OE$/);
    expect(classifyPair(3, 3)).toMatch(/\|EQ\|OO$/);
  });
});

describe('coverage.branch-booster.evaluateFlags()', () => {
  it('switches on modes X,Y,Z,default distinctly', () => {
    const base = evaluateFlags({ alpha: false, beta: false, gamma: false, mode: undefined as any });
    const mx = evaluateFlags({ alpha: false, beta: false, gamma: false, mode: 'X' });
    const my = evaluateFlags({ alpha: false, beta: false, gamma: false, mode: 'Y' });
    const mz = evaluateFlags({ alpha: false, beta: false, gamma: false, mode: 'Z' });

    expect(new Set([base, mx, my, mz]).size).toBe(4);
  });

  it('logical combination changes score', () => {
    const t = evaluateFlags({ alpha: true, beta: false, gamma: false, mode: 'Y' });
    const f = evaluateFlags({ alpha: false, beta: false, gamma: false, mode: 'Y' });
    expect(t).not.toEqual(f);
  });
});

describe('coverage.branch-booster.decisionGrid()', () => {
  it('x>0: y==0 even/odd, y>0 mod 0/1/2, y<0 hi/lo', () => {
    expect(decisionGrid(1, 0, 2)).toBe('PZE'); // even
    expect(decisionGrid(1, 0, 3)).toBe('PZO'); // odd
    expect(decisionGrid(1, 3, 0)).toBe('PPA'); // 3 % 3 == 0
    expect(decisionGrid(1, 4, 0)).toBe('PPB'); // 4 % 3 == 1
    expect(decisionGrid(1, 5, 0)).toBe('PPC'); // 5 % 3 == 2
    expect(decisionGrid(1, -1, 11)).toBe('PNH'); // high
    expect(decisionGrid(1, -1, 5)).toBe('PNL'); // low
  });

  it('x==0 and x<0 branches', () => {
    expect(decisionGrid(0, -1, 0)).toBe('ZN0');
    expect(decisionGrid(0, 2, 5)).toBe('ZPX');
    expect(decisionGrid(-1, -2, -3)).toBe('ND');
    expect(decisionGrid(-1, -2, 3)).toBe('NS');
    expect(decisionGrid(-1, 2, 3)).toBe('NM');
  });
});

describe('coverage.branch-booster.toggleEvaluator()', () => {
  it('covers A/B/C/default and compound branch', () => {
    const a = toggleEvaluator(true, false, false, 'A');
    const b = toggleEvaluator(false, true, false, 'B');
    const c = toggleEvaluator(false, false, false, 'C');
    const d = toggleEvaluator(false, false, false, 'D' as any); // default path
    const custom = toggleEvaluator(false, false, true, 'A'); // triggers compound true

    expect(new Set([a, b, c, d, custom]).size).toBeGreaterThan(3);
    expect(custom).not.toEqual(c);
  });
});