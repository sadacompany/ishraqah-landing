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
  readTime: number;
  source: 'static' | 'local';
}

export interface StoredQuote {
  id: string;
  text: string;
  source: 'static' | 'local';
}

export interface AdminSettings {
  passwordHash: string;
  setupComplete: boolean;
}
