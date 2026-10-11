import { useState } from 'react';
import type { CommissionRule, SellerData } from './types';
import { calculateCommission } from './services/commissionEngine';
import { Header } from './components/Header';
import { SellerDashboard } from './components/SellerDashboard';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { ManagerSettings } from './components/ManagerSettings';
import './App.css';

const DEFAULT_RULE: CommissionRule = {
  baseRate: 3.5,
  enableAccelerator: true,
  acceleratorThreshold: 100,
  acceleratorRate: 1.5,
  superBonusThreshold: 120,
  superBonusFixed: 500,
};

const DEFAULT_SELLER: SellerData = {
  id: '1',
  name: 'Karla Castro',
  role: 'Executiva de Contas Senior',
  target: 50000,
  actualSales: 42500,
  period: 'Outubro / 2026',
};

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulator' | 'manager'>('dashboard');
  const [seller, setSeller] = useState<SellerData>(DEFAULT_SELLER);
  const [rule, setRule] = useState<CommissionRule>(DEFAULT_RULE);

  const calculation = calculateCommission(seller.actualSales, seller.target, rule);

  const handleUpdateSeller = (updated: Partial<SellerData>) => {
    setSeller((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateRule = (updated: Partial<CommissionRule>) => {
    setRule((prev) => ({ ...prev, ...updated }));
  };

  const handleResetDefaults = () => {
    setSeller(DEFAULT_SELLER);
    setRule(DEFAULT_RULE);
  };

  return (
    <div className="app-layout">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        seller={seller}
      />

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <SellerDashboard
            seller={seller}
            calculation={calculation}
            rule={rule}
            onOpenSimulator={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'simulator' && (
          <WhatIfSimulator
            seller={seller}
            currentCalculation={calculation}
            rule={rule}
          />
        )}

        {activeTab === 'manager' && (
          <ManagerSettings
            seller={seller}
            rule={rule}
            onUpdateSeller={handleUpdateSeller}
            onUpdateRule={handleUpdateRule}
            onResetDefaults={handleResetDefaults}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>
          <strong>Performance BI & Comissões</strong> • Desenvolvido por Karla Castro
        </p>
        <div className="footer-links">
          <a href="https://github.com/karla08C/performance" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span>•</span>
          <a href="https://www.linkedin.com/in/karlaj-castro/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;