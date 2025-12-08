import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// 受講予定の研修一覧を取得
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

    // 受講予定の研修を取得（研修日の昇順）
    const plannedTrainings = await prisma.plannedTraining.findMany({
      where: { userId: user.id },
      orderBy: { trainingDate: 'asc' },
    });

    return NextResponse.json(plannedTrainings);
  } catch (error) {
    console.error('Error fetching planned trainings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 受講予定の研修を登録
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      category,
      points,
      applicationDeadline,
      paymentDeadline,
      trainingDate,
      fee,
      isOnline,
      memo,
      remindApplication,
      remindPayment,
      remindTraining,
    } = body;

    // バリデーション
    if (!name || !trainingDate) {
      return NextResponse.json(
        { error: '研修名と研修日は必須です' },
        { status: 400 }
      );
    }

    // ユーザーを取得または作成
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          clerkId: userId,
          name: 'User',
        },
      });
    }

    // 日付をUTC時刻として正しく扱う
    const parseDate = (dateStr: string | null | undefined) => {
      if (!dateStr) return null;
      return new Date(dateStr + 'T00:00:00.000Z');
    };

    // 受講予定の研修を作成
    const plannedTraining = await prisma.plannedTraining.create({
      data: {
        userId: user.id,
        name,
        category: category || null,
        points: points ? parseInt(points) : null,
        applicationDeadline: parseDate(applicationDeadline),
        paymentDeadline: parseDate(paymentDeadline),
        trainingDate: parseDate(trainingDate)!,
        fee: fee ? parseInt(fee) : null,
        isOnline: isOnline || false,
        memo: memo || null,
        remindApplication: remindApplication ?? true,
        remindPayment: remindPayment ?? true,
        remindTraining: remindTraining ?? true,
      },
    });

    return NextResponse.json({ success: true, plannedTraining });
  } catch (error) {
    console.error('Error creating planned training:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
