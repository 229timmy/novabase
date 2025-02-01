import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Clapperboard, Tv, Heart, Menu, X, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Clapperboard, label: 'Movies', path: '/movies' },
  { icon: Tv, label: 'TV Shows', path: '/tv-shows' },
  { icon: Heart, label: 'Favorites', path: '/favorites' },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Fixed Menu Button */}
      <motion.button
        initial={false}
        animate={{ 
          x: isOpen ? 256 - 48 : 0, // 256px (sidebar width) - 48px (button position)
          rotate: isOpen ? 180 : 0 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-64 bg-black/95 backdrop-blur-lg z-40"
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <img src="/logo.png" alt="Nova" className="w-8 h-8" />
              <span className="text-white text-xl font-bold">Nova</span>
            </Link>
          </div>

          <div className="px-4 flex-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsOpen(false)}
              >
                <motion.div
                  whileHover={{ x: 10 }}
                  className={clsx(
                    "flex items-center gap-4 w-full p-4 text-white/80 hover:text-white",
                    "transition-colors duration-200 rounded-lg hover:bg-white/10",
                    location.pathname === item.path && "bg-white/10 text-white"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-lg">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Overlay to close sidebar when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};