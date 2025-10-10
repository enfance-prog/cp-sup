import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: trainingId } = await params;

    // ユーザーを取得
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 研修出席記録を削除
    await prisma.trainingAttendance.deleteMany({
      where: {
        userId: user.id,
        trainingId,
      },
    });

    // 研修を削除
    await prisma.training.delete({
      where: { id: trainingId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting training:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: trainingId } = await params;
    const body = await request.json();
    const { name, category, points, date, isOnline } = body;

    // ユーザーを取得
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 研修情報を更新
    const updatedTraining = await prisma.training.update({
      where: { id: trainingId },
      data: {
        name,
        category,
        points: parseInt(points),
        date: new Date(date + "T00:00:00.000Z"),
        isOnline: Boolean(isOnline),
      },
    });

    return NextResponse.json(updatedTraining);
  } catch (error) {
    console.error("Error updating training:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
