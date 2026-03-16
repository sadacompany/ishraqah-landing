export interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  type: string;
  text: string;
  status: 'pending' | 'answered' | 'archived';
  answer: string;
  createdAt: string;
  answeredAt: string | null;
}

export interface QuizSubmission {
  id: string;
  answers: number[];
  totalScore: number;
  resultTitle: string;
  name?: string;
  phone?: string;
  email?: string;
  wantsFollowUp?: boolean;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  createdAt: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface StoredArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'psychology' | 'parenting' | 'relationships' | 'self-development';
  categoryLabel: string;
  featured: boolean;
  hidden: boolean;
  imageUrl: string;
  readTime: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoredQuote {
  id: string;
  text: string;
  hidden: boolean;
  createdAt?: string;
}

export interface PageView {
  id: number;
  path: string;
  ipAddress: string;
  userAgent: string;
  country: string;
  referrer: string;
  sessionId: string;
  durationSeconds: number;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  todayUniqueVisitors: number;
  topPages: { path: string; views: number }[];
  topCountries: { country: string; views: number }[];
  dailyViews: { date: string; views: number }[];
  recentVisitors: PageView[];
  contentCounts: {
    articles: number;
    consultations: number;
    pendingConsultations: number;
    quizSubmissions: number;
    guestbookEntries: number;
    quotes: number;
  };
}
