'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaPlus, FaChartLine, FaWifi, FaUserCircle, FaClipboardList, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import AddTrainingModal from '@/components/dashboard/AddTrainingModal';
import EditTrainingModal from '@/components/dashboard/EditTrainingModal';
import TrainingList from '@/components/dashboard/TrainingList';
import AddPlannedTrainingModal from '@/components/dashboard/AddPlannedTrainingModal';
import EditPlannedTrainingModal from '@/components/dashboard/EditPlannedTrainingModal';
import PlannedTrainingList from '@/components/dashboard/PlannedTrainingList';

interface Training {
  id: string;
  name: string;
  category: 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C' | 'CATEGORY_D' | 'CATEGORY_E' | 'CATEGORY_F';
  points: number;
  date: string;
  isOnline: boolean;
}

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
}

interface Stats {
  totalPoints: number;
  categoryA: number;
  categoryB: number;
  categoryC: number;
  onlinePoints: number;
  inPersonPoints: number;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [plannedTrainings, setPlannedTrainings] = useState<PlannedTraining[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPoints: 0,
    categoryA: 0,
    categoryB: 0,
    categoryC: 0,
    onlinePoints: 0,
    inPersonPoints: 0,
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);
  
  // 研修履歴のモーダル
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  
  // 受講予定のモーダル
  const [isPlannedModalOpen, setIsPlannedModalOpen] = useState(false);
  const [isEditPlannedModalOpen, setIsEditPlannedModalOpen] = useState(false);
  const [selectedPlannedTraining, setSelectedPlannedTraining] = useState<PlannedTraining | null>(null);

