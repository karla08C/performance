import React from 'react';
import type { CommissionCalculation, CommissionRule, SellerData } from '../types';
import { formatBRL, formatPercent } from '../services/commissionEngine';

interface SellerDashboardProps {
  seller: SellerData;
  calculation: CommissionCalculation;
  rule: CommissionRule;
  onOpenSimulator: () => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  seller,
  calculation,
  rule,
  onOpenSimulator,
}) => {
  const visualProgress = Math.min(Math.max(calculation.attainmentPercent, 0), 100);
  const isSuperada = calculation.status === 'superada' || calculation.status === 'atingida';

  return (
    <div className="dashboard-content space-y-6">
      {/* Banner de Boas-vindas e Status do Mês */}
      <div className="welcome-banner">
        <div>
          <h2 className="welcome-title">Olá, {seller.name}!</h2>
          <p className="welcome-desc">
            Acompanhe o fechamento das suas vendas no ciclo de <strong>{seller.period}</strong> e a apuração da sua comissão.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={onOpenSimulator}>
          Simular Projeção "E se?"
        </button>
      </div>

      {/* Grid de 4 KPIs Executivos */}
      <div className="kpi-grid">
        {/* KPI 1: Remuneração Total */}
        <div className="kpi-card highlight-card">
          <span className="kpi-label">Comissão Total Acumulada</span>
          <div className="kpi-value highlight-text">{formatBRL(calculation.totalCommission)}</div>
          <div className="kpi-subtext">
            Taxa efetiva: <strong>{calculation.effectiveRate.toFixed(2)}%</strong> sobre as vendas
          </div>
        </div>

        {/* KPI 2: Atingimento da Meta */}
        <div className="kpi-card">
          <span className="kpi-label">Atingimento da Meta</span>
          <div className="kpi-value">{formatPercent(calculation.attainmentPercent)}</div>
          <div className="kpi-badge-container">
            {calculation.status === 'superada' ? (
              <span className="badge badge-success">🏆 Meta Superada (+{(calculation.attainmentPercent - 100).toFixed(1)}%)</span>
            ) : calculation.status === 'atingida' ? (
              <span className="badge badge-success">✅ Meta 100% Batida</span>
            ) : calculation.status === 'quase' ? (
              <span className="badge badge-warning">⚡ Reta Final</span>
            ) : (
              <span className="badge badge-info">📈 Em Andamento</span>
            )}
          </div>
        </div>

        {/* KPI 3: Vendas Realizadas vs Meta */}
        <div className="kpi-card">
          <span className="kpi-label">Vendas Realizadas / Meta</span>
          <div className="kpi-value">{formatBRL(calculation.actualSales)}</div>
          <div className="kpi-subtext">
            Meta individual: <strong>{formatBRL(calculation.target)}</strong>
          </div>
        </div>

        {/* KPI 4: Balanço de Meta */}
        <div className="kpi-card">
          <span className="kpi-label">{isSuperada ? 'Volume Excedente' : 'Saldo para a Meta'}</span>
          <div className={`kpi-value ${isSuperada ? 'text-success' : 'text-warning'}`}>
            {isSuperada ? `+ ${formatBRL(calculation.surplus)}` : formatBRL(calculation.gap)}
          </div>
          <div className="kpi-subtext">
            {isSuperada ? 'Elegível ao bônus acelerador' : 'Faturamento restante para atingir 100%'}
          </div>
        </div>
      </div>

      {/* Card da Barra de Progresso Visual */}
      <div className="card">
        <div className="card-header-flex">
          <div>
            <h3 className="card-title">Evolução do Atingimento de Metas</h3>
            <p className="card-subtitle">Acompanhe visualmente o seu progresso em direção aos 100% e aos aceleradores.</p>
          </div>
          <div className="progress-percent-badge">{formatPercent(calculation.attainmentPercent)}</div>
        </div>

        <div className="progress-container">
          <div className="progress-track">
            <div
              className={`progress-fill ${isSuperada ? 'fill-superada' : 'fill-normal'}`}
              style={{ width: `${visualProgress}%` }}
            ></div>
            <div className="goal-indicator" style={{ left: '100%' }} title="Meta 100%"></div>
          </div>
          <div className="progress-legend">
            <span>0%</span>
            <span>50%</span>
            <span>80% (Gatilho)</span>
            <span className="font-bold text-success">100% (Meta)</span>
            <span className="font-bold text-primary">120%+ (Super Meta)</span>
          </div>
        </div>
      </div>

      {/* Extrato Detalhado de Comissões Acumuladas */}
      <div className="card">
        <div className="card-header-flex">
          <div>
            <h3 className="card-title">Extrato Detalhado de Remuneração Variável</h3>
            <p className="card-subtitle">Demonstrativo formal dos componentes de comissão calculados no período.</p>
          </div>
          <span className="badge badge-neutral">Fechamento do Ciclo</span>
        </div>

        <div className="statement-table">
          <div className="statement-row">
            <span className="col-desc">Faturamento Bruto Realizado</span>
            <span className="col-calc">{formatBRL(calculation.actualSales)}</span>
            <span className="col-rate">—</span>
            <span className="col-total">{formatBRL(calculation.actualSales)}</span>
          </div>

          <div className="statement-row">
            <span className="col-desc">Comissão Base Contratada</span>
            <span className="col-calc">Sobre faturamento total</span>
            <span className="col-rate">{rule.baseRate.toFixed(1)}%</span>
            <span className="col-total font-medium">{formatBRL(calculation.baseCommission)}</span>
          </div>

          {rule.enableAccelerator && (
            <div className="statement-row">
              <span className="col-desc">
                Acelerador de Superação
                {calculation.surplus > 0 ? (
                  <small className="text-muted block">Sobre faturamento excedente à meta ({formatBRL(calculation.surplus)})</small>
                ) : (
                  <small className="text-muted block">Gatilho ativado a partir de 100% da meta</small>
                )}
              </span>
              <span className="col-calc">
                {calculation.surplus > 0 ? formatBRL(calculation.surplus) : 'Meta não superada'}
              </span>
              <span className="col-rate">+{rule.acceleratorRate.toFixed(1)}%</span>
              <span className="col-total font-medium text-success">
                +{formatBRL(calculation.acceleratorCommission)}
              </span>
            </div>
          )}

          {rule.superBonusThreshold > 0 && calculation.superBonusAmount > 0 && (
            <div className="statement-row">
              <span className="col-desc">
                Super Bônus de Performance
                <small className="text-muted block">Atingimento superior a {rule.superBonusThreshold}%</small>
              </span>
              <span className="col-calc">Bonificação Fixa</span>
              <span className="col-rate">—</span>
              <span className="col-total font-medium text-success">
                +{formatBRL(calculation.superBonusAmount)}
              </span>
            </div>
          )}

          <div className="statement-row statement-total-row">
            <span className="col-desc font-bold text-primary">Remuneração Final Apurada</span>
            <span className="col-calc font-semibold">Taxa efetiva: {calculation.effectiveRate.toFixed(2)}%</span>
            <span className="col-rate">—</span>
            <span className="col-total font-bold text-primary text-lg">
              {formatBRL(calculation.totalCommission)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
