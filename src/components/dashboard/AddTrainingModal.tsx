'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaWifi, FaCheck, FaYenSign, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ja } from 'date-fns/locale/ja';

registerLocale('ja', ja);

interface AddTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /* 
  /* 
   * initialData: 受講予定から登録する場合の初期値
   * plannedTrainingId: 登録成功時に削除する受講予定のID
   */
  initialData?: {
    name: string;
    category: 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C' | 'CATEGORY_D' | 'CATEGORY_E' | 'CATEGORY_F' | null;
    points: number | null;
    date: Date;
    isOnline: boolean;
    fee?: number | null;
    transportationFee?: number | null;
    welfareFee?: number | null;
    entertainmentFee?: number | null;
    advertisingFee?: number | null;
    bookFee?: number | null;
    expenseNote?: string | null;
  };
  plannedTrainingId?: string;
}

export default function AddTrainingModal({ isOpen, onClose, onSuccess, initialData, plannedTrainingId }: AddTrainingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '' as 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C' | 'CATEGORY_D' | 'CATEGORY_E' | 'CATEGORY_F' | '',
    points: 1 as number | '',
    date: new Date(),
    isOnline: false,
    fee: '',
    transportationFee: '',
    welfareFee: '',
    entertainmentFee: '',
    advertisingFee: '',
    bookFee: '',
    expenseNote: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  // 初期値が変更されたら反映
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name,
        category: initialData.category || '',
        points: initialData.points === null ? '' : initialData.points,
        date: initialData.date,
        isOnline: initialData.isOnline,
        fee: initialData.fee?.toString() || '',
        transportationFee: initialData.transportationFee?.toString() || '',
        welfareFee: initialData.welfareFee?.toString() || '',
        entertainmentFee: initialData.entertainmentFee?.toString() || '',
        advertisingFee: initialData.advertisingFee?.toString() || '',
        bookFee: initialData.bookFee?.toString() || '',
        expenseNote: initialData.expenseNote || '',
      });
    } else if (isOpen && !initialData) {
      // 通常のオープンの場合はリセット
      setFormData({
        name: '',
        category: '',
        points: 1,
        date: new Date(),
        isOnline: false,
        fee: '',
        transportationFee: '',
        welfareFee: '',
        entertainmentFee: '',
        advertisingFee: '',
        bookFee: '',
        expenseNote: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. 研修実績の登録
      const payload = {
        name: formData.name,
        category: formData.category || null,
        points: formData.points === '' ? null : formData.points,
        date: formData.date.toISOString().split('T')[0],
        isOnline: formData.isOnline,
        fee: formData.fee || '',
        transportationFee: formData.transportationFee || '',
        welfareFee: formData.welfareFee || '',
        entertainmentFee: formData.entertainmentFee || '',
        advertisingFee: formData.advertisingFee || '',
        bookFee: formData.bookFee || '',
        expenseNote: formData.expenseNote || '',
      };
      const response = await fetch('/api/trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '研修の登録に失敗しました');
      }

      // 2. 受講予定からの登録だった場合、元の受講予定を削除
      if (plannedTrainingId) {
        await fetch(`/api/planned-trainings/${plannedTrainingId}`, {
          method: 'DELETE',
        });
      }

      const createdTraining = await response.json().then(data => data.training);
      // @ts-expect-error Parent expects Training type but logic is safe
      onSuccess(createdTraining);
      onClose();

      // フォームをリセット（次は新規かもしれないので）
      setFormData({
        name: '',
        category: '',
        points: 1,
        date: new Date(),
        isOnline: false,
        fee: '',
        transportationFee: '',
        welfareFee: '',
        entertainmentFee: '',
        advertisingFee: '',
        bookFee: '',
        expenseNote: '',
      });

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        setError((err as { message: string }).message);
      } else {
        setError('処理に失敗しました');
      }
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
            <label className="form-label">
              カテゴリー（群） <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C' | 'CATEGORY_D' | 'CATEGORY_E' | 'CATEGORY_F' | '' })}
              className="select-field"
              required
            >
              <option value="">選択してください</option>
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
            <label className="form-label">
              取得ポイント <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: e.target.value === '' ? '' : parseInt(e.target.value) })}
              className="input-field"
              required
            />
          </div>

          {/* 受講日 */}
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

          {/* 経費・備考セクション */}
          <div className="bg-gray-50 rounded-lg p-4">
            <button
              type="button"
              onClick={() => setIsExpenseOpen(!isExpenseOpen)}
              className="flex items-center justify-between w-full text-gray-700 font-semibold mb-2 hover:text-gray-900 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FaYenSign />
                <span>経費・メモ</span>
              </div>
              {isExpenseOpen ? (
                <FaChevronUp className="text-sm" />
              ) : (
                <FaChevronDown className="text-sm" />
              )}
            </button>

            {isExpenseOpen && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* 研修費 */}
                  <div>
                    <label className="form-label text-xs leading-tight">
                      研修費<span className="text-[10px] text-gray-500">（参加・受講）</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.fee}
                      onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                      className="input-field text-sm"
                      placeholder="0"
                    />
                  </div>
                  {/* 旅費交通費 */}
                  <div>
                    <label className="form-label text-xs leading-tight">
                      旅費交通費<span className="text-[10px] text-gray-500">（交通・宿泊）</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.transportationFee}
                      onChange={(e) => setFormData({ ...formData, transportationFee: e.target.value })}
                      className="input-field text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 交際費 */}
                  <div>
                    <label className="form-label text-xs leading-tight">
                      交際費<span className="text-[10px] text-gray-500">（打合・贈答）</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.entertainmentFee}
                      onChange={(e) => setFormData({ ...formData, entertainmentFee: e.target.value })}
                      className="input-field text-sm"
                      placeholder="0"
                    />
                  </div>
                  {/* 広告宣伝費 */}
                  <div>
                    <label className="form-label text-xs leading-tight">
                      広告宣伝費<span className="text-[10px] text-gray-500">（名刺・広告）</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.advertisingFee}
                      onChange={(e) => setFormData({ ...formData, advertisingFee: e.target.value })}
                      className="input-field text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 新聞図書費 */}
                  <div>
                    <label className="form-label text-xs leading-tight">
                      新聞図書費<span className="text-[10px] text-gray-500">（書籍購入）</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.bookFee}
                      onChange={(e) => setFormData({ ...formData, bookFee: e.target.value })}
                      className="input-field text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* 経費ノート（備考） */}
                <div>
                  <label className="form-label text-xs">経費ノート（備考）</label>
                  <textarea
                    value={formData.expenseNote}
                    onChange={(e) => setFormData({ ...formData, expenseNote: e.target.value })}
                    className="textarea-field text-sm"
                    rows={2}
                    placeholder="経費に関するメモ、勘定科目の詳細など"
                  />
                </div>
              </div>
            )}
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
