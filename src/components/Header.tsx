import React from 'react';
import type { SellerData } from '../types';

interface HeaderProps {
  activeTab: 'dashboard' | 'simulator' | 'manager';
  onTabChange: (tab: 'dashboard' | 'simulator' | 'manager') => void;
  seller: SellerData;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, seller }) => {
  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand */}
        <div className="header-brand">
          <div className="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">Performance</h1>
              <span className="badge-spm">SPM Platform</span>
            </div>
            <p className="brand-tagline">
              {seller.name} • {seller.role} • <strong>{seller.period}</strong>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="tab-navigation">
          <button
            type="button"
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => onTabChange('dashboard')}
          >
            <span className="tab-icon">📊</span>
            Dashboard do Vendedor
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => onTabChange('simulator')}
          >
            <span className="tab-icon">🎯</span>
            Simulador "E se?"
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'manager' ? 'active' : ''}`}
            onClick={() => onTabChange('manager')}
          >
            <span className="tab-icon">⚙️</span>
            Painel do Gestor
          </button>
        </nav>
      </div>
    </header>
  );
};
