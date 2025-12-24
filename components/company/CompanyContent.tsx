'use client';

import { useState } from 'react';
import { Building2, Phone, Sparkles } from 'lucide-react';
import { Company } from '@/lib/types';
import { CompanyOverview } from './CompanyOverview';
import { CompanyContact } from './CompanyContact';
import { CompanyInsights } from './CompanyInsights';

interface CompanyContentProps {
  company: Company;
  isLoggedIn?: boolean;
}

type TabType = 'overview' | 'contact' | 'insights';

export function CompanyContent({ company, isLoggedIn = false }: CompanyContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Building2 },
    { id: 'contact' as TabType, label: 'Contact Info', icon: Phone },
    { id: 'insights' as TabType, label: 'Insights', icon: Sparkles },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tab Navigation */}
      <nav className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      {activeTab === 'overview' && <CompanyOverview company={company} />}
      {activeTab === 'contact' && <CompanyContact company={company} />}
      {activeTab === 'insights' && <CompanyInsights company={company} />}
    </div>
  );
}
