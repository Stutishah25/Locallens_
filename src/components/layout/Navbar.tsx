import React, { useState } from 'react';
import { Compass, Menu, X, Bookmark } from 'lucide-react';

interface NavbarProps {
  activeTab: 'landing' | 'planner' | 'explore' | 'trust';
  onNavigate: (tab: 'landing' | 'planner' | 'explore' | 'trust') => void;
  savedRoutesCount: number;
  onOpenMyRoutes: () => void;
  onOpenSignIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  savedRoutesCount,
  onOpenMyRoutes,
  onOpenSignIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E7E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single clean text element wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#16432F] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <button
              onClick={() => onNavigate('landing')}
              className="text-lg font-bold tracking-tight text-[#1E2328] hover:text-[#16432F] transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
            >
              LocalLens
            </button>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#48525B]">
            <button
              onClick={() => onNavigate('planner')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 ${
                activeTab === 'planner'
                  ? 'text-[#16432F] border-b-2 border-[#16432F]'
                  : 'hover:text-[#1E2328]'
              }`}
            >
              Plan Journey
            </button>

            <button
              onClick={() => onNavigate('explore')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 ${
                activeTab === 'explore'
                  ? 'text-[#16432F] border-b-2 border-[#16432F]'
                  : 'hover:text-[#1E2328]'
              }`}
            >
              Explore Corridors
            </button>

            <button
              onClick={() => onNavigate('trust')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 ${
                activeTab === 'trust'
                  ? 'text-[#16432F] border-b-2 border-[#16432F]'
                  : 'hover:text-[#1E2328]'
              }`}
            >
              Trust & Data Standards
            </button>

            <button
              onClick={onOpenMyRoutes}
              className="inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 hover:text-[#1E2328]"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>My Routes</span>
              {savedRoutesCount > 0 && (
                <span className="text-[10px] bg-[#EBF4F0] text-[#16432F] border border-[#C6DFD4] px-1.5 py-0.2 rounded font-bold">
                  {savedRoutesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSignIn}
              className="px-4 py-2 text-xs font-semibold text-[#16432F] bg-[#FAF9F5] hover:bg-[#EBF4F0] border border-[#C6DFD4] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sign In
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenMyRoutes}
              className="p-2 text-[#4A5560] hover:text-[#1E2328]"
              aria-label="View saved routes"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4A5560] hover:text-[#1E2328] rounded-lg hover:bg-[#EFECE5]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E4DC] bg-[#FAF9F5] px-4 py-3 space-y-2 text-sm font-medium">
          <button
            onClick={() => {
              onNavigate('planner');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#EFECE5] text-[#1E2328]"
          >
            Plan Journey
          </button>
          <button
            onClick={() => {
              onNavigate('explore');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#EFECE5] text-[#1E2328]"
          >
            Explore Corridors
          </button>
          <button
            onClick={() => {
              onNavigate('trust');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#EFECE5] text-[#1E2328]"
          >
            Trust & Data Standards
          </button>
          <button
            onClick={() => {
              onOpenMyRoutes();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#EFECE5] text-[#1E2328] flex items-center justify-between"
          >
            <span>My Routes</span>
            {savedRoutesCount > 0 && (
              <span className="text-xs font-bold text-[#16432F] bg-[#EBF4F0] px-2 py-0.5 rounded">
                {savedRoutesCount}
              </span>
            )}
          </button>
          <div className="pt-2 border-t border-[#E7E4DC]">
            <button
              onClick={() => {
                onOpenSignIn();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2 px-3 bg-[#16432F] text-white rounded-lg font-semibold text-xs"
            >
              Sign In (Demo Preview)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
