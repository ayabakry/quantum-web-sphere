
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
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
    // This is a mock login function
    // In a real app, you would validate against an API
    
    // Mock credentials for demo purposes
    if (username === 'admin' && password === 'admin123') {
      const adminUser = {
        id: '1',
        username: 'admin',
        role: 'admin' as const
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
        role: 'user' as const
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
    
    toast({
      title: 'Login Failed',
      description: 'Invalid username or password',
      variant: 'destructive',
    });
    return false;
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
    isAdmin: user?.role === 'admin'
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
