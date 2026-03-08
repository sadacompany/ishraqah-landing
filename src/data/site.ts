export const siteConfig = {
  name: 'إشراقة نفسية',
  nameEn: 'Ishraqah',
  tagline: 'نشر الوعي النفسي والتربوي من خلال الاستشارات والمؤلفات',
  description:
    'إشراقة نفسية - منصة متخصصة في نشر الوعي النفسي والتربوي، تقدم استشارات نفسية ومقالات تربوية ومحتوى توعوي بإشراف الأستاذة رانية طه الودية',
  url: 'https://eshraqaa.com',
  twitter: '@Ranyah_alwadyah',
  founder: {
    name: 'رانية طه الودية',
    title: 'مستشارة نفسية وتربوية',
    degree: 'بكالوريوس علم النفس - جامعة العلوم والتكنولوجيا اليمنية',
    honor: 'المركز الثالث بمرتبة الشرف',
  },
  nav: [
    { label: 'الرئيسية', href: '/' },
    { label: 'السيرة الذاتية', href: '/cv' },
    { label: 'المقالات', href: '/articles' },
    {
      label: 'الاستشارات',
      href: '/consultations',
      children: [
        { label: 'استشارة جديدة', href: '/consultations/new' },
        { label: 'متابعة استشارة', href: '/consultations/follow-up' },
        { label: 'أرشيف الاستشارات', href: '/consultations/archive' },
      ],
    },
    { label: 'المؤلفات', href: '/books' },
    { label: 'بصمة الزوار', href: '/guestbook' },
  ],
};
