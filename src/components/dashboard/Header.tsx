'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { FaBell } from 'react-icons/fa';
import Image from 'next/image';

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

          {/* ユーザープロフィール - クリックでサイドバー開く */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
          >
            <div className="relative h-10 w-10 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-transform hover:scale-105 duration-300">
              {/* 水滴のような形状効果 - 外側の光彩 */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-white/80 to-primary-200/50 rounded-full opacity-70 blur-[1px]"></div>

              <div className="relative h-full w-full rounded-full overflow-hidden border border-white/40">
                {user?.hasImage ? (
                  <div className="relative w-full h-full">
                    {/* 水滴のハイライト効果 */}
                    <div className="absolute inset-0 z-20 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.1)]"></div>
                    <div className="absolute top-[10%] left-[15%] w-[30%] h-[15%] bg-white/90 rounded-[100%] blur-[0.5px] rotate-[-45deg] z-20"></div>
                    <div className="absolute bottom-[10%] right-[15%] w-[15%] h-[15%] bg-white/40 rounded-full blur-[1px] z-20"></div>

                    <Image
                      src={user.imageUrl}
                      alt={displayName || 'User avatar'}
                      width={40}
                      height={40}
                      className="relative z-10 object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center text-white font-semibold">
                    {/* リキッドグラス風のグラデーション背景 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600"></div>

                    {/* 水滴のハイライト効果 */}
                    <div className="absolute inset-0 z-20 rounded-full shadow-[inset_0_2px_6px_rgba(255,255,255,0.7),inset_0_-4px_6px_rgba(0,0,0,0.2)]"></div>
                    <div className="absolute top-[15%] left-[20%] w-[35%] h-[20%] bg-gradient-to-b from-white to-white/0 rounded-[100%] opacity-90 blur-[0.5px] rotate-[-45deg] z-20"></div>

                    {/* イニシャル */}
                    <span className="relative z-10 drop-shadow-md text-sm">
                      {(displayName?.charAt(0) || user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U').toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 truncate max-w-[120px] lg:max-w-none">
              {displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
