export const siteConfig = {
  name: 'إشراقة',
  nameEn: 'Ishraqah',
  tagline: 'تعزيز الوعي النفسي والتربوي من خلال الاستشارات والمؤلفات',
  description:
    'إشراقة - منصة متخصصة في تعزيز الوعي النفسي والتربوي، تقدم استشارات نفسية ومقالات تربوية ومحتوى توعوي بإشراف الأستاذة رانية طه الودية',
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
    { label: 'المؤلفات', href: '/books' },
    { label: 'بصمة الزوار', href: '/guestbook' },
  ] as { label: string; href: string; children?: { label: string; href: string }[] }[],
};
