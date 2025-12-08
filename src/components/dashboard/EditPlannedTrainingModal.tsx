'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaWifi, FaCalendarAlt, FaYenSign } from 'react-icons/fa';

interface PlannedTraining {
  id: string;
  name: string;
  category: 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C' | 'CATEGORY_D' | 'CATEGORY_E' | 'CATEGORY_F' | null;
  points: number | null;
  applicationDeadline: string | null;
  paymentDeadline: string | null;
  trainingDate: string;
  fee: number | null;
  isOnline: boolean;
  memo: string | null;
  remindApplication: boolean;
  remindPayment: boolean;
  remindTraining: boolean;
}

interface EditPlannedTrainingModalProps {
  isOpen: boolean;
  plannedTraining: PlannedTraining | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditPlannedTrainingModal({
  isOpen,
  plannedTraining,
  onClose,
  onSuccess,
}: EditPlannedTrainingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '' as '' | 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C' | 'CATEGORY_D' | 'CATEGORY_E' | 'CATEGORY_F',
    points: '',
    applicationDeadline: '',
    paymentDeadline: '',
    trainingDate: '',
    fee: '',
    isOnline: false,
    memo: '',
    remindApplication: true,
    remindPayment: true,
    remindTraining: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (plannedTraining) {
      const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        return new Date(dateStr).toISOString().split('T')[0];
      };

      setFormData({
        name: plannedTraining.name,
        category: plannedTraining.category || '',
        points: plannedTraining.points?.toString() || '',
        applicationDeadline: formatDate(plannedTraining.applicationDeadline),
        paymentDeadline: formatDate(plannedTraining.paymentDeadline),
        trainingDate: formatDate(plannedTraining.trainingDate),
        fee: plannedTraining.fee?.toString() || '',
        isOnline: plannedTraining.isOnline,
        memo: plannedTraining.memo || '',
        remindApplication: plannedTraining.remindApplication,
        remindPayment: plannedTraining.remindPayment,
        remindTraining: plannedTraining.remindTraining,
      });
    }
  }, [plannedTraining]);

  if (!isOpen || !plannedTraining) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/planned-trainings/${plannedTraining.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar animate-fade-in">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800">受講予定を編集</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={submitting}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 研修名 */}
          <div>
            <label className="form-label">
              研修名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          {/* 群とポイント（オプショナル） */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-4">
            <div className="text-blue-700 font-semibold text-sm">
              研修情報（事前に判明している場合のみ）
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 群 */}
              <div>
                <label className="form-label">群</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as '' | 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C' | 'CATEGORY_D' | 'CATEGORY_E' | 'CATEGORY_F' })}
                  className="select-field"
                >
                  <option value="">未定</option>
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
                <label className="form-label">ポイント数</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                  className="input-field"
                  placeholder="例: 2"
                />
              </div>
            </div>
          </div>

          {/* 日程セクション */}
          <div className="bg-primary-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 text-primary-700 font-semibold">
              <FaCalendarAlt />
              <span>日程</span>
            </div>

            {/* 研修日 */}
            <div>
              <label className="form-label">
                研修日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                lang="ja-JP"
                value={formData.trainingDate}
                onChange={(e) => setFormData({ ...formData, trainingDate: e.target.value })}
                className="input-field"
                required
              />
            </div>

            {/* 申込期日 */}
            <div>
              <label className="form-label">申込期日</label>
              <input
                type="date"
                lang="ja-JP"
                value={formData.applicationDeadline}
                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                className="input-field"
              />
            </div>

            {/* 支払期日 */}
            <div>
              <label className="form-label">支払期日</label>
              <input
                type="date"
                lang="ja-JP"
                value={formData.paymentDeadline}
                onChange={(e) => setFormData({ ...formData, paymentDeadline: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* 研修費 */}
          <div>
            <label className="form-label flex items-center gap-2">
              <FaYenSign className="text-primary-600" />
              研修費（円）
            </label>
            <input
              type="number"
              min="0"
              value={formData.fee}
              onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
              className="input-field"
            />
          </div>

          {/* オンライン研修 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-isOnline"
              checked={formData.isOnline}
              onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="edit-isOnline" className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <FaWifi className="text-primary-500" />
              オンライン研修
            </label>
          </div>

          {/* 備考 */}
          <div>
            <label className="form-label">備考</label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              className="textarea-field"
              rows={3}
            />
          </div>

          {/* リマインダー設定 */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <div className="text-blue-700 font-semibold text-sm">
              リマインダー設定（3日前にメール通知）
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.remindApplication}
                onChange={(e) => setFormData({ ...formData, remindApplication: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">申込期日のリマインド</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.remindPayment}
                onChange={(e) => setFormData({ ...formData, remindPayment: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">支払期日のリマインド</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.remindTraining}
                onChange={(e) => setFormData({ ...formData, remindTraining: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">研修日のリマインド</span>
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
