import { format } from 'date-fns';

interface ExpenseReportProps {
    training: {
        name: string;
        date: string;
        fee?: number | null;
        transportationFee?: number | null;
        welfareFee?: number | null;
        entertainmentFee?: number | null;
        advertisingFee?: number | null;
        bookFee?: number | null;
        expenseNote?: string | null;
        isOnline?: boolean;
    };
}

export default function ExpenseReport({ training }: ExpenseReportProps) {
    const getDetailLabel = (key: string) => {
        switch (key) {
            case 'fee': return '研修費用';
            case 'transportationFee': return '交通費・宿泊など';
            case 'entertainmentFee': return '会議・打ち合わせ等';
            case 'advertisingFee': return '企業アピール';
            case 'bookFee': return '教材・参考図書費用';
            default: return '-';
        }
    };

    const categories = [
        { key: 'fee', label: '研修費（参加・受講）', value: training.fee },
        { key: 'transportationFee', label: '旅費交通費（交通・宿泊）', value: training.transportationFee },
        { key: 'entertainmentFee', label: '交際費（打合・贈答）', value: training.entertainmentFee },
        { key: 'advertisingFee', label: '広告宣伝費（名刺・広告）', value: training.advertisingFee },
        { key: 'bookFee', label: '新聞図書費（書籍購入）', value: training.bookFee },
    ].filter(cat => cat.value && cat.value > 0);

    const total = categories.reduce((sum, cat) => sum + (cat.value || 0), 0);

    return (
        <div id="print-area" className="p-12 max-w-[210mm] mx-auto bg-white text-black font-sans hidden print:block print:max-h-[297mm] print:overflow-hidden">
            {/* Title */}
            <h1 className="text-3xl font-bold text-left mb-8 text-black tracking-wide">経費ノート</h1>

            {/* Header Info */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-2 border-b border-gray-300 pb-2">{training.name}</h2>
                <p className="text-sm text-gray-700">
                    日付・会場名：{format(new Date(training.date), 'yyyy年M月d日')}
                    {training.isOnline ? '（オンライン）' : ''}
                </p>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border-b border-gray-800 mb-8">
                <thead>
                    <tr className="bg-gray-100 print:bg-gray-100 border-t border-b border-gray-800">
                        <th className="py-2 px-4 text-left font-normal w-1/3">費目</th>
                        <th className="py-2 px-4 text-left font-normal w-1/3">細目</th>
                        <th className="py-2 px-4 text-left font-normal w-1/3">金額</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat, index) => (
                        <tr key={index} className="border-b border-gray-300">
                            <td className="py-3 px-4">{cat.label}</td>
                            <td className="py-3 px-4">{getDetailLabel(cat.key)}</td>
                            <td className="py-3 px-4 text-lg">¥{cat.value?.toLocaleString()}</td>
                        </tr>
                    ))}
                    {categories.length === 0 && (
                        <tr className="border-b border-gray-300">
                            <td colSpan={3} className="py-4 px-4 text-center text-gray-400">経費情報はありません</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Total */}
            <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">合計</h3>
                <div className="border-b-2 border-black inline-block min-w-[200px] border-black pb-1">
                    <span className="text-4xl font-bold">¥ {total.toLocaleString()}</span>
                </div>
            </div>

            {/* Receipt Attachment Section */}
            <div className="break-inside-avoid">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">【証憑貼付欄】</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4 ml-1">レシートをここに添付して提出</p>

                {/* Placeholder for physical receipt (Empty Box) */}
                <div className="border border-gray-300 rounded-sm h-[200px] w-full" />
            </div>

            {/* Memo (Optional, strict layout didn't show it but data exists) */}
            {training.expenseNote && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">備考: {training.expenseNote}</p>
                </div>
            )}
        </div>
    );
}
