import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// 受講予定の研修を更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: plannedTrainingId } = await params;
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
      calendarSynced,
    } = body;

    // ユーザーを取得
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 所有権の確認
    const existing = await prisma.plannedTraining.findFirst({
      where: {
        id: plannedTrainingId,
        userId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // 日付をUTC時刻として正しく扱う
    const parseDate = (dateStr: string | null | undefined) => {
      if (!dateStr) return null;
      // すでにISO形式の場合はそのまま、そうでなければ変換
      if (dateStr.includes('T')) {
        return new Date(dateStr);
      }
      return new Date(dateStr + 'T00:00:00.000Z');
    };

    // 受講予定の研修を更新
    const updatedPlannedTraining = await prisma.plannedTraining.update({
      where: { id: plannedTrainingId },
      data: {
        name,
        category: category !== undefined ? (category || null) : undefined,
        points: points !== undefined ? (points ? parseInt(points) : null) : undefined,
        applicationDeadline: parseDate(applicationDeadline),
        paymentDeadline: parseDate(paymentDeadline),
        trainingDate: parseDate(trainingDate)!,
        fee: fee !== undefined ? (fee ? parseInt(fee) : null) : undefined,
        isOnline: isOnline !== undefined ? Boolean(isOnline) : undefined,
        memo: memo !== undefined ? (memo || null) : undefined,
        remindApplication: remindApplication !== undefined ? remindApplication : undefined,
        remindPayment: remindPayment !== undefined ? remindPayment : undefined,
        remindTraining: remindTraining !== undefined ? remindTraining : undefined,
        calendarSynced: calendarSynced !== undefined ? calendarSynced : undefined,
      },
    });

    return NextResponse.json(updatedPlannedTraining);
  } catch (error) {
    console.error('Error updating planned training:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 受講予定の研修を削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: plannedTrainingId } = await params;

    // ユーザーを取得
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 所有権の確認
    const existing = await prisma.plannedTraining.findFirst({
      where: {
        id: plannedTrainingId,
        userId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // 受講予定の研修を削除
    await prisma.plannedTraining.delete({
      where: { id: plannedTrainingId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting planned training:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
