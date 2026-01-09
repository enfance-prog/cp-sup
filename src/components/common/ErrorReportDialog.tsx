import { FaTimes, FaEnvelope } from 'react-icons/fa';
import { FaLine, FaXTwitter } from 'react-icons/fa6';

interface ErrorReportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    error: {
        title: string;
        message: string;
        code?: string; // e.g., 'CERT_NUMBER_EXISTS'
        details?: string;
    } | null;
    userName?: string;
}

export default function ErrorReportDialog({ isOpen, onClose, error, userName }: ErrorReportDialogProps) {
    if (!isOpen || !error) return null;

    const handleLineReport = () => {
        window.open('https://lin.ee/UnZgvAz', '_blank');
    };

    const handleXReport = () => {
        window.open('https://x.com/enfance_222', '_blank');
    };

    const handleEmailReport = () => {
        const subject = encodeURIComponent('【バグ報告】臨床心理士ポータル エラー報告');
        const body = encodeURIComponent(`
以下のエラーが発生しました。

■ユーザー名
${userName || '未設定'}

■エラー内容
${error.title}
${error.message}
${error.code ? `コード: ${error.code}` : ''}
${error.details ? `詳細: ${error.details}` : ''}

■発生日時
${new Date().toLocaleString()}

■補足事項（発生した状況など）
`);
        window.location.href = `mailto:enfance.inc@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-red-50 border-b border-red-100 p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-red-800 flex items-center gap-2">
                        保存できませんでした
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-100"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <p className="font-semibold text-gray-800">{error.message}</p>
                        {error.details && (
                            <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded border border-gray-100 font-mono break-all">
                                {error.details}
                            </p>
                        )}
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-sm text-gray-600 mb-4 font-medium">
                            解決しない場合やバグの可能性がある場合は、以下よりご報告ください。
                        </p>

                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={handleLineReport}
                                className="flex items-center justify-center gap-3 w-full py-2.5 px-4 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-lg transition-all shadow-sm hover:shadow active:scale-95"
                            >
                                <FaLine className="w-5 h-5" />
                                <span className="font-bold">公式LINEで報告</span>
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleXReport}
                                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-black hover:bg-black/80 text-white rounded-lg transition-all shadow-sm hover:shadow active:scale-95"
                                >
                                    <FaXTwitter className="w-4 h-4" />
                                    <span className="text-sm font-bold">DMで報告</span>
                                </button>

                                <button
                                    onClick={handleEmailReport}
                                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all shadow-sm hover:shadow active:scale-95"
                                >
                                    <FaEnvelope className="w-4 h-4" />
                                    <span className="text-sm font-bold">メールで報告</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
