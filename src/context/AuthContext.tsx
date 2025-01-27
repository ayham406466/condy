import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface AuthContextType {
  user: any;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // For admin login, handle separately
      if (username === 'Ayham Mohammed' && password === '548620') {
        setUser({ 
          email: 'admin@example.com',
          role: 'admin'
        });
        toast.success('تم تسجيل الدخول بنجاح');
        return;
      }

      // For regular users
      const email = `${username.toLowerCase().replace(/\s+/g, '.')}@student.edu`;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success('تم تسجيل الدخول بنجاح');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('فشل تسجيل الدخول');
      throw error;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const email = `${username.toLowerCase().replace(/\s+/g, '.')}@student.edu`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          }
        }
      });

      if (error) {
        throw error;
      }

      toast.success('تم إنشاء الحساب بنجاح');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('فشل إنشاء الحساب');
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('فشل تسجيل الخروج');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}