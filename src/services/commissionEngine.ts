import type { CommissionCalculation, CommissionRule, SimulationResult } from '../types';

export function calculateCommission(
  sales: number,
  target: number,
  rule: CommissionRule
): CommissionCalculation {
  const safeSales = Math.max(0, sales || 0);
  const safeTarget = Math.max(1, target || 1);

  const attainmentPercent = (safeSales / safeTarget) * 100;
  const baseCommission = safeSales * (rule.baseRate / 100);

  // Acelerador: incide sobre o faturamento que ultrapassar a meta (100%)
  let acceleratorCommission = 0;
  const surplus = Math.max(0, safeSales - safeTarget);
  const gap = Math.max(0, safeTarget - safeSales);

  if (rule.enableAccelerator && attainmentPercent >= rule.acceleratorThreshold && surplus > 0) {
    acceleratorCommission = surplus * (rule.acceleratorRate / 100);
  }

  // Bônus Fixo de Superação Máxima (ex: acima de 120%)
  let superBonusAmount = 0;
  if (rule.superBonusThreshold > 0 && attainmentPercent >= rule.superBonusThreshold) {
    superBonusAmount = rule.superBonusFixed;
  }

  const totalCommission = baseCommission + acceleratorCommission + superBonusAmount;
  const effectiveRate = safeSales > 0 ? (totalCommission / safeSales) * 100 : 0;

  let status: 'abaixo' | 'quase' | 'atingida' | 'superada';
  if (attainmentPercent >= rule.superBonusThreshold) {
    status = 'superada';
  } else if (attainmentPercent >= rule.acceleratorThreshold) {
    status = 'atingida';
  } else if (attainmentPercent >= 80) {
    status = 'quase';
  } else {
    status = 'abaixo';
  }

  return {
    actualSales: safeSales,
    target: safeTarget,
    attainmentPercent,
    baseCommission,
    acceleratorCommission,
    superBonusAmount,
    totalCommission,
    effectiveRate,
    status,
    surplus,
    gap,
  };
}

export function simulateWhatIf(
  currentSales: number,
  additionalSales: number,
  target: number,
  rule: CommissionRule
): SimulationResult {
  const currentCalc = calculateCommission(currentSales, target, rule);
  const totalSimulated = currentSales + Math.max(0, additionalSales || 0);
  const simCalc = calculateCommission(totalSimulated, target, rule);

  const incrementalGain = simCalc.totalCommission - currentCalc.totalCommission;
  const wasUnderAccelerator = currentCalc.attainmentPercent < rule.acceleratorThreshold;
  const isNowUnderAccelerator = simCalc.attainmentPercent >= rule.acceleratorThreshold;

  const wasUnderSuper = currentCalc.attainmentPercent < rule.superBonusThreshold;
  const isNowUnderSuper = simCalc.attainmentPercent >= rule.superBonusThreshold;

  return {
    additionalSales,
    totalSimulatedSales: totalSimulated,
    newAttainmentPercent: simCalc.attainmentPercent,
    newTotalCommission: simCalc.totalCommission,
    incrementalGain,
    unlockedAccelerator: wasUnderAccelerator && isNowUnderAccelerator,
    unlockedSuperBonus: wasUnderSuper && isNowUnderSuper,
  };
}

export function formatBRL(val: number): string {
  return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatPercent(val: number): string {
  return `${(val || 0).toFixed(1)}%`;
}
