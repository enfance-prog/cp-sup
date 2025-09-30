'use client';

import { useState } from 'react';
import { FaTimes, FaWifi, FaCheck } from 'react-icons/fa';

interface AddTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTrainingModal({ isOpen, onClose, onSuccess }: AddTrainingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'CATEGORY_A' as 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C',
    points: 1,
    date: new Date().toISOString().split('T')[0],
    isOnline: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
        onClose();
        setFormData({
          name: '',
          category: 'CATEGORY_A',
          points: 1,
          date: new Date().toISOString().split('T')[0],
          isOnline: false,
        });
      } else {
        const data = await response.json();
        setError(data.error || '研修の登録に失敗しました');
      }
    } catch {
      setError('研修の登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar animate-slide-up">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">研修を追加</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* 研修名 */}
          <div>
            <label className="form-label">研修名</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="例: 認知行動療法の基礎研修"
              required
            />
          </div>

          {/* カテゴリー */}
          <div>
            <label className="form-label">カテゴリー（群）</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C' })}
              className="select-field"
              required
            >
              <option value="CATEGORY_A">1群</option>
              <option value="CATEGORY_B">2群</option>
              <option value="CATEGORY_C">3群</option>
            </select>
          </div>

          {/* ポイント */}
          <div>
            <label className="form-label">取得ポイント</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
              className="input-field"
              required
            />
          </div>

          {/* 受講日 */}
          <div>
            <label className="form-label">受講日</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field"
              required
            />
          </div>

          {/* オンライン研修チェックボックス */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.isOnline}
                onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <div className="flex items-center gap-2">
                <FaWifi className="text-primary-500" />
                <span className="text-sm font-medium text-gray-700">
                  オンライン研修
                </span>
              </div>
            </label>
            <p className="text-xs text-gray-500 mt-2 ml-8">
              オンライン研修は最大7ポイントまでカウントされます
            </p>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>読み込み中...</>
              ) : (
                <>
                  <FaCheck />
                  登録
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
