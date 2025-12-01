import { Resend } from 'resend';

// ビルド時のエラーを回避するため、APIキーが存在しない場合はダミー値を使用
const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build');

interface ReminderEmailParams {
  to: string;
  userName: string;
  trainingName: string;
  deadlineType: 'application' | 'payment' | 'training';
  deadlineDate: Date;
  fee?: number | null;
  memo?: string | null;
}

export async function sendReminderEmail(params: ReminderEmailParams) {
  const { to, userName, trainingName, deadlineType, deadlineDate, fee, memo } = params;

  const typeLabels = {
    application: '申込期日',
    payment: '支払期日',
    training: '研修日',
  };

  const typeEmoji = {
    application: '📝',
    payment: '💰',
    training: '📚',
  };

  const label = typeLabels[deadlineType];
  const emoji = typeEmoji[deadlineType];
  const formattedDate = deadlineDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `${emoji} 【リマインド】${trainingName}の${label}が近づいています`;

  // HTMLメール本文
  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">
      ${emoji} ${label}のリマインド
    </h1>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
    <p style="margin-top: 0;">
      ${userName}さん、こんにちは。
    </p>
    
    <p>
      以下の研修の<strong style="color: #10b981;">${label}</strong>が<strong>3日後</strong>に迫っています。
    </p>
    
    <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <h2 style="margin: 0 0 10px 0; color: #065f46; font-size: 18px;">
        ${trainingName}
      </h2>
      <p style="margin: 0; color: #047857;">
        <strong>${label}:</strong> ${formattedDate}
      </p>
      ${fee ? `<p style="margin: 10px 0 0 0; color: #047857;"><strong>研修費:</strong> ${fee.toLocaleString()}円</p>` : ''}
      ${memo ? `<p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;"><strong>メモ:</strong> ${memo}</p>` : ''}
    </div>
    
    ${deadlineType === 'application' ? `
    <p style="color: #dc2626;">
      ⚠️ 申込期日を過ぎると受講できなくなる可能性があります。お早めにお手続きください。
    </p>
    ` : ''}
    
    ${deadlineType === 'payment' ? `
    <p style="color: #dc2626;">
      ⚠️ 支払期日を過ぎると申込がキャンセルされる可能性があります。お早めにお手続きください。
    </p>
    ` : ''}
    
    ${deadlineType === 'training' ? `
    <p style="color: #059669;">
      📌 研修当日の準備をお忘れなく。充実した研修となりますように！
    </p>
    ` : ''}
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="color: #6b7280; font-size: 12px; margin-bottom: 0;">
      このメールは臨床心理士ポイントマネージャーから自動送信されています。<br>
      リマインダー設定は各研修予定の編集画面から変更できます。
    </p>
  </div>
</body>
</html>
  `.trim();

  // テキスト版
  const text = `
${userName}さん、こんにちは。

以下の研修の${label}が3日後に迫っています。

━━━━━━━━━━━━━━━━━━━━━━
${trainingName}
${label}: ${formattedDate}
${fee ? `研修費: ${fee.toLocaleString()}円` : ''}
${memo ? `メモ: ${memo}` : ''}
━━━━━━━━━━━━━━━━━━━━━━

お早めにお手続きください。

---
臨床心理士ポイントマネージャー
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
