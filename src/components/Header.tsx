import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  isDemoMode?: boolean;
}

export function Header({ onLoginClick, onSignupClick, isDemoMode = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const menuItems = [
    { id: 'home', label: 'Главная' },
    { id: 'demo', label: 'Демо' },
    { id: 'algorithm', label: 'Алгоритм' },
    { id: 'contacts', label: 'Контакты' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 frosted-glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-white">T+</span>
            </div>
            <span className="text-xl text-gradient">TestoCheck</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  scrollToSection(item.id);
                }}
                className="relative py-2 text-gray-700 smooth-transition hover:text-[#3C8CE7] group"
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-[#3C8CE7] smooth-transition ${
                    activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* CTA Buttons - only show if not in demo mode */}
          {!isDemoMode && onLoginClick && onSignupClick && (
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={onLoginClick}
                className="px-6 py-2.5 rounded-lg border border-[#3C8CE7] text-[#3C8CE7] smooth-transition hover:bg-[#3C8CE7] hover:text-white"
              >
                Login
              </button>
              <button
                onClick={onSignupClick}
                className="px-6 py-2.5 rounded-lg gradient-success text-white smooth-transition hover-scale shadow-lg"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Demo Mode Badge */}
          {isDemoMode && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
              <span className="text-sm">Демо-режим</span>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 smooth-transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 fade-in">
            <nav className="flex flex-col gap-3 mb-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    scrollToSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 px-4 rounded-lg smooth-transition ${
                    activeSection === item.id
                      ? 'bg-[#3C8CE7] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            {!isDemoMode && onLoginClick && onSignupClick && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-6 py-2.5 rounded-lg border border-[#3C8CE7] text-[#3C8CE7] smooth-transition hover:bg-[#3C8CE7] hover:text-white"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onSignupClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-6 py-2.5 rounded-lg gradient-success text-white smooth-transition shadow-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}