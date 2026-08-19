import React from 'react';
import { Home, CircleDot, BarChart3, Flower2, Settings } from 'lucide-react';

export type NavTab = 'home' | 'japa' | 'progress' | 'wisdom' | 'settings';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  activeCount = 0,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'japa' as NavTab, label: 'Japa', icon: CircleDot, badge: activeCount > 0 ? activeCount : null },
    { id: 'progress' as NavTab, label: 'Progress', icon: BarChart3 },
    { id: 'wisdom' as NavTab, label: 'Wisdom', icon: Flower2 },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/90 dark:bg-[#1C1917]/90 backdrop-blur-md border-t border-[#E7E2DA] dark:border-[#2D2A26] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 min-w-[56px] min-h-[44px] transition-colors ${
                isActive
                  ? 'text-[#D97706] dark:text-[#F59E0B]'
                  : 'text-[#78716C] dark:text-[#A8A29E] hover:text-[#23201D] dark:hover:text-[#FAF8F5]'
              }`}
            >
              <div className="relative">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.3 : 1.8}
                  className={`transition-transform duration-150 ${isActive ? 'scale-110' : ''}`}
                />
                {tab.badge !== null && tab.id === 'japa' && !isActive && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-[#D97706] text-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-1 font-medium tracking-tight ${
                  isActive ? 'font-semibold' : ''
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#D97706] dark:bg-[#F59E0B]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
