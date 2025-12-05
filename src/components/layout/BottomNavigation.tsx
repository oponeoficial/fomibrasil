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
        <nav
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '70px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '0 8px',
                paddingBottom: 'env(safe-area-inset-bottom, 0)',
                zIndex: 50,
            }}
        >
            {navItems.map((item) => {
                const isActive = activeTab === item.id;

                if (item.isAction) {
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '2px',
                                padding: '12px 16px',
                                background: 'var(--color-red)',
                                border: 'none',
                                borderRadius: 'var(--radius-full)',
                                cursor: 'pointer',
                                color: '#fff',
                                transform: 'translateY(-10px)',
                                boxShadow: '0 4px 15px rgba(255, 59, 48, 0.4)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            }}
                        >
                            {item.icon}
                        </button>
                    );
                }

                return (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '2px',
                            padding: '8px 12px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: isActive ? 'var(--color-red)' : 'var(--color-gray)',
                            transition: 'color 0.2s ease',
                        }}
                    >
                        {item.icon}
                        <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};
