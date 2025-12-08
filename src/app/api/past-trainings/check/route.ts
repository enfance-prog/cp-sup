import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// ログイン時に研修日が過ぎた受講予定研修を取得
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ユーザーを取得
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json([]);
    }

    // 研修日が過ぎていてフラグが立っている受講予定研修を取得
    const pastTrainings = await prisma.plannedTraining.findMany({
      where: {
        userId: user.id,
        hasPastTrainingDate: true,
      },
      orderBy: {
        trainingDate: 'desc',
      },
    });

    return NextResponse.json(pastTrainings);
  } catch (error) {
    console.error('Error fetching past trainings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
