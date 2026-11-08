import { describe, it, expect } from 'vitest';
import {
  calculateCommission,
  simulateWhatIf,
  formatBRL,
  formatPercent,
} from './commissionEngine';
import type { CommissionRule } from '../types';

const defaultRule: CommissionRule = {
  baseRate: 3.5, // 3.5%
  enableAccelerator: true,
  acceleratorThreshold: 100, // 100%
  acceleratorRate: 1.5, // 1.5% no excedente
  superBonusThreshold: 120, // 120%
  superBonusFixed: 500, // R$ 500
};

describe('commissionEngine - calculateCommission', () => {
  it('calculates base commission correctly when sales are below 80% (status: abaixo)', () => {
    const result = calculateCommission(50000, 100000, defaultRule);

    expect(result.actualSales).toBe(50000);
    expect(result.target).toBe(100000);
    expect(result.attainmentPercent).toBe(50);
    expect(result.baseCommission).toBe(1750); // 50000 * 3.5%
    expect(result.acceleratorCommission).toBe(0);
    expect(result.superBonusAmount).toBe(0);
    expect(result.totalCommission).toBe(1750);
    expect(result.status).toBe('abaixo');
    expect(result.gap).toBe(50000);
    expect(result.surplus).toBe(0);
  });

  it('sets status to "quase" when attainment is between 80% and 99.9%', () => {
    const result = calculateCommission(85000, 100000, defaultRule);

    expect(result.attainmentPercent).toBe(85);
    expect(result.status).toBe('quase');
    expect(result.gap).toBe(15000);
    expect(result.acceleratorCommission).toBe(0);
  });

  it('calculates exactly 100% target achievement (status: atingida)', () => {
    const result = calculateCommission(100000, 100000, defaultRule);

    expect(result.attainmentPercent).toBe(100);
    expect(result.status).toBe('atingida');
    expect(result.gap).toBe(0);
    expect(result.surplus).toBe(0);
    expect(result.acceleratorCommission).toBe(0);
    expect(result.totalCommission).toBe(3500); // 100000 * 3.5%
  });

  it('calculates accelerator commission on surplus when above 100%', () => {
    const result = calculateCommission(110000, 100000, defaultRule);

    expect(result.attainmentPercent).toBe(110);
    expect(result.status).toBe('atingida');
    expect(result.surplus).toBe(10000);
    expect(result.baseCommission).toBe(3850); // 110000 * 3.5%
    expect(result.acceleratorCommission).toBe(150); // 10000 * 1.5%
    expect(result.superBonusAmount).toBe(0);
    expect(result.totalCommission).toBe(4000);
  });

  it('does not apply accelerator if enableAccelerator is false', () => {
    const ruleWithoutAcc: CommissionRule = {
      ...defaultRule,
      enableAccelerator: false,
    };
    const result = calculateCommission(110000, 100000, ruleWithoutAcc);

    expect(result.acceleratorCommission).toBe(0);
    expect(result.totalCommission).toBe(3850);
  });

  it('awards super bonus when attainment reaches superBonusThreshold (status: superada)', () => {
    const result = calculateCommission(125000, 100000, defaultRule);

    expect(result.attainmentPercent).toBe(125);
    expect(result.status).toBe('superada');
    expect(result.surplus).toBe(25000);
    expect(result.baseCommission).toBe(4375); // 125000 * 3.5%
    expect(result.acceleratorCommission).toBe(375); // 25000 * 1.5%
    expect(result.superBonusAmount).toBe(500); // Super bônus fixo
    expect(result.totalCommission).toBe(5250); // 4375 + 375 + 500
  });

  it('handles edge case: zero or negative sales gracefully', () => {
    const zeroResult = calculateCommission(0, 100000, defaultRule);
    expect(zeroResult.actualSales).toBe(0);
    expect(zeroResult.totalCommission).toBe(0);
    expect(zeroResult.effectiveRate).toBe(0);
    expect(zeroResult.status).toBe('abaixo');

    const negResult = calculateCommission(-500, 100000, defaultRule);
    expect(negResult.actualSales).toBe(0);
    expect(negResult.totalCommission).toBe(0);
  });

  it('handles edge case: target is zero or negative by falling back to 1', () => {
    const result = calculateCommission(5000, 0, defaultRule);
    expect(result.target).toBe(1);
    expect(result.attainmentPercent).toBeGreaterThan(100);
  });
});

describe('commissionEngine - simulateWhatIf', () => {
  it('correctly simulates additional sales and detects unlocked accelerator', () => {
    // Current sales: 90,000 (90% - under 100%), Additional sales: 15,000 -> Total: 105,000 (105%)
    const sim = simulateWhatIf(90000, 15000, 100000, defaultRule);

    expect(sim.totalSimulatedSales).toBe(105000);
    expect(sim.newAttainmentPercent).toBe(105);
    expect(sim.unlockedAccelerator).toBe(true);
    expect(sim.unlockedSuperBonus).toBe(false);
    expect(sim.incrementalGain).toBeGreaterThan(0);
  });

  it('detects unlocked super bonus when jumping over 120%', () => {
    // Current sales: 105,000 (105%), Additional sales: 20,000 -> Total: 125,000 (125%)
    const sim = simulateWhatIf(105000, 20000, 100000, defaultRule);

    expect(sim.totalSimulatedSales).toBe(125000);
    expect(sim.newAttainmentPercent).toBe(125);
    expect(sim.unlockedAccelerator).toBe(false); // Already was under accelerator
    expect(sim.unlockedSuperBonus).toBe(true);
    expect(sim.incrementalGain).toBeGreaterThan(500);
  });
});

describe('commissionEngine - Formatting Helpers', () => {
  it('formats percent correctly', () => {
    expect(formatPercent(95.456)).toBe('95.5%');
    expect(formatPercent(0)).toBe('0.0%');
  });

  it('formats BRL currency correctly', () => {
    const formatted = formatBRL(1500);
    expect(formatted).toContain('1.500');
    expect(formatted).toContain('R$');
  });
});
