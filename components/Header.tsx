
import React, { useState } from 'react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLogin: () => void;
  onLoginAdmin: () => void;
  onLogout: () => void;
  onGoHome: () => void;
  onGoDash: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogin, onLogout, onGoHome, onGoDash }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-md z-50 border-b border-neutral-100 px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="font-title text-2xl font-bold tracking-tight cursor-pointer" onClick={onGoHome}>
          LUX STUDIO.
        </div>

        <button className="md:hidden text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-full left-0 w-full md:w-auto bg-white md:bg-transparent flex-col md:flex-row items-center gap-8 py-6 md:py-0 shadow-lg md:shadow-none border-b md:border-none`}>
          <ul className="flex flex-col md:flex-row gap-8 items-center list-none p-0 m-0">
            <li><button onClick={() => { onGoHome(); setIsMenuOpen(false); }} className="text-xs uppercase tracking-widest font-semibold hover:text-neutral-500">Portfolio</button></li>
            <li><a href="#services" onClick={() => setIsMenuOpen(false)} className="text-xs uppercase tracking-widest font-semibold hover:text-neutral-500 no-underline text-black">Dịch vụ</a></li>
            {currentUser && (
              <li><button onClick={() => { onGoDash(); setIsMenuOpen(false); }} className="text-xs uppercase tracking-widest font-semibold hover:text-neutral-500">Quản lý</button></li>
            )}
          </ul>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <img src={currentUser.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-neutral-200" />
              <button onClick={onLogout} className="text-xs font-bold uppercase border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">Thoát</button>
            </div>
          ) : (
            <button onClick={onLogin} className="text-xs font-bold uppercase border border-black px-6 py-2.5 hover:bg-black hover:text-white transition-colors">Đăng nhập</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
