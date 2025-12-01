import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendReminderEmail } from '@/lib/resend';

// Vercel Cron Jobから呼び出されるAPI
// 毎日朝8時（JST）に実行
export async function GET(request: NextRequest) {
  try {
    // Cron Jobの認証（Vercelが設定するヘッダー）
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // 開発環境ではスキップ
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // 3日後の日付を計算（JST基準）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    
    const threeDaysLaterEnd = new Date(threeDaysLater);
    threeDaysLaterEnd.setHours(23, 59, 59, 999);

    // 3日後に期日がある受講予定を取得
    const plannedTrainings = await prisma.plannedTraining.findMany({
      where: {
        OR: [
          // 申込期日が3日後
          {
            applicationDeadline: {
              gte: threeDaysLater,
              lte: threeDaysLaterEnd,
            },
            remindApplication: true,
            reminderSentApplication: false,
          },
          // 支払期日が3日後
          {
            paymentDeadline: {
              gte: threeDaysLater,
              lte: threeDaysLaterEnd,
            },
            remindPayment: true,
            reminderSentPayment: false,
          },
          // 研修日が3日後
          {
            trainingDate: {
              gte: threeDaysLater,
              lte: threeDaysLaterEnd,
            },
            remindTraining: true,
            reminderSentTraining: false,
          },
        ],
      },
      include: {
        user: true,
      },
    });

    const results: { id: string; type: string; success: boolean; error?: string }[] = [];

    for (const pt of plannedTrainings) {
      // ユーザーのメールアドレスを取得
      const userEmail = pt.user.email;
      if (!userEmail) {
        results.push({ id: pt.id, type: 'skip', success: false, error: 'No email' });
        continue;
      }

      // 申込期日のリマインド
      if (
        pt.applicationDeadline &&
        pt.remindApplication &&
        !pt.reminderSentApplication &&
        isDateInRange(pt.applicationDeadline, threeDaysLater, threeDaysLaterEnd)
      ) {
        try {
          await sendReminderEmail({
            to: userEmail,
            userName: pt.user.name,
            trainingName: pt.name,
            deadlineType: 'application',
            deadlineDate: pt.applicationDeadline,
            fee: pt.fee,
            memo: pt.memo,
          });

          await prisma.plannedTraining.update({
            where: { id: pt.id },
            data: { reminderSentApplication: true },
          });

          results.push({ id: pt.id, type: 'application', success: true });
        } catch (error) {
          results.push({ id: pt.id, type: 'application', success: false, error: String(error) });
        }
      }

      // 支払期日のリマインド
      if (
        pt.paymentDeadline &&
        pt.remindPayment &&
        !pt.reminderSentPayment &&
        isDateInRange(pt.paymentDeadline, threeDaysLater, threeDaysLaterEnd)
      ) {
        try {
          await sendReminderEmail({
            to: userEmail,
            userName: pt.user.name,
            trainingName: pt.name,
            deadlineType: 'payment',
            deadlineDate: pt.paymentDeadline,
            fee: pt.fee,
            memo: pt.memo,
          });

          await prisma.plannedTraining.update({
            where: { id: pt.id },
            data: { reminderSentPayment: true },
          });

          results.push({ id: pt.id, type: 'payment', success: true });
        } catch (error) {
          results.push({ id: pt.id, type: 'payment', success: false, error: String(error) });
        }
      }

      // 研修日のリマインド
      if (
        pt.remindTraining &&
        !pt.reminderSentTraining &&
        isDateInRange(pt.trainingDate, threeDaysLater, threeDaysLaterEnd)
      ) {
        try {
          await sendReminderEmail({
            to: userEmail,
            userName: pt.user.name,
            trainingName: pt.name,
            deadlineType: 'training',
            deadlineDate: pt.trainingDate,
            fee: pt.fee,
            memo: pt.memo,
          });

          await prisma.plannedTraining.update({
            where: { id: pt.id },
            data: { reminderSentTraining: true },
          });

          results.push({ id: pt.id, type: 'training', success: true });
        } catch (error) {
          results.push({ id: pt.id, type: 'training', success: false, error: String(error) });
        }
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `リマインダー送信完了: 成功 ${successCount}件, 失敗 ${failCount}件`,
      results,
      executedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

// 日付が範囲内かチェック
function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const d = new Date(date);
  return d >= start && d <= end;
}
