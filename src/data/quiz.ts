export interface QuizQuestion {
  id: number;
  text: string;
  options: { label: string; value: number }[];
}

export interface QuizResult {
  range: [number, number];
  title: string;
  description: string;
  color: string;
}

export const panicQuiz = {
  title: 'اختبار نوبات الهلع',
  description:
    'هذا الاختبار يساعدك على تقييم مدى تعرضك لأعراض نوبات الهلع. الاختبار لأغراض توعوية فقط ولا يُغني عن استشارة متخصص.',
  disclaimer:
    'هذا الاختبار لأغراض توعوية وتثقيفية فقط، ولا يُعد تشخيصاً طبياً. إذا كنت تعاني من أعراض مستمرة، يُرجى مراجعة مختص.',
  questions: [
    {
      id: 1,
      text: 'هل تشعر بخفقان مفاجئ وسريع في القلب دون سبب واضح؟',
      options: [
        { label: 'أبداً', value: 0 },
        { label: 'نادراً', value: 1 },
        { label: 'أحياناً', value: 2 },
        { label: 'كثيراً', value: 3 },
      ],
    },
    {
      id: 2,
      text: 'هل تعاني من ضيق في التنفس أو الشعور بالاختناق فجأة؟',
      options: [
        { label: 'أبداً', value: 0 },
        { label: 'نادراً', value: 1 },
        { label: 'أحياناً', value: 2 },
        { label: 'كثيراً', value: 3 },
      ],
    },
    {
      id: 3,
      text: 'هل تشعر بدوخة أو عدم ثبات أو إغماء؟',
      options: [
        { label: 'أبداً', value: 0 },
        { label: 'نادراً', value: 1 },
        { label: 'أحياناً', value: 2 },
        { label: 'كثيراً', value: 3 },
      ],
    },
    {
      id: 4,
      text: 'هل تشعر بخوف شديد من الموت أو فقدان السيطرة أثناء هذه النوبات؟',
      options: [
        { label: 'أبداً', value: 0 },
        { label: 'نادراً', value: 1 },
        { label: 'أحياناً', value: 2 },
        { label: 'كثيراً', value: 3 },
      ],
    },
    {
      id: 5,
      text: 'هل تعاني من تعرق مفاجئ أو برودة في الأطراف؟',
      options: [
        { label: 'أبداً', value: 0 },
        { label: 'نادراً', value: 1 },
        { label: 'أحياناً', value: 2 },
        { label: 'كثيراً', value: 3 },
      ],
    },
    {
      id: 6,
      text: 'هل تتجنب أماكن أو مواقف معينة خوفاً من حدوث نوبة؟',
      options: [
        { label: 'أبداً', value: 0 },
        { label: 'نادراً', value: 1 },
        { label: 'أحياناً', value: 2 },
        { label: 'كثيراً', value: 3 },
      ],
    },
    {
      id: 7,
      text: 'هل تشعر بألم أو ضغط في الصدر أثناء النوبة؟',
      options: [
        { label: 'أبداً', value: 0 },
        { label: 'نادراً', value: 1 },
        { label: 'أحياناً', value: 2 },
        { label: 'كثيراً', value: 3 },
      ],
    },
    {
      id: 8,
      text: 'هل تؤثر هذه الأعراض على حياتك اليومية وعلاقاتك الاجتماعية؟',
      options: [
        { label: 'أبداً', value: 0 },
        { label: 'نادراً', value: 1 },
        { label: 'أحياناً', value: 2 },
        { label: 'كثيراً', value: 3 },
      ],
    },
  ] as QuizQuestion[],
  results: [
    {
      range: [0, 6] as [number, number],
      title: 'لا تعاني من أعراض نوبات الهلع',
      description:
        'نتائجك تشير إلى أنك لا تعاني من أعراض ملحوظة لنوبات الهلع. استمر في العناية بصحتك النفسية من خلال الاسترخاء والرياضة والتواصل الاجتماعي الإيجابي.',
      color: 'emerald',
    },
    {
      range: [7, 13] as [number, number],
      title: 'أعراض خفيفة',
      description:
        'تظهر لديك بعض الأعراض الخفيفة التي قد تكون مرتبطة بالتوتر اليومي. يُنصح بممارسة تقنيات الاسترخاء والتنفس العميق، والاهتمام بالنوم الكافي والرياضة المنتظمة.',
      color: 'amber',
    },
    {
      range: [14, 18] as [number, number],
      title: 'أعراض متوسطة',
      description:
        'تشير النتائج إلى وجود أعراض متوسطة قد تحتاج لاهتمام أكبر. يُنصح بتعلم تقنيات إدارة القلق والتفكير في استشارة مختص نفسي للحصول على الدعم المناسب.',
      color: 'orange',
    },
    {
      range: [19, 24] as [number, number],
      title: 'أعراض ملحوظة',
      description:
        'النتائج تشير إلى وجود أعراض ملحوظة لنوبات الهلع. يُنصح بشدة بمراجعة مختص نفسي للحصول على التقييم والعلاج المناسب. تذكر أن طلب المساعدة هو خطوة قوية نحو التعافي.',
      color: 'red',
    },
  ] as QuizResult[],
};
