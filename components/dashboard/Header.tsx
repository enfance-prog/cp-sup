'use client';

import { useUser } from '@clerk/nextjs';
import { FaBars, FaBell } from 'react-icons/fa';

interface HeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const { user } = useUser();
  
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm z-10 sticky top-0">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* ハンバーガーメニュー */}
        <button
          type="button"
          className="text-gray-500 hover:text-gray-600 lg:hidden transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">メニューを開く</span>
          <FaBars className="h-6 w-6" />
        </button>

        {/* ページタイトル - LG以上で表示 */}
        <div className="hidden lg:flex lg:items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            ようこそ、{user?.firstName || user?.lastName || ''}さん
          </h1>
        </div>

        {/* 右側のアイコン */}
        <div className="flex items-center space-x-4">
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
              {(user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U').toUpperCase()}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}