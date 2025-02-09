import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Home, Clapperboard, Tv, Heart, Menu, X, Search, Grid, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { EasterEggModal } from './EasterEggModal';
import { useSupabase } from '../context/SupabaseContext';
import '../styles/navbar-animation.css';

const menuItems = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Grid, label: 'Categories', path: '/categories' },
  { icon: Clapperboard, label: 'Movies', path: '/movies' },
  { icon: Tv, label: 'TV Shows', path: '/tv-shows' },
  { icon: Heart, label: 'Favorites', path: '/favorites' },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, avatarUrl } = useSupabase();

  const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=random&color=fff&bold=true&size=128`;

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 7) {
        setShowEasterEgg(true);
        return 0;
      }
      return newCount;
    });
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Fixed Menu Button */}
      <motion.button
        initial={false}
        animate={{ 
          x: isOpen ? 256 - 48 : 0,
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
            <Link 
              to="/" 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={handleLogoClick}
            >
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
                    "nav-link flex items-center gap-4 w-full p-4 text-white/80 hover:text-white",
                    "transition-colors duration-200 rounded-lg hover:bg-white/5",
                    location.pathname === item.path && "bg-white/10 text-white"
                  )}
                >
                  <item.icon className="w-6 h-6 relative z-[1]" />
                  <span className="text-lg relative z-[1]">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Profile and Logout Section */}
          <div className="px-4 py-6 border-t border-white/10">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                whileHover={{ x: 10 }}
                className={clsx(
                  "flex items-center gap-4 w-full p-4 text-white/80 hover:text-white mb-2",
                  "transition-colors duration-200 rounded-lg hover:bg-white/5",
                  location.pathname === '/profile' && "bg-white/10 text-white"
                )}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10">
                  <img
                    src={avatarUrl || defaultAvatarUrl}
                    alt={user?.email || 'User'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-lg">{user?.email?.split('@')[0] || 'User'}</span>
              </motion.div>
            </Link>

            <motion.button
              whileHover={{ x: 10 }}
              onClick={handleLogout}
              className="flex items-center gap-4 w-full p-4 text-white/80 hover:text-white
                transition-colors duration-200 rounded-lg hover:bg-white/5"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-lg">Logout</span>
            </motion.button>
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

      {/* Easter Egg Modal */}
      <EasterEggModal 
        isOpen={showEasterEgg} 
        onClose={() => setShowEasterEgg(false)} 
      />
    </>
  );
};