'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaChartLine, FaWifi, FaUserCircle } from 'react-icons/fa';
import AddTrainingModal from '@/components/dashboard/AddTrainingModal';
import EditTrainingModal from '@/components/dashboard/EditTrainingModal';
import TrainingList from '@/components/dashboard/TrainingList';

interface Training {
  id: string;
  name: string;
  category: 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C';
  points: number;
  date: string;
  isOnline: boolean;
}

interface Stats {
  totalPoints: number;
  categoryA: number;
  categoryB: number;
  categoryC: number;
  onlinePoints: number;
  inPersonPoints: number;
}

export default function DashboardPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPoints: 0,
    categoryA: 0,
    categoryB: 0,
    categoryC: 0,
    onlinePoints: 0,
    inPersonPoints: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);

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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

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

  const recentTrainings = [...trainings]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const targetPoints = 15;
  const progressPercentage = Math.min((stats.totalPoints / targetPoints) * 100, 100);

  return (
    <div className="space-y-6 animate-fade-in">
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
    </div>
  );
}
