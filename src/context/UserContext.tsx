import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
  username: string;
  setUsername: (name: string) => void;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
}

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=random&color=fff&bold=true&size=128';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState('User');
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);

  return (
    <UserContext.Provider value={{
      username,
      setUsername,
      avatarUrl,
      setAvatarUrl
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 