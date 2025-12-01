import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clerkからユーザー情報を取得
    const clerkUser = await currentUser();

    // ユーザーと資格情報を取得
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        certifications: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
        googleToken: {
          select: {
            id: true, // トークンの存在確認用
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ 
        name: '',
        email: clerkUser?.primaryEmailAddress?.emailAddress || '',
        certification: null,
        hasGoogleToken: false,
      });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email || clerkUser?.primaryEmailAddress?.emailAddress || '',
      certification: user.certifications[0] || null,
      hasGoogleToken: !!user.googleToken,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clerkからユーザー情報を取得（メールアドレス用）
    const clerkUser = await currentUser();
    const email = clerkUser?.primaryEmailAddress?.emailAddress || null;

    const body = await request.json();
    const { name, certNumber, acquisitionDate } = body;

    if (!name || !certNumber || !acquisitionDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
          name,
          email,
        },
      });
    } else {
      // 名前とメールアドレスを更新
      user = await prisma.user.update({
        where: { clerkId: userId },
        data: { name, email },
      });
    }

    // 有効期限を計算（取得日から5年後）
    const acquisitionDateObj = new Date(acquisitionDate + 'T00:00:00.000Z');
    const expirationDate = new Date(acquisitionDateObj);
    expirationDate.setFullYear(expirationDate.getFullYear() + 5);

    // 既存の資格情報を確認
    const existingCert = await prisma.certification.findFirst({
      where: { userId: user.id },
    });

    if (existingCert) {
      // 資格情報を更新
      await prisma.certification.update({
        where: { id: existingCert.id },
        data: {
          certNumber,
          acquisitionDate: acquisitionDateObj,
          expirationDate,
        },
      });
    } else {
      // 資格情報を作成
      await prisma.certification.create({
        data: {
          certNumber,
          userId: user.id,
          acquisitionDate: acquisitionDateObj,
          expirationDate,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
