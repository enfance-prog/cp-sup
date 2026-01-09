import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { sendNotificationEmail } from '@/lib/resend'; // 必要に応じて実装

// このAPIは管理者専用とすべきだが、今回は簡易的にURLを知っている前提で実装
// セキュリティを高めるなら、特定のClerk User IDのみ許可するなどのロジックを追加すべき

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const certNumber = searchParams.get('certNumber');

        if (!certNumber) {
            return NextResponse.json({ error: 'Certification number is required' }, { status: 400 });
        }

        const certification = await prisma.certification.findUnique({
            where: { certNumber },
            include: {
                user: true,
            },
        });

        if (!certification) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({
            userId: certification.user.id,
            name: certification.user.name,
            email: certification.user.email,
            certNumber: certification.certNumber,
            acquisitionDate: certification.acquisitionDate,
        });
    } catch (error) {
        console.error('Error searching certification:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, certNumber } = body;

        if (!userId || !certNumber) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // トランザクションで一貫性を保つ
        await prisma.$transaction(async (tx) => {
            // 1. 資格情報の削除
            await tx.certification.deleteMany({
                where: {
                    userId,
                    certNumber,
                },
            });

            // 2. 通知の作成
            await tx.notification.create({
                data: {
                    userId,
                    title: '登録情報の削除について',
                    message: `ご登録いただいていた臨床心理士番号（${certNumber}）は、重複登録または入力ミスの可能性があるため、管理者により削除されました。
正しい番号をご確認の上、再度プロフィール画面よりご登録ください。
ご不明な点がございましたら、お問い合わせフォームよりご連絡ください。`,
                },
            });
        });

        // TODO: メール通知も送る場合はここで実行
        // fireAndForgetEmail(userId, certNumber);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error revoking certification:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
