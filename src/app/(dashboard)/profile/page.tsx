'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { FaUser, FaIdCard, FaCalendarAlt, FaSave, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import { format } from 'date-fns';

interface CertificationData {
  id: string;
  certNumber: string;
  acquisitionDate: string;
  expirationDate: string;
}

interface UserData {
  name: string;
  certification: CertificationData | null;
}

export default function ProfilePage() {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData>({ name: '', certification: null });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    certNumber: '',
    acquisitionDate: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setFormData({
          name: data.name || '',
          certNumber: data.certification?.certNumber || '',
          acquisitionDate: data.certification?.acquisitionDate 
            ? new Date(data.certification.acquisitionDate).toISOString().split('T')[0]
            : '',
        });
      }
    } catch (error) {
      console.error('プロフィールデータの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchUserData();
        setIsEditing(false);
        // ヘッダーに名前更新を通知
        window.dispatchEvent(new Event('profileUpdated'));
      } else {
        alert('保存に失敗しました');
      }
    } catch {
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const calculateExpirationDate = (acquisitionDate: string) => {
    if (!acquisitionDate) return null;
    const date = new Date(acquisitionDate);
    date.setFullYear(date.getFullYear() + 5);
    return date;
  };

  const getDaysUntilExpiration = () => {
    if (!userData.certification?.expirationDate) return null;
    const expDate = new Date(userData.certification.expirationDate);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const maskEmail = (email: string) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    
    // ローカル部分の最初と最後の文字以外を*に
    const maskedLocal = localPart.length > 2
      ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1]
      : '*'.repeat(localPart.length);
    
    // ドメイン部分も同様に
    const [domainName, tld] = domain.split('.');
    const maskedDomain = domainName.length > 2
      ? domainName[0] + '*'.repeat(domainName.length - 2) + domainName[domainName.length - 1]
      : '*'.repeat(domainName.length);
    
    return `${maskedLocal}@${maskedDomain}.${tld}`;
  };

  const daysUntilExpiration = getDaysUntilExpiration();
  const emailToDisplay = user?.primaryEmailAddress?.emailAddress || '未設定';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ヘッダー */}
      <div className="tool-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">プロフィール</h1>
            <p className="text-gray-600">
              あなたの資格情報を管理します
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center gap-2"
            >
              <FaEdit />
              編集
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="tool-card text-center py-12">
          <div className="animate-pulse-gentle text-gray-500">読み込み中...</div>
        </div>
      ) : (
        <>
          {isEditing ? (
            /* 編集モード */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="tool-card">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUser className="text-primary-600" />
                  基本情報
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">氏名</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="山田 太郎"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="tool-card">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaIdCard className="text-primary-600" />
                  資格情報
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">臨床心理士番号</label>
                    <input
                      type="text"
                      value={formData.certNumber}
                      onChange={(e) => setFormData({ ...formData, certNumber: e.target.value })}
                      className="input-field"
                      placeholder="例: 12345"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">資格取得日</label>
                    <input
                      type="date"
                      value={formData.acquisitionDate}
                      onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
                      className="input-field"
                      required
                    />
                    {formData.acquisitionDate && (
                      <p className="text-sm text-gray-600 mt-2">
                        有効期限: {format(calculateExpirationDate(formData.acquisitionDate)!, 'yyyy年M月d日')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: userData.name || '',
                      certNumber: userData.certification?.certNumber || '',
                      acquisitionDate: userData.certification?.acquisitionDate 
                        ? new Date(userData.certification.acquisitionDate).toISOString().split('T')[0]
                        : '',
                    });
                  }}
                  className="btn-secondary flex-1"
                  disabled={saving}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    '保存中...'
                  ) : (
                    <>
                      <FaSave />
                      保存
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* 表示モード */
            <>
              <div className="tool-card">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUser className="text-primary-600" />
                  基本情報
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">氏名</span>
                    <span className="font-semibold text-gray-800">
                      {userData.name || user?.firstName + ' ' + user?.lastName || '未設定'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">メールアドレス</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">
                        {showEmail ? emailToDisplay : maskEmail(emailToDisplay)}
                      </span>
                      <button
                        onClick={() => setShowEmail(!showEmail)}
                        className="text-gray-400 hover:text-primary-600 transition-colors p-1"
                        title={showEmail ? 'メールアドレスを隠す' : 'メールアドレスを表示'}
                      >
                        {showEmail ? (
                          <FaEyeSlash className="w-4 h-4" />
                        ) : (
                          <FaEye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tool-card">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaIdCard className="text-primary-600" />
                  資格情報
                </h3>
                {userData.certification ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">臨床心理士番号</span>
                      <span className="font-semibold text-gray-800">
                        {userData.certification.certNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">資格取得日</span>
                      <span className="font-semibold text-gray-800">
                        {format(new Date(userData.certification.acquisitionDate), 'yyyy年M月d日')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-600">有効期限</span>
                      <span className="font-semibold text-gray-800">
                        {format(new Date(userData.certification.expirationDate), 'yyyy年M月d日')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    資格情報が登録されていません。<br />
                    「編集」ボタンから登録してください。
                  </div>
                )}
              </div>

              {daysUntilExpiration !== null && (
                <div className={`tool-card ${
                  daysUntilExpiration < 180 
                    ? 'bg-red-50 border-red-200' 
                    : daysUntilExpiration < 365
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-primary-50 border-primary-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className={`text-2xl ${
                      daysUntilExpiration < 180 
                        ? 'text-red-600' 
                        : daysUntilExpiration < 365
                        ? 'text-yellow-600'
                        : 'text-primary-600'
                    }`} />
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">資格更新まで</h4>
                      <p className={`text-2xl font-bold ${
                        daysUntilExpiration < 180 
                          ? 'text-red-600' 
                          : daysUntilExpiration < 365
                          ? 'text-yellow-600'
                          : 'text-primary-600'
                      }`}>
                        あと {daysUntilExpiration} 日
                      </p>
                      {daysUntilExpiration < 180 && (
                        <p className="text-sm text-red-600 mt-2">
                          更新期限が近づいています。研修の受講をお忘れなく。
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}