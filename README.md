# إشراقة نفسية - Ishraqah

A modern, premium Arabic-first website for psychological and educational awareness. Redesigned from the ground up with a focus on elegance, readability, and trust.

## About

**إشراقة نفسية** is a platform dedicated to spreading psychological and educational awareness through consultations, articles, books, and multimedia content. Founded by **رانية طه الودية**, a certified psychological and educational consultant.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Font:** Tajawal (Arabic-optimized Google Font)
- **Rendering:** Static Site Generation (SSG)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    page.tsx              # Homepage
    about/                # About page
    cv/                   # Founder CV page
    articles/             # Articles listing + [slug] detail
    consultations/        # Consultations hub
      new/                # New consultation form
      follow-up/          # Follow-up lookup
      archive/            # Published consultation archive
    self-test/            # Interactive panic attack quiz
    books/                # Book showcase
    videos/               # Educational videos
    guestbook/            # Visitor guestbook
    layout.tsx            # Root layout (RTL, Arabic font)
    globals.css           # Global styles + Tailwind theme
  components/             # Reusable UI components
    Header.tsx            # Sticky header with mobile menu
    Footer.tsx            # Footer with links and social
    SectionHeading.tsx    # Section title component
    ArticleCard.tsx       # Article card (3 variants)
    QuoteCard.tsx         # Quote/kharbsha card
    ConsultationCard.tsx  # Consultation Q&A card
    FounderBio.tsx        # Founder profile (2 variants)
  data/                   # Content data layer
    site.ts               # Site config and navigation
    founder.ts            # Founder profile data
    articles.ts           # Articles with full content
    quotes.ts             # Kharbshat (pen reflections)
    consultations.ts      # Sample consultations
    quiz.ts               # Self-test quiz data
```

## Design System

### Color Palette

| Token | Hex | Use |
|-------|-----|-----|
| `cream` | `#FDFAF6` | Page background |
| `cream-warm` | `#F5F0EA` | Card surfaces |
| `cream-dark` | `#EDE5D8` | Borders, dividers |
| `charcoal` | `#2C2825` | Primary text |
| `charcoal-light` | `#6B6460` | Secondary text |
| `bronze` | `#8B6F4E` | Primary accent |
| `bronze-light` | `#C9A882` | Hover states |
| `bronze-glow` | `#E8D5C0` | Soft highlight |
| `teal` | `#5B7B7A` | Secondary accent |
| `teal-pale` | `#E5EDED` | Light teal background |

### Typography

- **Font:** Tajawal (weights: 200-800)
- **Direction:** RTL-first
- **Language:** Arabic-first

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, founder, articles, consultations, book, quiz teaser, quotes |
| `/about` | About the platform, mission, services |
| `/cv` | Full founder CV with experience, certifications, courses |
| `/articles` | All articles with category filters |
| `/articles/[slug]` | Article detail with related articles |
| `/consultations` | Consultation services hub |
| `/consultations/new` | New consultation form |
| `/consultations/follow-up` | Follow-up lookup |
| `/consultations/archive` | Published consultations archive |
| `/self-test` | Interactive panic attack assessment quiz |
| `/books` | Book showcase for "كتاب إشراقة" |
| `/videos` | Educational video gallery |
| `/guestbook` | Visitor feedback wall |

## Extending

### Adding Articles

Add new entries to `src/data/articles.ts`:

```typescript
{
  id: '13',
  slug: 'your-slug',
  title: 'عنوان المقال',
  excerpt: 'مقتطف...',
  content: `محتوى المقال الكامل...`,
  category: 'psychology',
  categoryLabel: 'علم النفس',
  featured: false,
  readTime: 5,
}
```

### Adding Quotes

Add to `src/data/quotes.ts`:

```typescript
{ id: '17', text: 'نص الاقتباس الجديد.' }
```

### Adding Consultations

Add to `src/data/consultations.ts` with question/answer pairs.

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Or build and serve statically:

```bash
npm run build
npx serve out
```

## SEO

- Arabic meta titles and descriptions on every page
- Open Graph and Twitter Card metadata
- Proper heading hierarchy (h1 > h2 > h3)
- Static generation for all pages
- Clean URL structure
