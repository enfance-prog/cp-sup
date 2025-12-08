'use client';

import { useState } from 'react';
import { FaTimes, FaCheck, FaTrash, FaEdit, FaWifi } from 'react-icons/fa';
import { format } from 'date-fns';

interface PlannedTraining {
  id: string;
  name: string;
  category: 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C' | 'CATEGORY_D' | 'CATEGORY_E' | 'CATEGORY_F' | null;
  points: number | null;
  trainingDate: string;
  isOnline: boolean;
}

interface PastTrainingDialogProps {
  isOpen: boolean;
  plannedTrainings: PlannedTraining[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function PastTrainingDialog({
  isOpen,
  plannedTrainings,
  onClose,
  onSuccess,
}: PastTrainingDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'CATEGORY_A' as 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C' | 'CATEGORY_D' | 'CATEGORY_E' | 'CATEGORY_F',
    points: 1,
    date: '',
    isOnline: false,
  });

  if (!isOpen || plannedTrainings.length === 0) return null;

  const currentTraining = plannedTrainings[currentIndex];

  // 初期値を設定
  if (!isEditing && currentTraining) {
    const initialData = {
      name: currentTraining.name,
      category: currentTraining.category || 'CATEGORY_A',
      points: currentTraining.points || 1,
      date: new Date(currentTraining.trainingDate).toISOString().split('T')[0],
      isOnline: currentTraining.isOnline,
    };

    // formDataと異なる場合のみ更新（無限ループ防止）
    if (JSON.stringify(formData) !== JSON.stringify(initialData)) {
      setFormData(initialData);
    }
  }

  const handleRegister = async () => {
    if (!currentTraining) return;

    setSubmitting(true);
    try {
      // 研修を登録
      const response = await fetch('/api/trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        alert('研修の登録に失敗しました');
        setSubmitting(false);
        return;
      }

      // 受講予定研修を削除
      await fetch(`/api/planned-trainings/${currentTraining.id}`, {
        method: 'DELETE',
      });

      // 次の研修に進むか、終了
      if (currentIndex < plannedTrainings.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsEditing(false);
      } else {
        onSuccess();
        onClose();
      }
    } catch {
      alert('処理に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOnly = async () => {
    if (!currentTraining) return;
    if (!confirm('この受講予定研修を登録せずに削除しますか？')) return;

    setSubmitting(true);
    try {
      await fetch(`/api/planned-trainings/${currentTraining.id}`, {
        method: 'DELETE',
      });

      // 次の研修に進むか、終了
      if (currentIndex < plannedTrainings.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsEditing(false);
      } else {
        onSuccess();
        onClose();
      }
    } catch {
      alert('削除に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      CATEGORY_A: '1群',
      CATEGORY_B: '2群',
      CATEGORY_C: '3群',
      CATEGORY_D: '4群',
      CATEGORY_E: '5群',
      CATEGORY_F: '6群',
    };
    return labels[category] || category;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar animate-slide-up">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-primary-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">研修日を過ぎた受講予定</h2>
            <p className="text-sm text-gray-600 mt-1">
              {currentIndex + 1} / {plannedTrainings.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-white"
            disabled={submitting}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              研修日を過ぎた受講予定研修があります。研修登録をしてノートから削除しますか？
            </p>
          </div>

          {isEditing ? (
            /* 編集モード */
            <div className="space-y-4">
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

              <div>
                <label className="form-label">カテゴリー（群）</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="select-field"
                  required
                >
                  <option value="CATEGORY_A">1群</option>
                  <option value="CATEGORY_B">2群</option>
                  <option value="CATEGORY_C">3群</option>
                  <option value="CATEGORY_D">4群</option>
                  <option value="CATEGORY_E">5群</option>
                  <option value="CATEGORY_F">6群</option>
                </select>
              </div>

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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="dialog-isOnline"
                  checked={formData.isOnline}
                  onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                  className="checkbox-field"
                />
                <label htmlFor="dialog-isOnline" className="text-sm text-gray-700 cursor-pointer">
                  オンライン研修
                </label>
              </div>

              <button
                onClick={() => setIsEditing(false)}
                className="btn-secondary w-full"
              >
                編集を終了
              </button>
            </div>
          ) : (
            /* 表示モード */
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">
                    {currentTraining.name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {currentTraining.category && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">群:</span>
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs font-medium">
                          {getCategoryLabel(currentTraining.category)}
                        </span>
                      </div>
                    )}
                    {currentTraining.points && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">ポイント:</span>
                        <span className="text-primary-600 font-semibold">{currentTraining.points}pt</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="font-medium">受講日:</span>
                      <span>{format(new Date(currentTraining.trainingDate), 'yyyy年M月d日')}</span>
                    </div>
                    {currentTraining.isOnline && (
                      <div className="flex items-center gap-1 text-primary-600">
                        <FaWifi className="text-xs" />
                        <span className="text-xs font-medium">オンライン</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-primary-600 transition-colors p-2 rounded-lg hover:bg-white"
                  title="編集"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
              </div>

              {(!currentTraining.category || !currentTraining.points) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-800">
                  群またはポイントが未入力です。「編集する」ボタンから入力してください。
                </div>
              )}
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleDeleteOnly}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
              disabled={submitting}
            >
              <FaTrash />
              登録しないで削除
            </button>
            <button
              onClick={handleRegister}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={submitting || !currentTraining.category || !currentTraining.points}
            >
              {submitting ? (
                '処理中...'
              ) : (
                <>
                  <FaCheck />
                  登録する
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
