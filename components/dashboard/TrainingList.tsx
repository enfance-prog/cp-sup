'use client';

import { FaWifi, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';

interface Training {
  id: string;
  name: string;
  category: 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C';
  points: number;
  date: string;
  isOnline: boolean;
}

interface TrainingListProps {
  trainings: Training[];
  onUpdate: () => void;
}

export default function TrainingList({ trainings, onUpdate }: TrainingListProps) {
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
      case 'CATEGORY_A': return 'bg-blue-100 text-blue-700';
      case 'CATEGORY_B': return 'bg-purple-100 text-purple-700';
      case 'CATEGORY_C': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この研修を削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`/api/trainings/${id}`, {
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

  return (
    <div className="space-y-3">
      {trainings.map((training) => (
        <div
          key={training.id}
          className="bg-white/50 border border-primary-100 rounded-lg p-4 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h4 className="font-semibold text-gray-800 truncate">{training.name}</h4>
                {training.isOnline && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    <FaWifi className="text-xs" />
                    オンライン
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                <span className={`px-2 py-1 rounded-md font-medium ${getCategoryColor(training.category)}`}>
                  {getCategoryLabel(training.category)}
                </span>
                <span className="font-semibold text-primary-600">{training.points}pt</span>
                <span>{format(new Date(training.date), 'yyyy年M月d日')}</span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(training.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
              title="削除"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
