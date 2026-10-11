import React from 'react';
import type { CommissionRule, SellerData } from '../types';

interface ManagerSettingsProps {
  seller: SellerData;
  rule: CommissionRule;
  onUpdateSeller: (updated: Partial<SellerData>) => void;
  onUpdateRule: (updated: Partial<CommissionRule>) => void;
  onResetDefaults: () => void;
}

export const ManagerSettings: React.FC<ManagerSettingsProps> = ({
  seller,
  rule,
  onUpdateSeller,
  onUpdateRule,
  onResetDefaults,
}) => {
  return (
    <div className="manager-content space-y-6">
      <div className="manager-header-card">
        <div>
          <span className="badge badge-warning">Área da Gestão & Controladoria</span>
          <h2 className="text-xl font-bold mt-2">Configuração de Políticas Comerciais & Metas</h2>
          <p className="text-sm text-muted mt-1">
            Defina as regras de remuneração variável, metas do ciclo e parâmetros de incentivo para os vendedores.
          </p>
        </div>
      </div>

      <div className="grid-2-cols">
        {/* Parâmetros do Vendedor e Meta */}
        <div className="card space-y-4">
          <div className="card-header-simple">
            <h3 className="card-title">Parâmetros do Vendedor & Ciclo</h3>
            <p className="card-subtitle">Ajuste os dados da operação do vendedor selecionado.</p>
          </div>

          <div className="form-group">
            <label className="form-label">Nome do Vendedor</label>
            <input
              type="text"
              value={seller.name}
              onChange={(e) => onUpdateSeller({ name: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cargo / Especialidade</label>
            <input
              type="text"
              value={seller.role}
              onChange={(e) => onUpdateSeller({ role: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Meta Individual Estabelecida (R$)</label>
            <div className="input-group">
              <span className="input-affix">R$</span>
              <input
                type="number"
                step="1000"
                value={seller.target}
                onChange={(e) => onUpdateSeller({ target: parseFloat(e.target.value) || 0 })}
                className="form-control font-semibold"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Faturamento Atual Realizado (R$)</label>
            <div className="input-group">
              <span className="input-affix">R$</span>
              <input
                type="number"
                step="500"
                value={seller.actualSales}
                onChange={(e) => onUpdateSeller({ actualSales: parseFloat(e.target.value) || 0 })}
                className="form-control font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Políticas de Comissão & Aceleradores */}
        <div className="card space-y-4">
          <div className="card-header-simple">
            <h3 className="card-title">Regras de Comissionamento & Aceleradores</h3>
            <p className="card-subtitle">Configurações de taxas base e bonificação por superação.</p>
          </div>

          <div className="form-group">
            <label className="form-label">Comissão Base Contratada (%)</label>
            <div className="input-group">
              <input
                type="number"
                step="0.1"
                value={rule.baseRate}
                onChange={(e) => onUpdateRule({ baseRate: parseFloat(e.target.value) || 0 })}
                className="form-control"
              />
              <span className="input-suffix">%</span>
            </div>
            <small className="text-muted block mt-1">Percentual padrão pago sobre todas as vendas realizadas.</small>
          </div>

          {/* Switch Acelerador */}
          <div className="border-t border-slate-800/80 pt-3">
            <div className="flex-between">
              <div>
                <label className="font-semibold text-sm block">Habilitar Acelerador de Meta</label>
                <small className="text-muted block">Paga taxa adicional sobre o faturamento que ultrapassar a meta</small>
              </div>
              <input
                type="checkbox"
                checked={rule.enableAccelerator}
                onChange={(e) => onUpdateRule({ enableAccelerator: e.target.checked })}
                className="w-4 h-4"
              />
            </div>

            {rule.enableAccelerator && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="form-group">
                  <label className="text-xs text-muted">Gatilho (% da Meta)</label>
                  <input
                    type="number"
                    value={rule.acceleratorThreshold}
                    onChange={(e) => onUpdateRule({ acceleratorThreshold: parseFloat(e.target.value) || 100 })}
                    className="form-control text-xs"
                  />
                </div>
                <div className="form-group">
                  <label className="text-xs text-muted">Taxa Bônus (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={rule.acceleratorRate}
                    onChange={(e) => onUpdateRule({ acceleratorRate: parseFloat(e.target.value) || 0 })}
                    className="form-control text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Super Bônus */}
          <div className="border-t border-slate-800/80 pt-3">
            <label className="font-semibold text-sm block mb-1">Super Bônus de Performance (Fixa)</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="text-xs text-muted">Gatilho (% da Meta)</label>
                <input
                  type="number"
                  value={rule.superBonusThreshold}
                  onChange={(e) => onUpdateRule({ superBonusThreshold: parseFloat(e.target.value) || 120 })}
                  className="form-control text-xs"
                />
              </div>
              <div className="form-group">
                <label className="text-xs text-muted">Prêmio Fixo (R$)</label>
                <input
                  type="number"
                  step="100"
                  value={rule.superBonusFixed}
                  onChange={(e) => onUpdateRule({ superBonusFixed: parseFloat(e.target.value) || 0 })}
                  className="form-control text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="btn btn-outline w-full text-xs"
              onClick={onResetDefaults}
            >
              Restaurar Parâmetros Padrão da Empresa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
