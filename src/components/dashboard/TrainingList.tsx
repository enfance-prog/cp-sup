"use client";

import { FaWifi, FaTrash, FaEdit, FaPrint } from "react-icons/fa";
import { format } from "date-fns";
import { useState } from "react";
import ExpenseReport from "./ExpenseReport";

interface Training {
  id: string;
  name: string;
  category: "CATEGORY_A" | "CATEGORY_B" | "CATEGORY_C" | "CATEGORY_D" | "CATEGORY_E" | "CATEGORY_F" | null;
  points: number | null;
  date: string;
  isOnline: boolean;
  fee?: number | null;
  transportationFee?: number | null;
  welfareFee?: number | null;
  entertainmentFee?: number | null;
  advertisingFee?: number | null;
  bookFee?: number | null;
  expenseNote?: string | null;
}

interface TrainingListProps {
  trainings: Training[];
  onUpdate: () => void;
  onEdit?: (training: Training) => void;
}

export default function TrainingList({
  trainings,
  onUpdate,
  onEdit,
}: TrainingListProps) {
  const getCategoryLabel = (category: string | null) => {
    const labels: Record<string, string> = {
      'CATEGORY_A': '1群',
      'CATEGORY_B': '2群',
      'CATEGORY_C': '3群',
      'CATEGORY_D': '4群',
      'CATEGORY_E': '5群',
      'CATEGORY_F': '6群',
    };
    return category ? labels[category] : '未定';
  };

  const getCategoryColor = (category: string | null) => {
    const colors: Record<string, string> = {
      'CATEGORY_A': 'bg-blue-100 text-blue-800',
      'CATEGORY_B': 'bg-purple-100 text-purple-800',
      'CATEGORY_C': 'bg-pink-100 text-pink-800',
      'CATEGORY_D': 'bg-teal-100 text-teal-800',
      'CATEGORY_E': 'bg-amber-100 text-amber-800',
      'CATEGORY_F': 'bg-rose-100 text-rose-800',
    };
    return category ? colors[category] : 'bg-gray-100 text-gray-800';
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この研修を削除してもよろしいですか?")) return;

    try {
      const response = await fetch(`/api/trainings/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onUpdate();
      } else {
        alert("削除に失敗しました");
      }
    } catch {
      alert("削除に失敗しました");
    }
  };

  const handlePrint = (training: Training) => {
    setSelectedPrint(training);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const [selectedPrint, setSelectedPrint] = useState<Training | null>(null);

  return (
    <div className="space-y-3">
      {/* 印刷用レポート (隠し) */}
      <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-0 m-0">
        {selectedPrint && <ExpenseReport training={selectedPrint} />}
      </div>

      {trainings.map((training) => (
        <div
          key={training.id}
          className="bg-white/50 border border-primary-100 rounded-lg p-4 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h4 className="font-semibold text-gray-800 truncate">
                  {training.name}
                </h4>
                {training.isOnline && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    <FaWifi className="text-xs" />
                    オンライン
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(training.category)}`}>
                  {getCategoryLabel(training.category)}
                </span>
                <span className="text-sm text-gray-500">
                  {training.points ? `${training.points}pt` : '未定'}
                </span>
                <span>{format(new Date(training.date), "yyyy年M月d日")}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(training)}
                  className="text-gray-400 hover:text-primary-600 transition-colors p-2 rounded-lg hover:bg-primary-50"
                  title="編集"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => handleDelete(training.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                title="削除"
              >
                <FaTrash className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePrint(training)}
                className="text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
                title="経費ノートを印刷"
              >
                <FaPrint className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
