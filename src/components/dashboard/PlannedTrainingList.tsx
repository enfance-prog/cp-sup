'use client';

import { FaWifi, FaTrash, FaEdit, FaCalendarAlt, FaYenSign, FaClock, FaCheck } from 'react-icons/fa';
import { format, differenceInDays } from 'date-fns';

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
  calendarSynced: boolean;
  remindApplication: boolean;
  remindPayment: boolean;
  remindTraining: boolean;
  transportationFee?: number | null;
  welfareFee?: number | null;
  entertainmentFee?: number | null;
  advertisingFee?: number | null;
  bookFee?: number | null;
  expenseNote?: string | null;
}

interface PlannedTrainingListProps {
  plannedTrainings: PlannedTraining[];
  onUpdate: () => void;
  onEdit?: (plannedTraining: PlannedTraining) => void;
  onCalendarSync?: (plannedTraining: PlannedTraining) => void;
  isPast?: boolean;
  onRegister?: (plannedTraining: PlannedTraining) => void;
}

export default function PlannedTrainingList({
  plannedTrainings,
  onUpdate,
  onEdit,
  onCalendarSync,
  isPast = false,
  onRegister,
}: PlannedTrainingListProps) {
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

  const handleDelete = async (id: string) => {
    if (!confirm('この受講予定を削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`/api/planned-trainings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUpdate();
      } else {
        alert('削除に失敗しました');
      }
    } catch {
      alert('削除に失敗しました');
    }
  };

  const getDaysUntil = (dateStr: string) => {
    const targetDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return differenceInDays(targetDate, today);
  };

  const getUrgencyColor = (days: number) => {
    if (days < 0) return 'text-gray-400'; // 過ぎた日付
    if (days <= 3) return 'text-red-600';
    if (days <= 7) return 'text-yellow-600';
    return 'text-primary-600';
  };

  const getUrgencyBg = (days: number) => {
    if (days < 0) return 'bg-gray-100 border-gray-200';
    if (days <= 3) return 'bg-red-50 border-red-200';
    if (days <= 7) return 'bg-yellow-50 border-yellow-200';
    return 'bg-white border-primary-100';
  };

  const formatDateLabel = (dateStr: string | null) => {
    if (!dateStr) return null;
    const days = getDaysUntil(dateStr);
    const formattedDate = format(new Date(dateStr), 'M/d');

    let daysText = '';
    if (days < 0) {
      daysText = '（終了）';
    } else if (days === 0) {
      daysText = '（今日）';
    } else if (days === 1) {
      daysText = '（明日）';
    } else {
      daysText = `（${days}日後）`;
    }

    return { formattedDate, daysText, days };
  };

  return (
    <div className="space-y-3">
      {plannedTrainings.map((pt) => {
        const trainingDays = getDaysUntil(pt.trainingDate);
        const applicationInfo = formatDateLabel(pt.applicationDeadline);
        const paymentInfo = formatDateLabel(pt.paymentDeadline);

        return (
          <div
            key={pt.id}
            className={`rounded-lg p-4 hover:shadow-md transition-all border ${getUrgencyBg(trainingDays)}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* 研修名 */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <h4 className="font-semibold text-gray-800 text-lg">
                    {pt.name}
                  </h4>
                  {pt.isOnline && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                      <FaWifi className="text-xs" />
                      オンライン
                    </span>
                  )}
                </div>

                {/* 群とポイント */}
                {(pt.category || pt.points) && (
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {pt.category && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                        {getCategoryLabel(pt.category)}
                      </span>
                    )}
                    {pt.points && (
                      <span className="text-sm font-semibold text-primary-600">
                        {pt.points}pt
                      </span>
                    )}
                  </div>
                )}

                {/* 日程情報 */}
                <div className="space-y-2 text-sm">
                  {/* 研修日 */}
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className={`${getUrgencyColor(trainingDays)}`} />
                    <span className="text-gray-600">研修日:</span>
                    <span className={`font-semibold ${getUrgencyColor(trainingDays)}`}>
                      {format(new Date(pt.trainingDate), 'yyyy年M月d日')}
                    </span>
                    <span className={`text-xs ${getUrgencyColor(trainingDays)}`}>
                      {trainingDays < 0 ? '（終了）' : trainingDays === 0 ? '（今日）' : `（${trainingDays}日後）`}
                    </span>
                  </div>

                  {/* 申込期日・支払期日 */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600">
                    {applicationInfo && (
                      <div className="flex items-center gap-1">
                        <FaClock className={`text-xs ${getUrgencyColor(applicationInfo.days)}`} />
                        <span>申込: {applicationInfo.formattedDate}</span>
                        <span className={`text-xs ${getUrgencyColor(applicationInfo.days)}`}>
                          {applicationInfo.daysText}
                        </span>
                      </div>
                    )}
                    {paymentInfo && (
                      <div className="flex items-center gap-1">
                        <FaYenSign className={`text-xs ${getUrgencyColor(paymentInfo.days)}`} />
                        <span>支払: {paymentInfo.formattedDate}</span>
                        <span className={`text-xs ${getUrgencyColor(paymentInfo.days)}`}>
                          {paymentInfo.daysText}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 研修費 */}
                  {pt.fee && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <FaYenSign className="text-xs text-primary-600" />
                      <span>研修費: {pt.fee.toLocaleString()}円</span>
                    </div>
                  )}

                  {/* 備考 */}
                  {pt.memo && (
                    <div className="text-gray-500 text-xs mt-2 p-2 bg-gray-50 rounded">
                      {pt.memo}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isPast ? (
                  // 期限切れの場合: 実績登録ボタン
                  <button
                    onClick={() => onRegister && onRegister(pt)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
                    title="実績として登録"
                  >
                    <FaCheck className="w-3 h-3" />
                    <span className="hidden sm:inline">登録</span>
                  </button>
                ) : (
                  // 通常: カレンダー登録ボタン
                  onCalendarSync && (
                    <button
                      onClick={() => onCalendarSync(pt)}
                      className={`p-2 rounded-lg transition-colors ${pt.calendarSynced
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'
                        }`}
                      title={pt.calendarSynced ? 'カレンダー登録済み' : 'カレンダーに登録'}
                    >
                      <FaCalendarAlt className="w-4 h-4" />
                    </button>
                  )
                )}

                {/* 編集ボタン（共通） */}
                {onEdit && (
                  <button
                    onClick={() => onEdit(pt)}
                    className="text-gray-400 hover:text-primary-600 transition-colors p-2 rounded-lg hover:bg-primary-50"
                    title="編集"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                )}

                {/* 削除ボタン（共通） */}
                <button
                  onClick={() => handleDelete(pt.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                  title="削除"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
