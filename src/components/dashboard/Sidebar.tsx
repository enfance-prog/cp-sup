'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { FaHome, FaUser, FaBook, FaSignOutAlt, FaTimes, FaSync, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();

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
      {/* オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* サイドバー - 右側から表示 */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-64 transform bg-gradient-to-br from-primary-600 to-primary-700 text-white transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex h-full flex-col">
          {/* サイドバーヘッダー */}
          <div className="flex h-16 items-center justify-between px-4 bg-primary-700/50 backdrop-blur-sm">
            <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
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
              className="rounded-md p-1 text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* ユーザー情報セクション */}
          <div className="px-4 py-6 border-b border-primary-500/30">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-white/20 flex items-center justify-center text-white font-semibold shadow-md flex-shrink-0">
                {user?.hasImage ? (
                  <Image
                    src={user.imageUrl}
                    alt="User avatar"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-lg">
                    {(user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U').toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.firstName || user?.lastName
                    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                    : 'ユーザー'}
                </p>
                <p className="text-xs text-primary-100 truncate">
                  {user?.primaryEmailAddress?.emailAddress || ''}
                </p>
              </div>
            </div>
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
                      className={`flex items-center rounded-lg px-4 py-3 transition-all ${pathname === item.href
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

          {/* サポートセクション */}
          <div className="px-4 py-4 border-t border-primary-500/30">
            <p className="text-xs text-primary-200 mb-3 px-2 font-medium">サポート・ご要望</p>
            <div className="space-y-2">
              <a
                href="https://lin.ee/UnZgvAz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 bg-[#06C755]/10 hover:bg-[#06C755]/20 text-[#06C755] rounded-lg transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-[#06C755] flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                  <span className="text-lg font-bold">L</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-[#06C755] transition-colors">公式LINEで相談</p>
                  <p className="text-[10px] text-primary-200 truncate">バグ報告・機能要望も</p>
                </div>
              </a>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <a
                  href="https://x.com/enfance_222"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-all"
                  title="X (Twitter) DM"
                >
                  <FaXTwitter className="w-5 h-5 mb-1" />
                  <span className="text-[10px]">DMで相談</span>
                </a>
                <a
                  href="mailto:enfance.inc@gmail.com"
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
                  title="メールで相談"
                >
                  <FaEnvelope className="w-5 h-5 mb-1" />
                  <span className="text-[10px]">Email</span>
                </a>
              </div>
            </div>
          </div>

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
