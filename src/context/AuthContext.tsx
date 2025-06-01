
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  hasAcceptedTerms: boolean;
  subscription: 'free' | 'premium';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  acceptTerms: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
  hasAcceptedTerms: boolean;
  isPremium: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is stored in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock credentials for demo purposes
    if (username === 'admin' && password === 'admin123') {
      const adminUser = {
        id: '1',
        username: 'admin',
        role: 'admin' as const,
        hasAcceptedTerms: false,
        subscription: 'premium' as const
      };
      
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      
      toast({
        title: 'Welcome Admin',
        description: 'You have successfully logged in as admin',
      });
      
      navigate('/admin');
      return true;
    } 
    else if (username === 'user' && password === 'user123') {
      const regularUser = {
        id: '2',
        username: 'user',
        role: 'user' as const,
        hasAcceptedTerms: false,
        subscription: 'free' as const
      };
      
      setUser(regularUser);
      localStorage.setItem('user', JSON.stringify(regularUser));
      
      toast({
        title: 'Welcome',
        description: 'You have successfully logged in',
      });
      
      navigate('/');
      return true;
    }
    else if (username === 'premium' && password === 'premium123') {
      const premiumUser = {
        id: '3',
        username: 'premium',
        role: 'user' as const,
        hasAcceptedTerms: false,
        subscription: 'premium' as const
      };
      
      setUser(premiumUser);
      localStorage.setItem('user', JSON.stringify(premiumUser));
      
      toast({
        title: 'Welcome Premium User',
        description: 'You have successfully logged in with premium access',
      });
      
      navigate('/');
      return true;
    }
    
    toast({
      title: 'Login Failed',
      description: 'Invalid username or password',
      variant: 'destructive',
    });
    return false;
  };

  const acceptTerms = () => {
    if (user) {
      const updatedUser = { ...user, hasAcceptedTerms: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: 'Terms Accepted',
        description: 'You can now access all features',
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
    navigate('/');
  };

  const value = {
    user,
    login,
    logout,
    acceptTerms,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
    hasAcceptedTerms: user?.hasAcceptedTerms || false,
    isPremium: user?.subscription === 'premium'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
