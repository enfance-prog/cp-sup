import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createMultipleCalendarEvents } from '@/lib/google-calendar';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { plannedTrainingId } = body;

    // ユーザーを取得
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { googleToken: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Googleトークンがあるか確認
    if (!user.googleToken) {
      return NextResponse.json(
        { error: 'Google未連携', needsAuth: true },
        { status: 400 }
      );
    }

    // 受講予定の研修を取得
    const plannedTraining = await prisma.plannedTraining.findFirst({
      where: {
        id: plannedTrainingId,
        userId: user.id,
      },
    });

    if (!plannedTraining) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // カレンダーイベントを作成
    try {
      const results = await createMultipleCalendarEvents(
        user.googleToken.accessToken,
        user.googleToken.refreshToken,
        {
          name: plannedTraining.name,
          applicationDeadline: plannedTraining.applicationDeadline,
          paymentDeadline: plannedTraining.paymentDeadline,
          trainingDate: plannedTraining.trainingDate,
          memo: plannedTraining.memo,
        }
      );

      // カレンダー連携済みフラグを更新
      const successCount = results.filter((r) => r.success).length;
      if (successCount > 0) {
        await prisma.plannedTraining.update({
          where: { id: plannedTrainingId },
          data: { calendarSynced: true },
        });
      }

      return NextResponse.json({
        success: true,
        results,
        message: `${successCount}件のイベントをカレンダーに登録しました`,
      });
    } catch (error) {
      // トークンが無効な場合は再認証が必要
      console.error('Calendar sync error:', error);
      return NextResponse.json(
        { error: 'カレンダー連携エラー', needsAuth: true },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error syncing calendar:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
