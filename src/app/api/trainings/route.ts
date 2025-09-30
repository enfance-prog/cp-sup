import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 研修履歴を取得
    const trainings = await prisma.trainingAttendance.findMany({
      where: { userId: user.id },
      include: {
        training: true,
      },
      orderBy: {
        training: {
          date: 'desc',
        },
      },
    });

    // レスポンス形式を整形
    const formattedTrainings = trainings.map((attendance) => ({
      id: attendance.training.id,
      name: attendance.training.name,
      category: attendance.training.category,
      points: attendance.training.points,
      date: attendance.training.date.toISOString(),
      isOnline: attendance.training.isOnline,
    }));

    return NextResponse.json(formattedTrainings);
  } catch (error) {
    console.error('Error fetching trainings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, points, date, isOnline } = body;

    // バリデーション
    if (!name || !category || !points || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ユーザーを取得または作成
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      // ユーザーが存在しない場合は作成
      user = await prisma.user.create({
        data: {
          id: userId,
          clerkId: userId,
          name: 'User', // 後でプロフィールで更新
        },
      });
    }

    // 資格情報を取得（なければ作成）
    let certification = await prisma.certification.findFirst({
      where: { userId: user.id },
    });

    if (!certification) {
      // 仮の資格情報を作成（後でプロフィールで更新）
      certification = await prisma.certification.create({
        data: {
          certNumber: 'TEMP-' + Date.now(),
          userId: user.id,
          acquisitionDate: new Date(),
          expirationDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000), // 5年後
        },
      });
    }

    // 日付のバグ修正: UTC時刻として正しく扱う
    const trainingDate = new Date(date + 'T00:00:00.000Z');

    // 研修を作成
    const training = await prisma.training.create({
      data: {
        name,
        category,
        points: parseInt(points),
        date: trainingDate,
        isOnline: isOnline || false,
      },
    });

    // 研修出席記録を作成
    await prisma.trainingAttendance.create({
      data: {
        userId: user.id,
        certificationId: certification.id,
        trainingId: training.id,
      },
    });

    return NextResponse.json({ success: true, training });
  } catch (error) {
    console.error('Error creating training:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}