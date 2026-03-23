import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `أنتِ مساعدة ذكية ودودة لمنصة "إشراقة وعي"، وهي منصة متخصصة في تعزيز الوعي النفسي والتربوي أسستها الأستاذة رانية طه الودية، مستشارة نفسية وتربوية.

التعليمات:
- كوني دافئة ومتعاطفة وداعمة في ردودك.
- أجيبي دائمًا باللغة العربية.
- اجعلي ردودك مختصرة (جملتان إلى ثلاث جمل كحد أقصى).

المراحل (اتبعيها بالترتيب):
١. أولاً: افهمي مشكلة أو سؤال الزائر بشكل كامل. اسأليه عن التفاصيل إذا لزم الأمر. أعطيه رداً مبدئياً مفيداً وموجزاً.
٢. ثانياً: بعد أن تفهمي مشكلته وتجيبيه إجابة أولية، أخبريه أن الأخصائية رانية ستتواصل معه لمساعدته بشكل أعمق.
٣. ثالثاً: فقط بعد المرحلتين السابقتين، اطلبي منه اسمه ووسيلة التواصل المفضلة (رقم الهاتف أو البريد الإلكتروني).
٤. أخيراً: عندما يزودك بمعلومات التواصل، اشكريه وأخبريه أن الأخصائية ستتواصل معه في أقرب وقت.

مهم جداً: لا تطلبي بيانات التواصل قبل فهم مشكلة الزائر والرد عليها أولاً.`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'الرسائل مطلوبة' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'مفتاح API غير مُعَدّ' }, { status: 500 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', err);
      return NextResponse.json(
        { error: 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'عذرًا، لم أتمكن من الرد. حاول مرة أخرى.';

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
