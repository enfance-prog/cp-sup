'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ja } from 'date-fns/locale/ja';

registerLocale('ja', ja);

interface Training {
  id: string;
  name: string;
  category: 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C' | 'CATEGORY_D' | 'CATEGORY_E' | 'CATEGORY_F' | null;
  points: number | null;
  date: string;
  isOnline: boolean;
}

interface EditTrainingModalProps {
  isOpen: boolean;
  training: Training | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditTrainingModal({ isOpen, training, onClose, onSuccess }: EditTrainingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '' as 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C' | 'CATEGORY_D' | 'CATEGORY_E' | 'CATEGORY_F' | '',
    points: '' as number | '',
    date: new Date(),
    isOnline: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (training && isOpen) {
      setFormData({
        name: training.name,
        category: training.category || '',
        points: training.points === null ? '' : training.points,
        date: new Date(training.date),
        isOnline: training.isOnline,
      });
    }
  }, [training, isOpen]);

  if (!isOpen || !training) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        points: formData.points === '' ? null : formData.points,
        category: formData.category === '' ? null : formData.category,
      };

      const response = await fetch(`/api/trainings/${training.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        alert('更新に失敗しました');
      }
    } catch {
      alert('更新に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800">研修を編集</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={submitting}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="form-label">研修名</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>
          {/* カテゴリー */}
          <div>
            <label className="form-label">カテゴリー（群） <span className="text-xs text-gray-500 font-normal">（任意）</span></label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C' | 'CATEGORY_D' | 'CATEGORY_E' | 'CATEGORY_F' | '' })}
              className="select-field"
            >
              <option value="">未選択</option>
              <option value="CATEGORY_A">1群</option>
              <option value="CATEGORY_B">2群</option>
              <option value="CATEGORY_C">3群</option>
              <option value="CATEGORY_D">4群</option>
              <option value="CATEGORY_E">5群</option>
              <option value="CATEGORY_F">6群</option>
            </select>
          </div>
          {/* ポイント */}
          <div>
            <label className="form-label">取得ポイント <span className="text-xs text-gray-500 font-normal">（任意）</span></label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: e.target.value === '' ? '' : parseInt(e.target.value) })}
              className="input-field"
            />
          </div>

          <div>
            <label className="form-label">受講日</label>
            <div className="w-full">
              <DatePicker
                locale="ja"
                dateFormat="yyyy年M月d日"
                selected={formData.date}
                onChange={(date) => setFormData({ ...formData, date: date || new Date() })}
                className="input-field w-full"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-isOnline"
              checked={formData.isOnline}
              onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
              className="checkbox-field"
            />
            <label htmlFor="edit-isOnline" className="text-sm text-gray-700 cursor-pointer">
              オンライン研修
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={submitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                '更新中...'
              ) : (
                <>
                  <FaSave />
                  更新
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}