import React, { useState } from "react";
import {
  Book,
  Download,
  LogOut,
  Settings,
  RefreshCw,
  LayoutDashboard,
  User,
} from "lucide-react";
import { COLORS, HEADER_LOGO_URL } from "../constants";
import { User as UserType } from "../types";

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
  onOpenProfile: () => void;
  onExport: () => void;
  onResetView: () => void;
  onOpenDashboard: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onOpenProfile,
  onExport,
  onResetView,
  onOpenDashboard,
}) => {
  const isAdmin = user?.role === "admin";

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <header
      className="sticky top-0 z-40 shadow-md"
      style={{ backgroundColor: COLORS.primary }}
    >
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between text-white">
        <div
          onClick={onResetView}
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className="flex items-center justify-center p-2 rounded-2xl group-hover:bg-white/10 transition-all duration-300">
             <img src="https://raw.githubusercontent.com/Khunnaingpyaehtun/Ourtrees/main/Logo.svg" alt="Logo" className="w-[36px] h-[36px] object-contain" />
          </div>
          <div className="flex items-center h-full">
            <img src="https://raw.githubusercontent.com/Khunnaingpyaehtun/Ourtrees/main/Logo%20text.svg" alt="Our Trees Education Foundation" className="h-[28px] object-contain" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-lg mr-2"
            >
              <LayoutDashboard size={14} /> Dashboard
            </button>
          )}

          {isAdmin && (
            <button
              onClick={handleReload}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-full text-xs font-bold transition-all mr-2"
              title="Reload System"
            >
              <RefreshCw size={14} />
            </button>
          )}
          {isAdmin && (
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/40 px-5 py-2.5 rounded-full text-xs font-bold transition-all border border-emerald-500/30"
            >
              <Download size={14} /> Backup
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenProfile}
                className="flex items-center justify-center p-1 rounded-full transition-all hover:scale-105"
                title="Profile"
              >
                <img src="https://raw.githubusercontent.com/Khunnaingpyaehtun/Ourtrees/main/profile.svg" alt="Profile" className="w-[32px] h-[32px] object-contain" />
              </button>
            </div>
          ) : (
            /* Should rarely be seen as AuthScreen blocks access */
            <div className="text-xs font-bold opacity-50">Not Logged In</div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
