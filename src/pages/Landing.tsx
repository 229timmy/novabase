import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Film, Tv2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthModal } from '../components/AuthModal';

export const Landing = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const handleOpenSignin = () => setShowSignIn(true);
    const handleOpenSignup = () => setShowSignUp(true);

    document.addEventListener('openSignin', handleOpenSignin);
    document.addEventListener('openSignup', handleOpenSignup);

    return () => {
      document.removeEventListener('openSignin', handleOpenSignin);
      document.removeEventListener('openSignup', handleOpenSignup);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1a1a1a] to-black overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{
                y: [null, Math.random() * -1000],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img src="/logo.png" alt="Nova" className="w-24 h-24 mx-auto mb-6" />
            <h1 className="text-6xl font-bold text-white mb-4">
              Nova
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-blue-500"
              >
                Base
              </motion.span>
            </h1>
            <p className="text-xl text-white/80 mb-8">Your Ultimate Streaming Companion</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-4 mb-12"
          >
            <button
              onClick={() => setShowSignUp(true)}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={() => setShowSignIn(true)}
              className="px-8 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Sign In
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-2 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 rounded-lg p-6 backdrop-blur-sm"
          >
            <Film className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Extensive Library</h3>
            <p className="text-white/60">Access thousands of movies and TV shows in one place. Always updated with the latest releases.</p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 rounded-lg p-6 backdrop-blur-sm"
          >
            <Tv2 className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Smart Categories</h3>
            <p className="text-white/60">Discover content through intelligent categorization. Find exactly what you want to watch.</p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/5 rounded-lg p-6 backdrop-blur-sm"
          >
            <Sparkles className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">100% Free</h3>
            <p className="text-white/60">All features available at no cost. No hidden fees, no premium tiers. Just pure entertainment.</p>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Watching?</h2>
          <p className="text-xl text-white/60 mb-8">Join thousands of users discovering great content every day.</p>
        </motion.div>
      </div>

      {/* Auth Modals */}
      <AuthModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        mode="signin"
      />
      <AuthModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        mode="signup"
      />
    </div>
  );
}; 