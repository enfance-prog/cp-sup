import { NextRequest, NextResponse } from 'next/server';
import { getTokens, createMultipleCalendarEvents } from '@/lib/google-calendar';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // エラーチェック
    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(
        new URL('/dashboard?calendar=error&message=認証がキャンセルされました', request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/dashboard?calendar=error&message=認証情報が不足しています', request.url)
      );
    }

    // stateをデコード
    let stateData: { userId: string; plannedTrainingId: string };
    try {
      const decodedState = Buffer.from(state, 'base64').toString('utf-8');
      stateData = JSON.parse(decodedState);
    } catch {
      return NextResponse.redirect(
        new URL('/dashboard?calendar=error&message=無効な認証状態です', request.url)
      );
    }

    // トークンを取得
    const tokens = await getTokens(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      return NextResponse.redirect(
        new URL('/dashboard?calendar=error&message=トークンの取得に失敗しました', request.url)
      );
    }

    // トークンを保存または更新
    await prisma.googleToken.upsert({
      where: { userId: stateData.userId },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
      create: {
        userId: stateData.userId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
    });

    // 受講予定の研修を取得
    const plannedTraining = await prisma.plannedTraining.findUnique({
      where: { id: stateData.plannedTrainingId },
    });

    if (!plannedTraining) {
      return NextResponse.redirect(
        new URL('/dashboard?calendar=error&message=研修予定が見つかりません', request.url)
      );
    }

    // カレンダーイベントを作成
    const results = await createMultipleCalendarEvents(
      tokens.access_token,
      tokens.refresh_token,
      {
        name: plannedTraining.name,
        applicationDeadline: plannedTraining.applicationDeadline,
        paymentDeadline: plannedTraining.paymentDeadline,
        trainingDate: plannedTraining.trainingDate,
        memo: plannedTraining.memo,
      }
    );

    // カレンダー連携済みフラグを更新
    const allSuccess = results.every((r) => r.success);
    if (allSuccess) {
      await prisma.plannedTraining.update({
        where: { id: stateData.plannedTrainingId },
        data: { calendarSynced: true },
      });
    }

    // 成功メッセージと共にリダイレクト
    const successCount = results.filter((r) => r.success).length;
    return NextResponse.redirect(
      new URL(
        `/dashboard?calendar=success&count=${successCount}`,
        request.url
      )
    );
  } catch (error) {
    console.error('Error in Google OAuth callback:', error);
    return NextResponse.redirect(
      new URL('/dashboard?calendar=error&message=カレンダー登録に失敗しました', request.url)
    );
  }
}
