import React, { useState } from 'react';
import type { CommissionCalculation, CommissionRule, SellerData } from '../types';
import { formatBRL, formatPercent, simulateWhatIf } from '../services/commissionEngine';

interface WhatIfSimulatorProps {
  seller: SellerData;
  currentCalculation: CommissionCalculation;
  rule: CommissionRule;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  seller,
  currentCalculation,
  rule,
}) => {
  const [additionalSales, setAdditionalSales] = useState<number>(10000);

  const simulation = simulateWhatIf(
    seller.actualSales,
    additionalSales,
    seller.target,
    rule
  );

  const handleChipClick = (amount: number) => {
    setAdditionalSales(amount);
  };

  const quickChips = [3000, 5000, 10000, 15000, 25000];

  return (
    <div className="simulator-content space-y-6">
      {/* Top Banner Explicativo */}
      <div className="simulator-header-card">
        <div>
          <span className="badge badge-primary">Ferramenta de Incentivo & Projeção</span>
          <h2 className="text-xl font-bold mt-2">Simulador Interativo: "E se eu fechar mais vendas?"</h2>
          <p className="text-sm text-muted mt-1">
            Projete o impacto financeiro imediato de novas oportunidades no seu bolso e no atingimento da sua meta.
          </p>
        </div>
      </div>

      <div className="grid-2-cols">
        {/* Painel de Controle da Projeção */}
        <div className="card space-y-5">
          <div className="card-header-simple">
            <h3 className="card-title">Projeção de Novos Negócios</h3>
            <p className="card-subtitle">Informe o valor estimado dos contratos ou vendas a serem fechados.</p>
          </div>

          {/* Campo de Entrada de Simulação */}
          <div className="form-group">
            <label htmlFor="sim-input" className="form-label">
              Valor da Nova Venda a Fechar
            </label>
            <div className="input-group">
              <span className="input-affix">R$</span>
              <input
                id="sim-input"
                type="number"
                step="500"
                min="0"
                value={additionalSales}
                onChange={(e) => setAdditionalSales(Math.max(0, parseFloat(e.target.value) || 0))}
                className="form-control font-bold text-lg"
              />
            </div>
          </div>

          {/* Atalhos Rápidos de Simulação */}
          <div>
            <label className="text-xs text-muted block mb-2 font-medium">Atalhos de Projeção Rápida:</label>
            <div className="chips-container">
              {quickChips.map((chipVal) => (
                <button
                  key={chipVal}
                  type="button"
                  className={`chip-button ${additionalSales === chipVal ? 'active' : ''}`}
                  onClick={() => handleChipClick(chipVal)}
                >
                  + {formatBRL(chipVal)}
                </button>
              ))}
            </div>
          </div>

          {/* Slider Interativo */}
          <div className="range-container">
            <div className="flex-between text-xs text-muted">
              <span>R$ 0</span>
              <span>R$ 50.000</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={additionalSales}
              onChange={(e) => setAdditionalSales(parseFloat(e.target.value) || 0)}
              className="range-input"
            />
          </div>

          {/* Dica de Incentivo */}
          <div className="info-box">
            <span className="info-icon">💡</span>
            <p className="text-xs text-muted">
              Dica: Bater <strong>100% da meta</strong> desbloqueia a taxa acelerada de{' '}
              <strong>+{rule.acceleratorRate}%</strong> sobre todo o faturamento excedente.
            </p>
          </div>
        </div>

        {/* Painel de Resultados do Cenário Simulado */}
        <div className="space-y-4">
          {/* Card Principal de Ganho Incremental */}
          <div className="gain-card">
            <span className="gain-subtitle">Remuneração Adicional Direta</span>
            <div className="gain-amount">+{formatBRL(simulation.incrementalGain)}</div>
            <p className="gain-footer">
              É quanto você ganha a mais no bolso ao fechar este novo negócio!
            </p>
          </div>

          {/* Avisos de Desbloqueio de Acelerador */}
          {simulation.unlockedAccelerator && (
            <div className="unlock-alert">
              <span className="unlock-icon">🚀</span>
              <div>
                <strong className="block text-success font-semibold">Acelerador de Superação Desbloqueado!</strong>
                <p className="text-xs">
                  Com esta venda, você supera 100% da meta e passa a receber +{rule.acceleratorRate}% de bônus!
                </p>
              </div>
            </div>
          )}

          {simulation.unlockedSuperBonus && (
            <div className="unlock-alert super-bonus">
              <span className="unlock-icon">🏆</span>
              <div>
                <strong className="block text-primary font-semibold">Super Bônus de Performance Ativado!</strong>
                <p className="text-xs">
                  Você superou a marca de {rule.superBonusThreshold}% e garantiu +{formatBRL(rule.superBonusFixed)} fixos!
                </p>
              </div>
            </div>
          )}

          {/* Comparativo Lado a Lado (Atual vs Simulado) */}
          <div className="card">
            <h3 className="card-title text-sm mb-3">Comparativo: Atual vs Projetado</h3>

            <div className="comparison-table">
              <div className="comparison-row">
                <span className="comp-label">Faturamento Total</span>
                <span className="comp-current">{formatBRL(currentCalculation.actualSales)}</span>
                <span className="comp-arrow">➔</span>
                <span className="comp-simulated font-bold text-success">
                  {formatBRL(simulation.totalSimulatedSales)}
                </span>
              </div>

              <div className="comparison-row">
                <span className="comp-label">Atingimento da Meta</span>
                <span className="comp-current">{formatPercent(currentCalculation.attainmentPercent)}</span>
                <span className="comp-arrow">➔</span>
                <span className="comp-simulated font-bold text-success">
                  {formatPercent(simulation.newAttainmentPercent)}
                </span>
              </div>

              <div className="comparison-row highlight-row">
                <span className="comp-label font-bold">Comissão Total a Receber</span>
                <span className="comp-current">{formatBRL(currentCalculation.totalCommission)}</span>
                <span className="comp-arrow">➔</span>
                <span className="comp-simulated font-bold text-primary text-base">
                  {formatBRL(simulation.newTotalCommission)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
