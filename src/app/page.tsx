import Link from 'next/link';
import Image from 'next/image';
import { FaShieldAlt, FaCalendarCheck, FaChartLine, FaUserCheck } from 'react-icons/fa';

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-text-main selection:bg-secondary-200 selection:text-primary-800">
      {/* ヘッダー */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/60 backdrop-blur-md border-b border-white/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 overflow-hidden rounded-lg shadow-sm">
              <Image
                src="/logo.png"
                alt="ロゴ"
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-lg md:text-xl font-serif font-medium text-primary-600 tracking-wider">
              臨床心理士<br className="sm:hidden" />ポイントマネージャー
            </h1>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/sign-in"
              className="btn-outline hidden sm:inline-block text-sm"
            >
              ログイン
            </Link>
            <Link
              href="/sign-up"
              className="btn-secondary text-sm shadow-sm"
            >
              新規登録
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 pt-20">
        {/* ヒーローセクション */}
        <section className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-secondary-100 text-primary-700 text-sm tracking-widest font-medium animate-fade-in-slow">
              Clinical Psychologist Portal
            </span>
            <h2 className="text-4xl sm:text-6xl font-serif font-medium text-text-main mb-8 leading-tight animate-slide-up-slow">
              創りたいのは、<br className="hidden sm:block" />
              対話のための<br />
              <span className="text-primary-500 relative inline-block">
                「余白」
                <span className="absolute bottom-1 left-0 w-full h-3 bg-secondary-200/50 -z-10 bg-opacity-50 -rotate-1 rounded-sm"></span>
              </span>
              <span className="text-3xl sm:text-5xl ml-2 sm:ml-4">です。</span>
            </h2>
            <p className="text-lg sm:text-xl text-text-muted mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up-slow" style={{ animationDelay: '0.2s' }}>
              専門性の高いスキルが、資格の更新や手続きで消耗しないよう<br className="hidden sm:block" />
              皆様のキャリアに寄り添い、いつもサポートします。
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up-slow" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/sign-up"
                className="btn-primary text-lg px-10 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                無料で始める
              </Link>
              <Link
                href="#features"
                className="text-text-muted hover:text-primary-600 transition-colors border-b border-transparent hover:border-primary-600 pb-0.5"
              >
                詳細を見る &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* 機能紹介セクション */}
        <section id="features" className="py-24 px-6 bg-white/40 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-serif text-text-main mb-4">
                心地よい機能
              </h3>
              <p className="text-text-muted font-light">必要な機能だけを、シンプルに美しく。</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <FaCalendarCheck className="text-2xl text-primary-500" />,
                  title: "研修管理",
                  desc: "受講した研修を美しく記録。オンライン・対面の区別も自動で。"
                },
                {
                  icon: <FaChartLine className="text-2xl text-primary-500" />,
                  title: "ポイント集計",
                  desc: "複雑な計算は不要。カテゴリー別の達成度を一目で確認。"
                },
                {
                  icon: <FaUserCheck className="text-2xl text-primary-500" />,
                  title: "資格情報",
                  desc: "大切な資格番号や有効期限を、忘れないように大切に保管。"
                },
                {
                  icon: <FaShieldAlt className="text-2xl text-text-muted" />,
                  title: "オンライン申請",
                  desc: "将来的なワンクリック更新を目指して、現在準備中です。",
                  isPending: true
                },
              ].map((item, i) => (
                <div key={i} className={`tool-card flex flex-col items-center text-center group ${item.isPending ? 'opacity-80' : ''}`}>
                  <div className={`w-14 h-14 ${item.isPending ? 'bg-gray-100' : 'bg-primary-50'} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500`}>
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-serif font-bold mb-3 text-text-main">{item.title}</h4>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {item.desc}
                  </p>
                  {item.isPending && (
                    <span className="mt-4 px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">Coming Soon</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* オンライン更新手続き説明セクション */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-secondary-200/50">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                  <FaShieldAlt className="text-3xl text-gray-400" />
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <h3 className="text-2xl font-serif font-bold text-text-main">
                      未来の更新手続きについて
                    </h3>
                    <span className="bg-secondary-100 text-primary-700 px-4 py-1 rounded-full text-xs font-medium self-start sm:self-auto">
                      準備中
                    </span>
                  </div>
                  <p className="text-text-muted leading-loose mb-6">
                    私たちは、このアプリから直接、公式団体へワンクリックで更新申請ができる未来を描いています。<br />
                    現在は郵送での手続きが必要ですが、将来的にシステムが連携された暁には、<br className="hidden sm:block" />
                    まるでカフェで注文するようにスムーズな更新体験をお届けします。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* セキュリティ説明セクション */}
        <section className="py-20 px-6 bg-primary-50/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block p-4 bg-white rounded-full shadow-sm mb-6">
              <FaShieldAlt className="text-4xl text-primary-500" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-6 text-text-main">
              安心という名の土台
            </h3>
            <p className="text-text-muted leading-loose max-w-2xl mx-auto">
              GoogleやAppleのアカウント連携による、生体認証（指紋・顔認証）を活用したログイン。<br />
              パスワードを覚えるストレスから解放され、<br />
              大切なデータは堅牢なセキュリティで守られます。
            </p>
          </div>
        </section>

        {/* 使い方セクション */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-serif text-center text-text-main mb-16">
              始め方は、とてもシンプル
            </h3>
            <div className="space-y-8">
              {[
                { step: "01", title: "アカウント登録", desc: "お使いのGoogle/Appleアカウントで、すぐに始められます。" },
                { step: "02", title: "資格情報の入力", desc: "お手元の登録証を見ながら、基本情報を入力します。" },
                { step: "03", title: "研修の記録", desc: "これまでの研修履歴や、これからの予定を記録していきましょう。" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 sm:gap-10 group bg-white/40 p-6 rounded-2xl hover:bg-white/80 transition-all duration-300">
                  <div className="text-4xl font-serif text-primary-200 font-bold group-hover:text-primary-400 transition-colors">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-text-main font-serif">{item.title}</h4>
                    <p className="text-text-muted">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="py-32 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-text-main mb-8">
              あなたのキャリアに、<br />優しい管理を。
            </h3>
            <p className="text-lg text-text-muted mb-12">
              まずは無料で、使い心地をお試しください。
            </p>
            <Link
              href="/sign-up"
              className="btn-primary text-lg px-12 py-5 shadow-xl hover:shadow-2xl transition-all"
            >
              無料でアカウント作成
            </Link>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-text-main text-secondary-50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* サポートセクション */}


          <div className="flex flex-col md:flex-row justify-between items-center w-full border-t border-secondary-800 pt-8 gap-4">
            <p className="text-secondary-400 text-sm font-light tracking-wider">
              © 2025 enfance / Clinical Psychologist Support
            </p>
            <div className="flex gap-6 text-sm text-secondary-400">
              <Link href="#" className="hover:text-secondary-200 transition-colors">プライバシーポリシー</Link>
              <Link href="#" className="hover:text-secondary-200 transition-colors">利用規約</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
