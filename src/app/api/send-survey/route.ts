import { NextResponse } from 'next/server';
import { FROM_EMAIL, createResendClient } from '@/lib/resend';

interface SendSurveyBody {
  survey_id: string;
  emails: string[];
  org_name?: string;
  survey_title?: string;
  survey_url?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: SendSurveyBody;
  try {
    body = (await req.json()) as SendSurveyBody;
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body', code: 'INVALID_BODY' },
      { status: 400 },
    );
  }

  if (!body.survey_id || !Array.isArray(body.emails)) {
    return NextResponse.json(
      { error: 'survey_id and emails are required', code: 'MISSING_FIELDS' },
      { status: 400 },
    );
  }

  const cleanEmails = body.emails.map((e) => e.trim()).filter((e) => EMAIL_RE.test(e));
  if (cleanEmails.length === 0) {
    return NextResponse.json(
      { error: 'No valid email addresses provided', code: 'NO_RECIPIENTS' },
      { status: 400 },
    );
  }

  const orgName = body.org_name ?? 'your school';
  const surveyTitle = body.survey_title ?? 'This month’s wellbeing pulse';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const surveyUrl = body.survey_url ?? `${appUrl}/s/${body.survey_id}`;

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({
      mocked: true,
      sent: cleanEmails.length,
      preview: { surveyUrl, recipients: cleanEmails.length },
    });
  }

  const resend = createResendClient();
  const html = buildEmailHtml({ orgName, surveyTitle, surveyUrl });
  const text = buildEmailText({ orgName, surveyTitle, surveyUrl });

  try {
    let sent = 0;
    for (const to of cleanEmails) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: `${surveyTitle} • 5 minutes, completely anonymous`,
        html,
        text,
      });
      sent += 1;
    }
    return NextResponse.json({ mocked: false, sent });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Send failed: ${message}`, code: 'SEND_FAILED' },
      { status: 500 },
    );
  }
}

function buildEmailHtml({
  orgName,
  surveyTitle,
  surveyUrl,
}: {
  orgName: string;
  surveyTitle: string;
  surveyUrl: string;
}): string {
  return `<!doctype html>
<html><head><meta charset="utf-8" /><title>${surveyTitle}</title></head>
<body style="margin:0;background:#f5f5f7;font-family:'DM Sans',Helvetica,Arial,sans-serif;color:#0B1628;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="height:12px;background:#00E090;"></td></tr>
        <tr><td style="padding:40px;">
          <div style="display:inline-block;padding:4px 12px;border-radius:99px;background:rgba(0,224,144,0.18);color:#0A8A60;font-size:12px;font-weight:500;">✦ ${escapeHtml(orgName)}</div>
          <h1 style="margin:14px 0 8px;font-family:'Syne',Helvetica,Arial,sans-serif;font-weight:700;font-size:32px;color:#0B1628;">${escapeHtml(surveyTitle)}</h1>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:rgba(11,22,40,0.7);">Five minutes. Completely anonymous. Your name is never recorded.</p>
          <a href="${escapeHtml(surveyUrl)}" style="display:inline-block;background:#1B6EF3;color:#fff;text-decoration:none;padding:14px 22px;border-radius:8px;font-weight:500;">Start the pulse →</a>
          <p style="margin:24px 0 0;font-size:13px;color:rgba(11,22,40,0.5);">Or paste this link into your browser:<br/><span style="word-break:break-all;color:#0B1628;">${escapeHtml(surveyUrl)}</span></p>
          <hr style="margin:32px 0;border:0;border-top:1px solid rgba(11,22,40,0.1);" />
          <p style="margin:0;font-size:12px;color:rgba(11,22,40,0.5);"><span style="color:#0A8A60;">✦</span> Made with Echo</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildEmailText({
  orgName,
  surveyTitle,
  surveyUrl,
}: {
  orgName: string;
  surveyTitle: string;
  surveyUrl: string;
}): string {
  return `${orgName}

${surveyTitle}

Five minutes. Completely anonymous. Your name is never recorded.

Start the pulse: ${surveyUrl}

✦ Made with Echo`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
