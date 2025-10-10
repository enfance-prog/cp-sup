'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { FaBars, FaBell } from 'react-icons/fa';

interface HeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const { user } = useUser();
  const [displayName, setDisplayName] = useState('');
  
  const fetchUserName = useCallback(async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        // プロフィールで入力された名前があればそれを優先、なければClerkの名前を使用
        if (data.name && data.name.trim()) {
          setDisplayName(data.name);
        } else {
          // Clerkから取得した名前を使用（GoogleまたはAppleの登録名）
          const clerkName = user?.firstName 
            ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
            : user?.lastName || '';
          setDisplayName(clerkName);
        }
      }
    } catch (error) {
      console.error('ユーザー名の取得に失敗しました:', error);
      // エラー時はClerkの名前をフォールバック
      const clerkName = user?.firstName 
        ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
        : user?.lastName || '';
      setDisplayName(clerkName);
    }
  }, [user]);
  
  useEffect(() => {
    fetchUserName();
  }, [fetchUserName]);

  // プロフィール更新イベントをリスン
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchUserName();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [fetchUserName]);
  
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm z-10 sticky top-0">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 gap-2">
        {/* ハンバーガーメニュー */}
        <button
          type="button"
          className="text-gray-500 hover:text-gray-600 lg:hidden transition-colors flex-shrink-0"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">メニューを開く</span>
          <FaBars className="h-6 w-6" />
        </button>

        {/* ページタイトル */}
        <div className="flex items-center flex-1 min-w-0 px-2">
          <h1 className="text-sm sm:text-base lg:text-xl font-semibold text-gray-800 truncate">
            ようこそ、{displayName}さん
          </h1>
        </div>

        {/* 右側のアイコン */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          {/* 通知ボタン */}
          <button
            type="button"
            className="rounded-full bg-white/50 p-2 text-gray-400 hover:text-gray-500 hover:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <span className="sr-only">通知を見る</span>
            <FaBell className="h-5 w-5" />
          </button>

          {/* ユーザープロフィール */}
          <div className="flex items-center gap-2">
            <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold shadow-md">
              {(displayName?.charAt(0) || user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U').toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 truncate max-w-[120px] lg:max-w-none">
              {displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}