  // カレンダー連携の結果を表示
  useEffect(() => {
    const calendarStatus = searchParams.get('calendar');
    if (calendarStatus === 'success') {
      const count = searchParams.get('count');
      setToast({
        type: 'success',
        message: `${count || ''}件のイベントをGoogleカレンダーに登録しました`,
      });
    } else if (calendarStatus === 'error') {
      const message = searchParams.get('message');
      setToast({
        type: 'error',
        message: message || 'カレンダー連携に失敗しました',
      });
    }

    // URLパラメータをクリア
    if (calendarStatus) {
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams]);

  // トーストを自動で消す
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchTrainings = useCallback(async () => {
    try {
      const response = await fetch('/api/trainings');
      if (response.ok) {
        const data = await response.json();
        setTrainings(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('研修データの取得に失敗しました:', error);
    }
  }, []);

  const fetchPlannedTrainings = useCallback(async () => {
    try {
      const response = await fetch('/api/planned-trainings');
      if (response.ok) {
        const data = await response.json();
        setPlannedTrainings(data);
      }
    } catch (error) {
      console.error('受講予定の取得に失敗しました:', error);
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchTrainings(), fetchPlannedTrainings()]);
      setLoading(false);
    };
    fetchAll();
  }, [fetchTrainings, fetchPlannedTrainings]);

  const calculateStats = (trainings: Training[]) => {
    const stats = trainings.reduce(
      (acc, training) => {
        acc.totalPoints += training.points;
        
        if (training.category === 'CATEGORY_A') acc.categoryA += training.points;
        if (training.category === 'CATEGORY_B') acc.categoryB += training.points;
        if (training.category === 'CATEGORY_C') acc.categoryC += training.points;
        
        if (training.isOnline) {
          acc.onlinePoints += training.points;
        } else {
          acc.inPersonPoints += training.points;
        }
        
        return acc;
      },
      { totalPoints: 0, categoryA: 0, categoryB: 0, categoryC: 0, onlinePoints: 0, inPersonPoints: 0 }
    );
    
    setStats(stats);
  };

  const handleEdit = (training: Training) => {
    setSelectedTraining(training);
    setIsEditModalOpen(true);
  };

  const handleEditPlanned = (plannedTraining: PlannedTraining) => {
    setSelectedPlannedTraining(plannedTraining);
    setIsEditPlannedModalOpen(true);
  };

  // カレンダー同期
  const handleCalendarSync = async (plannedTraining: PlannedTraining) => {
    try {
      // まず既存のトークンで試す
      const syncResponse = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plannedTrainingId: plannedTraining.id }),
      });

      const syncData = await syncResponse.json();

      if (syncResponse.ok) {
        setToast({
          type: 'success',
          message: syncData.message || 'カレンダーに登録しました',
        });
        fetchPlannedTrainings();
        return;
      }

      // トークンがない、または無効な場合はOAuth認証へ
      if (syncData.needsAuth) {
        const authResponse = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plannedTrainingId: plannedTraining.id }),
        });

        const authData = await authResponse.json();

        if (authData.authUrl) {
          // Google認証ページへリダイレクト
          window.location.href = authData.authUrl;
        } else {
          setToast({
            type: 'error',
            message: '認証URLの取得に失敗しました',
          });
        }
      } else {
        setToast({
          type: 'error',
          message: syncData.error || 'カレンダー連携に失敗しました',
        });
      }
    } catch (error) {
      console.error('Calendar sync error:', error);
      setToast({
        type: 'error',
        message: 'カレンダー連携中にエラーが発生しました',
      });
    }
  };

  const recentTrainings = [...trainings]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // 今後の予定（研修日が今日以降のもの）
  const upcomingPlannedTrainings = plannedTrainings.filter(pt => {
    const trainingDate = new Date(pt.trainingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return trainingDate >= today;
  });

  const targetPoints = 15;
  const progressPercentage = Math.min((stats.totalPoints / targetPoints) * 100, 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* トースト通知 */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-up ${
            toast.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {toast.type === 'success' ? (
            <FaCheckCircle className="text-green-600" />
          ) : (
            <FaExclamationCircle className="text-red-600" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}

      {/* ウェルカムカード */}
      <div className="tool-card bg-gradient-to-br from-primary-50 to-white border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              ようこそ臨床心理士ポイントマネージャーへ
            </h1>
            <p className="text-gray-600">
              あなたの研修履歴とポイントを一元管理できます
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus />
            研修を追加
          </button>
        </div>
      </div>

      {loading ? (
        <div className="tool-card text-center py-12">
          <div className="animate-pulse-gentle text-gray-500">読み込み中...</div>
        </div>
      ) : (
        <>
          {/* ポイント集計カード */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 合計ポイント */}
            <div className="tool-card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100 text-sm font-medium mb-1">合計ポイント</p>
                  <p className="text-3xl font-bold">{stats.totalPoints}pt</p>
                </div>
                <FaChartLine className="text-4xl text-primary-200" />
              </div>
            </div>

            {/* 1群 */}
            <div className="tool-card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">1群</p>
                  <p className="text-3xl font-bold">{stats.categoryA}pt</p>
                </div>
                <FaUserCircle className="text-4xl text-blue-200" />
              </div>
            </div>

            {/* 2群 */}
            <div className="tool-card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">2群</p>
                  <p className="text-3xl font-bold">{stats.categoryB}pt</p>
                </div>
                <FaUserCircle className="text-4xl text-purple-200" />
              </div>
            </div>

            {/* 3群 */}
            <div className="tool-card bg-gradient-to-br from-pink-500 to-pink-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium mb-1">3群</p>
                  <p className="text-3xl font-bold">{stats.categoryC}pt</p>
                </div>
                <FaUserCircle className="text-4xl text-pink-200" />
              </div>
            </div>
          </div>

          {/* 進捗状況 */}
          <div className="tool-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">目標達成状況</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">合計ポイント</span>
                  <span className="font-semibold text-gray-800">
                    {stats.totalPoints} / {targetPoints}pt
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaWifi className="text-primary-600" />
                    <span className="text-sm text-gray-700">オンライン研修</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">{stats.onlinePoints}pt</p>
                    <p className="text-xs text-gray-500">上限: 7pt</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-blue-600" />
                    <span className="text-sm text-gray-700">対面研修</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{stats.inPersonPoints}pt</p>
                    <p className="text-xs text-gray-500">最低: 8pt必要</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 受講予定の研修（新機能） */}
          <div className="tool-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaClipboardList className="text-primary-600" />
                受講予定の研修
              </h3>
              <button
                onClick={() => setIsPlannedModalOpen(true)}
                className="btn-secondary flex items-center gap-2 text-sm py-2 px-3"
              >
                <FaPlus className="text-xs" />
                予定を追加
              </button>
            </div>
            {upcomingPlannedTrainings.length > 0 ? (
              <PlannedTrainingList
                plannedTrainings={upcomingPlannedTrainings}
                onUpdate={fetchPlannedTrainings}
                onEdit={handleEditPlanned}
                onCalendarSync={handleCalendarSync}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                受講予定の研修がありません。<br />
                「予定を追加」ボタンから登録してください。
              </div>
            )}
          </div>

          {/* 最近の研修履歴 */}
          <div className="tool-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">最近の研修履歴</h3>
            {recentTrainings.length > 0 ? (
              <TrainingList 
                trainings={recentTrainings} 
                onUpdate={fetchTrainings}
                onEdit={handleEdit}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                まだ研修が登録されていません。<br />
                「研修を追加」ボタンから登録してください。
              </div>
            )}
          </div>
        </>
      )}

      {/* 研修追加モーダル */}
      <AddTrainingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTrainings}
      />

      {/* 研修編集モーダル */}
      <EditTrainingModal
        isOpen={isEditModalOpen}
        training={selectedTraining}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTraining(null);
        }}
        onSuccess={fetchTrainings}
      />

      {/* 受講予定追加モーダル */}
      <AddPlannedTrainingModal
        isOpen={isPlannedModalOpen}
        onClose={() => setIsPlannedModalOpen(false)}
        onSuccess={fetchPlannedTrainings}
      />

      {/* 受講予定編集モーダル */}
      <EditPlannedTrainingModal
        isOpen={isEditPlannedModalOpen}
        plannedTraining={selectedPlannedTraining}
        onClose={() => {
          setIsEditPlannedModalOpen(false);
          setSelectedPlannedTraining(null);
        }}
        onSuccess={fetchPlannedTrainings}
      />
    </div>
  );
}
