import React from 'react';
import { Home, Compass, PlusCircle, MessageCircle, User } from 'lucide-react';
import { TabId } from '../../types';

interface BottomNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  isAction?: boolean;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Início', icon: <Home size={24} /> },
  { id: 'discover', label: 'Descobrir', icon: <Compass size={24} /> },
  { id: 'newreview', label: 'Avaliar', icon: <PlusCircle size={28} />, isAction: true },
  { id: 'activity', label: 'Atividade', icon: <MessageCircle size={24} /> },
  { id: 'profile', label: 'Perfil', icon: <User size={24} /> },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[70px] bg-white/95 backdrop-blur-md border-t border-black/5 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,0)] z-50">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;

        if (item.isAction) {
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center gap-0.5 px-4 py-3 bg-red border-none rounded-full cursor-pointer text-white -translate-y-2.5 shadow-[0_4px_15px_rgba(255,59,48,0.4)] transition-transform duration-200 hover:scale-105"
            >
              {item.icon}
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 bg-transparent border-none cursor-pointer transition-colors duration-200 ${
              isActive ? 'text-red' : 'text-gray'
            }`}
          >
            {item.icon}
            <span className={`text-[0.65rem] ${isActive ? 'font-semibold' : 'font-normal'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};