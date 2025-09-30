'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { SignOutButton } from '@clerk/nextjs';
import { FaHome, FaUser, FaBook, FaSignOutAlt, FaTimes, FaSync } from 'react-icons/fa';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/dashboard',
      title: 'ダッシュボード',
      icon: <FaHome className="w-5 h-5" />
    },
    {
      href: '/profile',
      title: 'プロフィール',
      icon: <FaUser className="w-5 h-5" />
    },
    {
      href: '/training-history',
      title: '研修履歴',
      icon: <FaBook className="w-5 h-5" />
    },
    {
      href: '/renewal',
      title: '資格の更新',
      icon: <FaSync className="w-5 h-5" />,
      disabled: true
    }
  ];

  return (
    <>
      {/* オーバーレイ (モバイル時のみ) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* サイドバー */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gradient-to-br from-primary-600 to-primary-700 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* サイドバーヘッダー */}
          <div className="flex h-16 items-center justify-between px-4 bg-primary-700/50 backdrop-blur-sm">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="ロゴ" 
                width={32} 
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg font-bold truncate hidden sm:inline">
                臨床心理士ポータル
              </span>
            </Link>
            <button
              className="rounded-md p-1 text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-white/50 lg:hidden transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* ナビゲーションメニュー */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  {item.disabled ? (
                    <div
                      className="flex items-center rounded-lg px-4 py-3 text-primary-200/50 cursor-not-allowed"
                      title="準備中"
                    >
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center rounded-lg px-4 py-3 transition-all ${
                        pathname === item.href
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-primary-50 hover:bg-white/10 hover:text-white'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* サイドバーフッター */}
          <div className="border-t border-primary-500/30 p-4">
            <SignOutButton>
              <button className="flex w-full items-center rounded-lg px-4 py-3 text-primary-50 hover:bg-white/10 hover:text-white transition-all">
                <FaSignOutAlt className="w-5 h-5" />
                <span className="ml-3">ログアウト</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </aside>
    </>
  );
}
