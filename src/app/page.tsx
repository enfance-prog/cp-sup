import Link from 'next/link';
import { FaShieldAlt, FaCalendarCheck, FaChartLine, FaUserCheck } from 'react-icons/fa';

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">臨床心理士ポイントマネージャー</h1>
          <div className="flex gap-4">
            <Link 
              href="/sign-in" 
              className="btn-outline text-sm sm:text-base"
            >
              ログイン
            </Link>
            <Link 
              href="/sign-up" 
              className="btn-primary text-sm sm:text-base"
            >
              新規登録
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1">
        {/* ヒーローセクション */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6 animate-fade-in">
              資格更新を
              <span className="text-primary-500">もっと簡単に</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 animate-slide-up">
              臨床心理士の資格更新に必要な研修を一元管理。
              <br className="hidden sm:block" />
              資格喪失のリスクを減らし、安心して業務に専念できます。
            </p>
            <Link 
              href="/sign-up" 
              className="btn-primary text-lg px-8 py-4 inline-block animate-slide-up"
            >
              今すぐ始める
            </Link>
          </div>
        </section>

        {/* 機能紹介セクション */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
              主な機能
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="tool-card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCalendarCheck className="text-3xl text-primary-600" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-800">研修管理</h4>
                <p className="text-gray-600">
                  受講した研修を簡単に登録。オンライン・対面の区別も自動管理。
                </p>
              </div>

              <div className="tool-card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaChartLine className="text-3xl text-primary-600" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-800">ポイント集計</h4>
                <p className="text-gray-600">
                  取得ポイントをカテゴリー別に自動集計。更新要件の達成状況を確認。
                </p>
              </div>

              <div className="tool-card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUserCheck className="text-3xl text-primary-600" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-800">資格情報</h4>
                <p className="text-gray-600">
                  資格番号や取得日、有効期限を一元管理。更新時期を見逃しません。
                </p>
              </div>

              <div className="tool-card text-center opacity-50">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShieldAlt className="text-3xl text-gray-500" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-600">オンライン更新手続き</h4>
                <div className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium mb-3">
                  準備中
                </div>
                <p className="text-gray-500 text-sm">
                  将来的にワンクリックで更新申請が可能になります。現在は公式団体によるシステム整備を待っている状態です。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* オンライン更新手続き説明セクション */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="tool-card bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaShieldAlt className="text-2xl text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-700">
                      オンライン更新手続き
                    </h3>
                    <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                      準備中
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    将来的に、このアプリから直接公式団体へワンクリックで更新申請ができるようになります。
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-blue-600">💡</span>
                      この機能について
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      公式団体が外部システムとの連携機能（アクセス許可の仕組み）を導入することで、このアプリから直接、更新手続きや期限延長の申請が可能になります。現在は郵送での手続きが必要ですが、公式団体でこの仕組みが整備され次第、オンラインでの簡単な手続きを実現します。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* セキュリティ説明セクション */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="tool-card">
              <div className="flex items-start gap-4">
                <FaShieldAlt className="text-4xl text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    安全なログイン方法
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    このアプリでは、GoogleやAppleなどの信頼できるアカウントでログインできます。
                    これらのサービスでは生体認証（指紋認証や顔認証）を使用することで、
                    パスワードを覚える必要がなく、より安全にアプリを利用できます。
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    パスワードレス認証により、パスワードの流出リスクがなく、
                    高い安全性を保ちながら快適にご利用いただけます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 使い方セクション */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
              使い方
            </h3>
            <div className="space-y-6">
              <div className="tool-card flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-gray-800">アカウント登録</h4>
                  <p className="text-gray-700">
                    Google、Apple、またはメールアドレスでアカウントを作成します。
                  </p>
                </div>
              </div>

              <div className="tool-card flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-gray-800">資格情報の登録</h4>
                  <p className="text-gray-700">
                    臨床心理士番号、お名前、資格取得日を登録します。
                  </p>
                </div>
              </div>

              <div className="tool-card flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-gray-800">研修の記録</h4>
                  <p className="text-gray-700">
                    受講した研修を登録し、ポイントを自動集計。更新要件の達成状況を確認できます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              今すぐ始めましょう
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              資格更新の管理を簡単に。無料で今すぐ始められます。
            </p>
            <Link 
              href="/sign-up" 
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              無料で始める
            </Link>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* サポートセクション */}
          <div className="text-center mb-6">
            <a 
              href="https://lin.ee/UnZgvAz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 mb-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 bg-[#06C755] rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-300 font-medium">公式LINEサポート</p>
                <p className="text-xs text-gray-400">不具合報告・機能追加の要望などを受付中</p>
              </div>
            </a>

          </div>
          
          {/* コピーライト */}
          <div className="text-center pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              © 2025 enfance. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
