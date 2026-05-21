import { NextResponse } from 'next/server';
import { ECHO_MODEL, createAnthropicClient } from '@/lib/anthropic';
import type { NewsletterSection } from '@/types';

interface GenerateNewsletterBody {
  organisation_id: string;
  survey_id: string;
  orgName?: string;
  data?: {
    wellbeing_score: number;
    wellbeing_delta: number;
    category_scores: { category: string; score: number }[];
    response_rate: number;
    responded: number;
    total_staff: number;
    top_insight?: string;
    staff_submissions?: { type: string; nominee_name?: string | null; content: string }[];
  };
}

interface GenerateNewsletterResponse {
  title: string;
  sections: NewsletterSection[];
}

const MOCK_RESPONSE: GenerateNewsletterResponse = {
  title: 'May, in our own words',
  sections: [
    {
      type: 'welcome',
      heading: 'Thank you for the honesty',
      content:
        "Forty two of you filled in this month's pulse. That's the highest response we've ever had, and the picture you've painted is one I'm proud of. Some of it is hard reading. Most of it is the sort of thing other schools would queue up for. Here is what you said, what it means, and what we are going to do about it.",
    },
    {
      type: 'wellbeing_snapshot',
      heading: 'Belonging climbed all year',
      content:
        "Belonging sits at 8.1 out of 10, our highest score in this category since we started measuring. That isn't an abstract number. It means that on a random Tuesday morning, more of you walk into this building feeling that you fit here than at any point last year. That is the result of the small, deliberate things you do for each other. The corridor hellos. The covering for each other when half a class is off. The way our staffroom sounds at the end of a long day. Keep doing it.",
    },
    {
      type: 'staff_spotlight',
      heading: 'For Mr Patel',
      content:
        "An anonymous shout-out arrived this month for Aman. The words were these: he covered three of my lessons last week without being asked when I was unwell, and he made sure my Year 4s still had their reading time. That kind of quiet kindness is what makes our school feel like home. Aman, thank you. The colleague who wrote this couldn't sign their name, but they wanted you to know.",
    },
    {
      type: 'from_the_team',
      heading: 'Three things you asked for',
      content:
        "You used the open box this month to ask for three specific things. Shorter Monday briefings. A calmer lunch rota for the Year 6 team. More shared planning time for KS1. All three are reasonable. All three are happening from June. We have written up exactly how in the staffroom.",
    },
    {
      type: 'looking_ahead',
      heading: 'Workload is where we focus next',
      content:
        "Workload sits at 5.4, our lowest score, and it has not moved much for three months. That is a signal we cannot ignore. Before the end of term, every year team will sit down with me for thirty minutes to walk through what we can take off the plate. Not a survey about workload. A conversation about it. Look out for the diary invite.",
    },
  ],
};

export async function POST(req: Request) {
  let body: GenerateNewsletterBody;
  try {
    body = (await req.json()) as GenerateNewsletterBody;
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body', code: 'INVALID_BODY' },
      { status: 400 },
    );
  }

  if (!body.organisation_id || !body.survey_id) {
    return NextResponse.json(
      { error: 'organisation_id and survey_id are required', code: 'MISSING_FIELDS' },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ...MOCK_RESPONSE, _mocked: true });
  }

  const orgName = body.orgName ?? 'your school';
  const data = body.data;

  const prompt = `You are writing a monthly staff newsletter for ${orgName}, a UK primary school. The audience is the school's own teachers and support staff, plus parents who might forward it, plus the wider community who follow the school. It will be read on phones, printed for noticeboards, and shared on LinkedIn.

Your job is NOT to summarise data. Your job is to interpret it warmly. For every number, explain what it means in human terms, what it tells us about how the term has felt, and what we can be proud of. Find the win in every score, even a low one. Never just state a score and move on.

VOICE:
- Warm, specific, confident. Like a headteacher who knows their staff by name writing a personal note.
- Celebratory where the data allows. Honest where it doesn't.
- Short sentences. Plain words. British English.
- Never corporate. Never management-speak. Never the word "stakeholders".
- Never em dashes. Use full stops, commas, or a new sentence.
- Refer to real specifics from the data (names, scores, the actual shout-outs) rather than abstract claims.

INTERPRETATION GUIDE for scores:
- 8.0 and above: name the win, attribute it to specific behaviours staff are already doing, ask them to keep doing it.
- 6.0 to 7.9: acknowledge the trend, identify what is working, hint at where there is still room.
- Below 6.0: be honest. Say the score. Connect it to lived experience. Then say what is being done about it, concretely. Never paper over a low score with corporate optimism.

DATA FROM THIS MONTH'S PULSE:
- Overall wellbeing: ${data?.wellbeing_score ?? 'n/a'}/10 (${(data?.wellbeing_delta ?? 0) > 0 ? '+' : ''}${data?.wellbeing_delta ?? 0} on last month)
- Category scores: ${JSON.stringify(data?.category_scores ?? [])}
- Response rate: ${data?.response_rate ?? 'n/a'}% (${data?.responded ?? 0} of ${data?.total_staff ?? 0} staff)
- Top insight: ${data?.top_insight ?? 'n/a'}
- Staff shout-outs and submissions: ${JSON.stringify(data?.staff_submissions ?? [])}

SECTIONS:
You must generate exactly five sections, in this order. Headings must be specific to THIS month's data, not generic. Avoid generic templates like "Wellbeing snapshot" or "Looking ahead". A heading should tell you what the section is about before you read it.

1. welcome: 3-4 sentences. Acknowledge the month, the response rate, the honesty. Set a personal tone. Not a corporate "Dear all".
2. wellbeing_snapshot: 4-6 sentences. Pick the strongest category score and lead with it. Explain what that score actually means for life inside the school. Reference the specific behaviours that produce that score. Then briefly name where the picture is more mixed and what it tells us.
3. staff_spotlight: 3-5 sentences. Use the top shout-out verbatim or near-verbatim. Name the person. Thank them as the head would. Let it feel personal.
4. from_the_team: 3-5 sentences. Summarise what staff said in the open submissions. If they asked for something, say it, and say what's happening about it.
5. looking_ahead: 3-4 sentences. Focus on the lowest-scoring or most-stuck area. Be honest about it. Then say one concrete thing being done in response, with a timeline. End on a quiet, warm note.

The TITLE should be specific and editorial, not "May 2026 Newsletter". Examples of good titles: "May, in our own words", "Five things to be proud of this month", "What April taught us".

Return ONLY valid JSON, no markdown fences, no preamble:

{
  "title": "string",
  "sections": [
    { "type": "welcome", "heading": "string", "content": "string" },
    { "type": "wellbeing_snapshot", "heading": "string", "content": "string" },
    { "type": "staff_spotlight", "heading": "string", "content": "string" },
    { "type": "from_the_team", "heading": "string", "content": "string" },
    { "type": "looking_ahead", "heading": "string", "content": "string" }
  ]
}`;

  try {
    const anthropic = createAnthropicClient();
    const response = await anthropic.messages.create({
      model: ECHO_MODEL,
      max_tokens: 2500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
    const parsed = JSON.parse(text) as GenerateNewsletterResponse;

    if (!parsed.title || !Array.isArray(parsed.sections)) {
      throw new Error('Malformed response from model');
    }

    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Newsletter generation failed: ${message}`, code: 'GENERATION_FAILED' },
      { status: 500 },
    );
  }
}
