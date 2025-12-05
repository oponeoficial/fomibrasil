import React from 'react';
import { Menu, Bell, SlidersHorizontal } from 'lucide-react';

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
  hasNotifications = false,
}) => {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        backgroundColor: 'rgba(255, 248, 240, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 50,
      }}
    >
      {/* Menu Button */}
      <button
        onClick={onMenuClick}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Menu size={24} color="var(--color-dark)" />
      </button>

      {/* Logo */}
      <img
        src="/images/logo-fomi.png"
        alt="Fomí"
        style={{
          height: '60px',
          objectFit: 'contain',
        }}
      />

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={onNotificationsClick}
          style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bell size={22} color="var(--color-dark)" />
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
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SlidersHorizontal size={22} color="var(--color-dark)" />
        </button>
      </div>
    </header>
  );
};