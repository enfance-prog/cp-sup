import { google } from 'googleapis';

// OAuth2クライアントを作成
export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

// 認証URLを生成
export function getAuthUrl(state: string) {
  const oauth2Client = getOAuth2Client();
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    state,
    prompt: 'consent', // 毎回リフレッシュトークンを取得
  });
}

// トークンを取得
export async function getTokens(code: string) {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

// カレンダーイベントを作成
export async function createCalendarEvent(
  accessToken: string,
  refreshToken: string,
  event: {
    summary: string;
    description?: string;
    date: Date;
    startTime?: string; // HH:mm形式、指定がなければ09:00
  }
) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  // 日付をJST（日本時間）で設定
  const eventDate = new Date(event.date);
  const startTime = event.startTime || '09:00';
  const [hours, minutes] = startTime.split(':').map(Number);
  
  const startDateTime = new Date(eventDate);
  startDateTime.setHours(hours, minutes, 0, 0);
  
  const endDateTime = new Date(startDateTime);
  endDateTime.setHours(hours + 1, minutes, 0, 0); // 1時間のイベント

  const calendarEvent = {
    summary: event.summary,
    description: event.description || '',
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'Asia/Tokyo',
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'Asia/Tokyo',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 60 }, // 1時間前
        { method: 'popup', minutes: 1440 }, // 1日前
      ],
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: calendarEvent,
  });

  return response.data;
}

// 複数のイベントを一括作成（申込期日、支払期日、研修日）
export async function createMultipleCalendarEvents(
  accessToken: string,
  refreshToken: string,
  plannedTraining: {
    name: string;
    applicationDeadline?: Date | null;
    paymentDeadline?: Date | null;
    trainingDate: Date;
    memo?: string | null;
  }
) {
  const results: { type: string; success: boolean; eventId?: string; error?: string }[] = [];

  // 申込期日
  if (plannedTraining.applicationDeadline) {
    try {
      const event = await createCalendarEvent(accessToken, refreshToken, {
        summary: `【申込期日】${plannedTraining.name}`,
        description: plannedTraining.memo || undefined,
        date: plannedTraining.applicationDeadline,
      });
      results.push({ type: 'application', success: true, eventId: event.id || undefined });
    } catch (error) {
      results.push({ type: 'application', success: false, error: String(error) });
    }
  }

  // 支払期日
  if (plannedTraining.paymentDeadline) {
    try {
      const event = await createCalendarEvent(accessToken, refreshToken, {
        summary: `【支払期日】${plannedTraining.name}`,
        description: plannedTraining.memo || undefined,
        date: plannedTraining.paymentDeadline,
      });
      results.push({ type: 'payment', success: true, eventId: event.id || undefined });
    } catch (error) {
      results.push({ type: 'payment', success: false, error: String(error) });
    }
  }

  // 研修日
  try {
    const event = await createCalendarEvent(accessToken, refreshToken, {
      summary: `【研修】${plannedTraining.name}`,
      description: plannedTraining.memo || undefined,
      date: plannedTraining.trainingDate,
    });
    results.push({ type: 'training', success: true, eventId: event.id || undefined });
  } catch (error) {
    results.push({ type: 'training', success: false, error: String(error) });
  }

  return results;
}
