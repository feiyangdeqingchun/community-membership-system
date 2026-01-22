
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 定义用户类型
export type User = {
  id: string;
  name: string;
  username: string;
  // password?: string; // 前端不再持有密码
  points: number;
  is_member: boolean;
  join_date: string; // ISO Date string
  level: string;
};

export type Merchant = {
  id: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  currentUser: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string) => Promise<{ username: string } | null>;
  addPoints: (points: number) => Promise<boolean>;
  isAdmin: boolean;
  users: User[]; // Alias for allUsers for compatibility
  allUsers: User[];
  merchants: Merchant[];
  refreshData: () => void;
  addMember: (name: string) => Promise<{ username: string } | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const router = useRouter();

  // 初始化加载数据
  useEffect(() => {
    // 尝试恢复会话
    const storedUser = localStorage.getItem('app_current_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('app_current_user');
      }
    }

    refreshData();
  }, []);

  const refreshData = () => {
    // 获取用户列表
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllUsers(data);
        }
      })
      .catch(console.error);

    // 获取商户列表
    fetch('/api/merchants')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMerchants(data);
        }
      })
      .catch(console.error);
  };

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem('app_current_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('app_current_user');
    router.push('/login');
  };

  const register = async (name: string) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        const newUser = await res.json();
        await refreshData(); // 刷新列表
        return { username: newUser.username }; // 返回新创建的用户名
      }
    } catch (error) {
      console.error('Register error', error);
    }
    return null;
  };

  const addPoints = async (points: number) => {
    if (!user) return false;
    try {
      const res = await fetch(`/api/users/${user.id}/points`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        // 更新当前用户状态
        setUser(updatedUser);
        localStorage.setItem('app_current_user', JSON.stringify(updatedUser));

        // 更新列表中的状态
        setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        return true;
      }
    } catch (error) {
      console.error('Add points error', error);
    }
    return false;
  };

  const isAdmin = user?.username === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        isLoading: false,
        login,
        logout,
        register,
        addMember: register,
        addPoints,
        isAdmin,
        allUsers,
        users: allUsers,
        merchants,
        refreshData
      }}
    >
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
