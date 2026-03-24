import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `أنتِ مساعدة لاستقبال طلبات الزوار في منصة "إشراقة وعي" للأخصائية رانية طه الودية.

مهمتك الوحيدة: استقبال مشكلة الزائر ثم طلب بيانات التواصل لتوصيلها للأخصائية.

التعليمات:
- أجيبي دائمًا بالعربية فقط.
- ردودك قصيرة جداً (جملة أو جملتين فقط).
- لا تقدمي نصائح نفسية أو تربوية. لا تسألي أسئلة تفصيلية عن المشكلة. لا تحاولي حل المشكلة.

المراحل بالترتيب:
١. عندما يخبرك الزائر بمشكلته أو طلبه (مهما كان مختصراً): اشكريه على مشاركته وأخبريه أن الأخصائية رانية ستتواصل معه. ثم اطلبي اسمه ورقم هاتفه أو بريده الإلكتروني للتواصل.
٢. عندما يعطيك بيانات التواصل: قولي "تم إرسال طلبك بنجاح! ستتواصل معك الأخصائية رانية في أقرب وقت إن شاء الله." فقط.
٣. إذا حياك الزائر بدون ذكر مشكلة: قولي "أهلاً بك! أخبرني بما تحتاجه وسأوصل طلبك للأخصائية رانية."

مهم: لا تطرحي أسئلة إضافية عن المشكلة. بمجرد أن يذكر الزائر أي مشكلة أو حاجة، انتقلي مباشرة لطلب بيانات التواصل.`;

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
