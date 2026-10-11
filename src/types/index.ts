export interface CommissionRule {
  baseRate: number; // Ex: 3.5%
  enableAccelerator: boolean;
  acceleratorThreshold: number; // Ex: 100% da meta
  acceleratorRate: number; // Ex: 1.5% extra sobre o excedente
  superBonusThreshold: number; // Ex: 120% da meta
  superBonusFixed: number; // Ex: R$ 500 fixo para superação máxima
}

export interface SellerData {
  id: string;
  name: string;
  role: string;
  target: number; // Meta mensal em R$
  actualSales: number; // Faturamento realizado no mês em R$
  period: string; // Ex: "Setembro / 2026"
}

export interface CommissionCalculation {
  actualSales: number;
  target: number;
  attainmentPercent: number;
  baseCommission: number;
  acceleratorCommission: number;
  superBonusAmount: number;
  totalCommission: number;
  effectiveRate: number;
  status: 'abaixo' | 'quase' | 'atingida' | 'superada';
  surplus: number; // Valor vendido acima da meta
  gap: number; // Valor faltante para bater a meta
}

export interface SimulationResult {
  additionalSales: number;
  totalSimulatedSales: number;
  newAttainmentPercent: number;
  newTotalCommission: number;
  incrementalGain: number; // Quanto o vendedor ganha A MAIS
  unlockedAccelerator: boolean;
  unlockedSuperBonus: boolean;
}
