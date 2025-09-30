'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { FaPlus, FaCalendarAlt, FaTrophy, FaClock, FaWifi } from 'react-icons/fa';
import AddTrainingModal from '@/components/dashboard/AddTrainingModal';
import TrainingList from '@/components/dashboard/TrainingList';

interface Training {
  id: string;
  name: string;
  category: 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C';
  points: number;
  date: string;
  isOnline: boolean;
}

interface PointsSummary {
  total: number;
  categoryA: number;
  categoryB: number;
  categoryC: number;
  online: number;
  inPerson: number;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [pointsSummary, setPointsSummary] = useState<PointsSummary>({
    total: 0,
    categoryA: 0,
    categoryB: 0,
    categoryC: 0,
    online: 0,
    inPerson: 0,
  });

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await fetch('/api/trainings');
      if (response.ok) {
        const data = await response.json();
        setTrainings(data);
        calculatePoints(data);
      }
    } catch (error) {
      console.error('研修データの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePoints = (trainings: Training[]) => {
    const summary: PointsSummary = {
      total: 0,
      categoryA: 0,
      categoryB: 0,
      categoryC: 0,
      online: 0,
      inPerson: 0,
    };

    trainings.forEach((training) => {
      summary.total += training.points;
      
      if (training.category === 'CATEGORY_A') summary.categoryA += training.points;
      if (training.category === 'CATEGORY_B') summary.categoryB += training.points;
      if (training.category === 'CATEGORY_C') summary.categoryC += training.points;
      
      if (training.isOnline) {
        summary.online += training.points;
      } else {
        summary.inPerson += training.points;
      }
    });

    setPointsSummary(summary);
  };

  const handleTrainingAdded = () => {
    fetchTrainings();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ウェルカムセクション */}
      <div className="tool-card">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ようこそ、{user?.firstName || user?.lastName || ''}さん
        </h2>
        <p className="text-gray-600">
          資格更新までの進捗状況と研修履歴を確認できます。
        </p>
      </div>

      {/* ポイント集計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="tool-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">合計ポイント</h3>
            <FaTrophy className="text-2xl text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{pointsSummary.total}</p>
          <p className="text-xs text-gray-500 mt-1">目標: 15ポイント</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((pointsSummary.total / 15) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="tool-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">1群</h3>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">A</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{pointsSummary.categoryA}</p>
          <p className="text-xs text-gray-500 mt-1">ポイント</p>
        </div>

        <div className="tool-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">2群</h3>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">B</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{pointsSummary.categoryB}</p>
          <p className="text-xs text-gray-500 mt-1">ポイント</p>
        </div>

        <div className="tool-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">3群</h3>
            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-pink-600 font-bold text-sm">C</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{pointsSummary.categoryC}</p>
          <p className="text-xs text-gray-500 mt-1">ポイント</p>
        </div>
      </div>

      {/* オンライン/対面の集計 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="tool-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <FaWifi className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600">オンライン研修</h3>
              <p className="text-xs text-gray-500">最大7ポイントまで</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{pointsSummary.online} / 7</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                pointsSummary.online > 7 ? 'bg-red-500' : 'bg-primary-500'
              }`}
              style={{ width: `${Math.min((pointsSummary.online / 7) * 100, 100)}%` }}
            ></div>
          </div>
          {pointsSummary.online > 7 && (
            <p className="text-xs text-red-600 mt-2">
              ⚠️ オンライン研修は7ポイントまでです
            </p>
          )}
        </div>

        <div className="tool-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FaCalendarAlt className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600">対面研修</h3>
              <p className="text-xs text-gray-500">最低8ポイント必要</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{pointsSummary.inPerson} / 8</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                pointsSummary.inPerson >= 8 ? 'bg-primary-500' : 'bg-orange-500'
              }`}
              style={{ width: `${Math.min((pointsSummary.inPerson / 8) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 研修登録ボタン */}
      <div className="tool-card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-800 mb-1">研修を追加</h3>
            <p className="text-sm text-gray-600">
              受講した研修を登録して、ポイントを記録しましょう
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <FaPlus />
            研修を追加
          </button>
        </div>
      </div>

      {/* 最近の研修履歴 */}
      <div className="tool-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">最近の研修履歴</h3>
          <FaClock className="text-gray-400" />
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-pulse-gentle">読み込み中...</div>
          </div>
        ) : trainings.length > 0 ? (
          <TrainingList trainings={trainings.slice(0, 5)} onUpdate={fetchTrainings} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            まだ研修が登録されていません。<br />
            上の「研修を追加」ボタンから登録してください。
          </div>
        )}
      </div>

      {/* 研修追加モーダル */}
      <AddTrainingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTrainingAdded}
      />
    </div>
  );
}