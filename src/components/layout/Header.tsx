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
    <header className="fixed top-0 left-0 right-0 h-[60px] bg-cream/95 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-4 z-50">
      {/* Menu Button */}
      <button
        onClick={onMenuClick}
        className="w-10 h-10 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center"
      >
        <Menu size={24} className="text-dark" />
      </button>

      {/* Logo */}
      <img
        src="/images/logo-fomi.png"
        alt="Fomí"
        className="h-[60px] object-contain"
      />

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onNotificationsClick}
          className="relative w-10 h-10 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center"
        >
          <Bell size={22} className="text-dark" />
          {hasNotifications && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red rounded-full border-2 border-cream" />
          )}
        </button>

        <button
          onClick={onFilterClick}
          className="w-10 h-10 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center"
        >
          <SlidersHorizontal size={22} className="text-dark" />
        </button>
      </div>
    </header>
  );
};