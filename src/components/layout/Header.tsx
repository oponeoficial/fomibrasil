import React from 'react';
import { Menu, Bell, Filter } from 'lucide-react';
import { Logo } from '../common/Logo';

interface HeaderProps {
    onMenuClick: () => void;
    onFilterClick: () => void;
    onNotificationsClick: () => void;
    hasNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    onMenuClick,
    onFilterClick,
    onNotificationsClick,
    hasNotifications = false
}) => {
    return (
        <header
            className="header"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                backgroundColor: 'rgba(255, 248, 240, 0.9)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '0 16px',
                height: 'var(--header-height)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-soft)',
                transition: 'all 0.3s ease',
            }}
        >
            <button
                onClick={onMenuClick}
                className="header-btn"
                style={{
                    padding: '8px',
                    marginLeft: '-8px',
                    borderRadius: '50%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s ease',
                }}
                aria-label="Menu"
            >
                <Menu size={24} strokeWidth={1.5} color="var(--color-dark)" />
            </button>

            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <Logo size="sm" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                    onClick={onNotificationsClick}
                    style={{
                        padding: '8px',
                        borderRadius: '50%',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                    }}
                    aria-label="Notifications"
                >
                    <Bell size={24} strokeWidth={1.5} color="var(--color-dark)" />
                    {hasNotifications && (
                        <span
                            style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                width: '8px',
                                height: '8px',
                                backgroundColor: 'var(--color-red)',
                                borderRadius: '50%',
                                border: '2px solid var(--color-cream)',
                            }}
                        />
                    )}
                </button>

                <button
                    onClick={onFilterClick}
                    style={{
                        padding: '8px',
                        marginRight: '-8px',
                        borderRadius: '50%',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    aria-label="Filters"
                >
                    <Filter size={24} strokeWidth={1.5} color="var(--color-dark)" />
                </button>
            </div>
        </header>
    );
};
