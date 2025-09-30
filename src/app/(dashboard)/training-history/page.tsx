'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaFilter, FaSort, FaWifi, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import AddTrainingModal from '@/components/dashboard/AddTrainingModal';

interface Training {
  id: string;
  name: string;
  category: 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C';
  points: number;
  date: string;
  isOnline: boolean;
}

export default function TrainingHistoryPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // フィルター・ソート状態
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'points'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchTrainings();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [trainings, categoryFilter, typeFilter, sortBy, sortOrder]);

  const fetchTrainings = async () => {
    try {
      const response = await fetch('/api/trainings');
      if (response.ok) {
        const data = await response.json();
        setTrainings(data);
      }
    } catch (error) {
      console.error('研修データの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...trainings];

    // カテゴリーフィルター
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter((t) => t.category === categoryFilter);
    }

    // タイプフィルター
    if (typeFilter === 'ONLINE') {
      filtered = filtered.filter((t) => t.isOnline);
    } else if (typeFilter === 'IN_PERSON') {
      filtered = filtered.filter((t) => !t.isOnline);
    }

    // ソート
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === 'asc' ? a.points - b.points : b.points - a.points;
      }
    });

    setFilteredTrainings(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この研修を削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`/api/trainings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTrainings();
      } else {
        alert('削除に失敗しました');
      }
    } catch {
      alert('削除に失敗しました');
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'CATEGORY_A': return '1群';
      case 'CATEGORY_B': return '2群';
      case 'CATEGORY_C': return '3群';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CATEGORY_A': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CATEGORY_B': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'CATEGORY_C': return 'bg-pink-100 text-pink-700 border-pink-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const totalPoints = filteredTrainings.reduce((sum, t) => sum + t.points, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ヘッダー */}
      <div className="tool-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">研修履歴</h1>
            <p className="text-gray-600">
              受講した研修の一覧を確認できます
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 justify-center md:justify-start"
          >
            <FaPlus />
            研修を追加
          </button>
        </div>
      </div>

      {/* フィルター・ソートセクション */}
      <div className="tool-card">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-primary-600" />
          <h3 className="font-semibold text-gray-800">フィルター・ソート</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* カテゴリーフィルター */}
          <div>
            <label className="form-label text-xs">カテゴリー</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="select-field text-sm"
            >
              <option value="ALL">すべて</option>
              <option value="CATEGORY_A">1群</option>
              <option value="CATEGORY_B">2群</option>
              <option value="CATEGORY_C">3群</option>
            </select>
          </div>

          {/* タイプフィルター */}
          <div>
            <label className="form-label text-xs">研修タイプ</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="select-field text-sm"
            >
              <option value="ALL">すべて</option>
              <option value="ONLINE">オンラインのみ</option>
              <option value="IN_PERSON">対面のみ</option>
            </select>
          </div>

          {/* ソート基準 */}
          <div>
            <label className="form-label text-xs">並び替え</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'points')}
              className="select-field text-sm"
            >
              <option value="date">受講日</option>
              <option value="points">ポイント</option>
            </select>
          </div>

          {/* ソート順序 */}
          <div>
            <label className="form-label text-xs">順序</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="select-field text-sm"
            >
              <option value="desc">降順</option>
              <option value="asc">昇順</option>
            </select>
          </div>
        </div>

        {/* 結果サマリー */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              表示中: {filteredTrainings.length}件 / 全{trainings.length}件
            </span>
            <span className="font-semibold text-primary-600">
              合計ポイント: {totalPoints}pt
            </span>
          </div>
        </div>
      </div>

      {/* 研修リスト */}
      <div className="tool-card">
        <div className="flex items-center gap-2 mb-4">
          <FaCalendarAlt className="text-primary-600" />
          <h3 className="font-semibold text-gray-800">研修一覧</h3>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse-gentle text-gray-500">読み込み中...</div>
          </div>
        ) : filteredTrainings.length > 0 ? (
          <div className="space-y-3">
            {filteredTrainings.map((training) => (
              <div
                key={training.id}
                className="bg-white border border-primary-100 rounded-lg p-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <h4 className="font-semibold text-gray-800 text-lg">
                        {training.name}
                      </h4>
                      {training.isOnline && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium border border-primary-200">
                          <FaWifi className="text-xs" />
                          オンライン
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm flex-wrap">
                      <span className={`px-3 py-1.5 rounded-lg font-semibold border ${getCategoryColor(training.category)}`}>
                        {getCategoryLabel(training.category)}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-primary-600 text-base">
                        <FaSort className="text-sm" />
                        {training.points}pt
                      </span>
                      <span className="text-gray-600">
                        {format(new Date(training.date), 'yyyy年M月d日')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(training.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 flex-shrink-0"
                    title="削除"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {trainings.length === 0 ? (
              <>
                まだ研修が登録されていません。<br />
                「研修を追加」ボタンから登録してください。
              </>
            ) : (
              <>
                フィルター条件に一致する研修がありません。<br />
                フィルターを変更してください。
              </>
            )}
          </div>
        )}
      </div>

      {/* 研修追加モーダル */}
      <AddTrainingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTrainings}
      />
    </div>
  );
}
