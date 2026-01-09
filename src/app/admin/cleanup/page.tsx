'use client';

import { useState } from 'react';
import { FaTrash, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

interface SearchResult {
    userId: string;
    name: string;
    email: string;
    certNumber: string;
    acquisitionDate: string;
}

export default function CleanupPage() {
    const [certNumber, setCertNumber] = useState('');
    const [result, setResult] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setMessage(null);

        try {
            const response = await fetch(`/api/admin/cleanup?certNumber=${certNumber}`);
            if (response.ok) {
                const data = await response.json();
                setResult(data);
            } else {
                setMessage({ type: 'error', text: '該当するユーザーが見つかりませんでした' });
            }
        } catch {
            setMessage({ type: 'error', text: '検索中にエラーが発生しました' });
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async () => {
        if (!result || !confirm(`本当に ${result.name} さんの資格情報（${result.certNumber}）を削除して通知を送りますか？`)) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/admin/cleanup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: result.userId,
                    certNumber: result.certNumber,
                }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: '資格情報を削除し、ユーザーに通知を送信しました。' });
                setResult(null);
                setCertNumber('');
            } else {
                setMessage({ type: 'error', text: '削除に失敗しました' });
            }
        } catch {
            setMessage({ type: 'error', text: '通信エラーが発生しました' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaExclamationTriangle className="text-red-600" />
                    資格情報 削除ツール
                </h1>

                <form onSubmit={handleSearch} className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        臨床心理士番号
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={certNumber}
                            onChange={(e) => setCertNumber(e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="12345"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
                        >
                            検索
                        </button>
                    </div>
                </form>

                {message && (
                    <div className={`p-4 rounded-md mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        <p className="flex items-center gap-2">
                            {message.type === 'success' ? <FaCheck /> : <FaExclamationTriangle />}
                            {message.text}
                        </p>
                    </div>
                )}

                {result && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">検索結果</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-500 w-24 inline-block">氏名:</span> {result.name}</p>
                            <p><span className="text-gray-500 w-24 inline-block">メール:</span> {result.email}</p>
                            <p><span className="text-gray-500 w-24 inline-block">番号:</span> {result.certNumber}</p>
                            <p><span className="text-gray-500 w-24 inline-block">取得日:</span> {new Date(result.acquisitionDate).toLocaleDateString()}</p>
                        </div>

                        <button
                            onClick={handleRevoke}
                            disabled={loading}
                            className="w-full mt-6 bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-bold"
                        >
                            <FaTrash />
                            削除して通知する
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
