'use client';

import { FaExclamationCircle, FaEnvelope, FaFileAlt, FaLock } from 'react-icons/fa';

export default function RenewalPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* ヘッダー */}
      <div className="tool-card">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">資格の更新</h1>
        <p className="text-gray-600">
          資格更新の手続きに関する情報
        </p>
      </div>

      {/* 準備中通知 */}
      <div className="tool-card bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-4">
          <FaExclamationCircle className="text-3xl text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              現在準備中です
            </h3>
            <p className="text-gray-700 leading-relaxed">
              この機能は現在開発中です。将来的には、このページから直接資格更新の申請や、
              やむを得ない理由による期限延長の手続きができるようになります。
            </p>
          </div>
        </div>
      </div>

      {/* API説明セクション */}
      <div className="tool-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <FaLock className="text-2xl text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            なぜこの機能が使えないのか
          </h3>
        </div>
        
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            現在、臨床心理士会（公式団体）では、外部アプリケーションとの連携に必要な
            <strong className="text-primary-600">API（アプリケーション連携の仕組み）</strong>
            を提供していません。
          </p>
          
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">APIとは？</h4>
            <p className="text-sm">
              APIは、公式団体の情報システムと外部アプリが安全にやり取りするための「橋渡し役」のようなものです。
              これがあることで、このアプリから直接、公式団体のシステムに資格更新の申請や各種手続きを送ることができます。
            </p>
          </div>

          <p>
            APIが導入されると、以下のことがこのアプリから直接できるようになります：
          </p>

          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>資格更新の申請をワンクリックで完了</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>怪我や病気による更新期限の延長申請</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>申請状況のリアルタイム確認</span>
            </li>
          </ul>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
            <h4 className="font-bold text-gray-800 mb-2">現在の状況</h4>
            <p className="text-sm">
              公式団体ではまだAPIを運用していないため、現在は郵送による更新手続きのみとなっています。
              将来的にAPIが提供された場合、このアプリでオンライン手続きが可能になります。
            </p>
          </div>
        </div>
      </div>

      {/* 現在の更新方法 */}
      <div className="tool-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FaEnvelope className="text-2xl text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            現在の更新方法
          </h3>
        </div>
        
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            資格の更新は、臨床心理士会（公式団体）への<strong>郵送による申請</strong>が必要です。
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-3">更新に必要なもの</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">1.</span>
                <span>更新申請書（公式サイトからダウンロード）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">2.</span>
                <span>研修受講証明書（15ポイント以上）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">3.</span>
                <span>更新料の振込証明書</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-gray-600">
            詳しい手続き方法は、
            <a 
              href="https://fjcbcp.or.jp/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline font-medium"
            >
              臨床心理士会の公式サイト
            </a>
            をご確認ください。
          </p>
        </div>
      </div>

      {/* 延長申請について */}
      <div className="tool-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <FaFileAlt className="text-2xl text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            更新期限の延長について
          </h3>
        </div>
        
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            妊娠、出産、病気、事故などのやむを得ない理由により、
            更新期限までに必要な研修を受講できない場合は、期限の延長を申請できます。
          </p>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm">
              この機能も将来的には、このアプリから直接申請できるようになる予定です。
              現在は公式団体に直接お問い合わせください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}