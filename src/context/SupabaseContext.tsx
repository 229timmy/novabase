import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
}

interface SupabaseContextType {
  user: User | null;
  updateProfile: (data: any) => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useState<User | null>({
    id: '1',
    email: 'demo@example.com'
  });

  const updateProfile = async (data: any) => {
    console.log('Profile update requested with data:', data);
    // This is a placeholder for actual Supabase integration
  };

  return (
    <SupabaseContext.Provider value={{ user, updateProfile }}>
      {children}
    </SupabaseContext.Provider>
  );
}; 