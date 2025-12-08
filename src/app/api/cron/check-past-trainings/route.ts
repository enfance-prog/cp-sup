import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Cron Jobから呼び出される（毎日午前8時JST）
export async function GET(request: Request) {
  try {
    // Vercel Cronからの呼び出しを検証
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 今日の日付（UTC 00:00:00）
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // 研修日が今日より前で、hasPastTrainingDateがfalseの受講予定研修を取得
    const pastTrainings = await prisma.plannedTraining.findMany({
      where: {
        trainingDate: {
          lt: today, // 今日より前
        },
        hasPastTrainingDate: false,
      },
    });

    // hasPastTrainingDateをtrueに更新
    const updateResults = await Promise.all(
      pastTrainings.map((training) =>
        prisma.plannedTraining.update({
          where: { id: training.id },
          data: { hasPastTrainingDate: true },
        })
      )
    );

    return NextResponse.json({
      success: true,
      checkedCount: pastTrainings.length,
      updatedCount: updateResults.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in check-past-trainings cron:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
