import { Injectable, signal } from '@angular/core';
import { BlogPost, BlogCategory } from '../../../../models';

const MOCK_POSTS: BlogPost[] = [
  {
    id: 'b-1', slug: 'top-angular-interview-questions-2026', featured: true,
    title: 'Top 30 Angular Interview Questions to Crack in 2026',
    titleAr: 'أفضل 30 سؤالا في مقابلات Angular لتنجح في عام 2026',
    excerpt: 'Prepare for your next Angular interview with this comprehensive guide covering signals, standalone components, and advanced patterns.',
    excerptAr: 'استعد لمقابلة Angular القادمة من خلال هذا الدليل الشامل الذي يغطي الإشارات والمكونات المستقلة والأنماط المتقدمة.',
    content: 'Angular continues to evolve rapidly. In 2026, interviewers focus heavily on signals-based reactivity, standalone components, and the new control flow syntax. This guide covers the 30 most commonly asked questions with detailed answers...',
    contentAr: 'تواصل Angular التطور بسرعة. في عام 2026، يركز القائمون على المقابلات بشكل كبير على التفاعلية المعتمدة على الإشارات والمكونات المستقلة وبنية التحكم الجديدة. يغطي هذا الدليل أكثر 30 سؤالا شيوعا مع إجابات مفصلة...',
    category: 'Tech', tags: ['Angular', 'Interview', 'Frontend'],
    tagsAr: ['Angular', 'مقابلة', 'الواجهة الأمامية'],
    author: {
      name: 'Rahul Mehta',
      nameAr: 'راهول ميهتا',
      avatar: 'RM',
      bio: 'Senior Frontend Engineer at Stripe',
      bioAr: 'مهندس واجهات أمامية أول في Stripe'
    },
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    publishedAt: '2026-04-01', readTimeMinutes: 12,
  },
  {
    id: 'b-2', slug: 'how-to-write-a-standout-resume', featured: false,
    title: 'How to Write a Resume That Gets You Interviews in 2026',
    titleAr: 'كيف تكتب سيرة ذاتية تحصل بها على مقابلات عمل في 2026',
    excerpt: 'Learn the modern resume writing techniques that ATS systems love and that hiring managers actually read.',
    excerptAr: 'تعلم أساليب كتابة السيرة الذاتية الحديثة التي تحبها أنظمة ATS والتي يقرأها مديرو التوظيف فعلاً.',
    content: 'A well-crafted resume is your ticket to landing interviews. In 2026, with AI-powered ATS tools screening most resumes, you need to ensure your resume is both human-readable and machine-parseable...',
    category: 'Career Tips', tags: ['Resume', 'Job Search', 'Career'],
    tagsAr: ['سيرة ذاتية', 'البحث عن عمل', 'مهنة'],
    author: { name: 'Priya Sharma', nameAr: 'بريا شارما', avatar: 'PS', bio: 'Career Coach & HR Consultant', bioAr: 'مدربة مهنية واستشارية موارد بشرية' },
    coverImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
    publishedAt: '2026-03-28', readTimeMinutes: 8,
  },
  {
    id: 'b-3', slug: 'freelancing-guide-india-2026', featured: false,
    title: 'The Complete Freelancing Guide for Indian Developers in 2026',
    titleAr: 'الدليل الشامل للعمل الحر للمطورين الهنود في 2026',
    excerpt: 'From setting up your profile to landing international clients, here is everything you need to know to freelance successfully.',
    excerptAr: 'من إنشاء ملفك الشخصي إلى الحصول على عملاء دوليين، إليك كل ما تحتاج معرفته للنجاح في العمل الحر.',
    content: 'Freelancing has become a mainstream career path in India. With platforms like Upwork, Toptal, and local portals offering significant opportunities, developers can earn 3-5x their traditional salary by going freelance...',
    category: 'Freelancing', tags: ['Freelancing', 'India', 'Remote Work'],
    tagsAr: ['العمل الحر', 'الهند', 'العمل عن بُعد'],
    author: { name: 'Arjun Patel', nameAr: 'أرجون باتيل', avatar: 'AP', bio: 'Full-Stack Developer & Freelancer', bioAr: 'مطور متكامل ومستقل' },
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    publishedAt: '2026-03-20', readTimeMinutes: 15,
  },
  {
    id: 'b-4', slug: 'tech-hiring-trends-2026', featured: false,
    title: 'Tech Hiring Trends: What Employers Are Looking for in 2026',
    titleAr: 'اتجاهات التوظيف التقني: ما الذي يبحث عنه أصحاب العمل في 2026',
    excerpt: 'AI skills, system design, and soft skills top the list as companies redefine what makes a great tech hire.',
    excerptAr: 'تتصدر مهارات الذكاء الاصطناعي وتصميم الأنظمة والمهارات الشخصية القائمة بينما تعيد الشركات تعريف ما يجعل موظف التقنية مثالياً.',
    content: 'The tech hiring landscape has shifted dramatically. Employers in 2026 are looking for candidates who combine strong technical fundamentals with AI literacy and excellent communication skills...',
    category: 'Industry News', tags: ['Hiring', 'Tech', 'Trends'],
    tagsAr: ['التوظيف', 'التقنية', 'الاتجاهات'],
    author: { name: 'Kavya Reddy', nameAr: 'كافيا ريدي', avatar: 'KR', bio: 'Tech Recruiter at Infosys', bioAr: 'مسؤولة توظيف تقني في Infosys' },
    coverImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
    publishedAt: '2026-03-15', readTimeMinutes: 6,
  },
  {
    id: 'b-5', slug: 'negotiating-your-salary', featured: false,
    title: 'How to Negotiate Your Salary and Get What You Deserve',
    titleAr: 'كيف تتفاوض على راتبك وتحصل على ما تستحق',
    excerpt: 'A practical negotiation playbook from researching market rates to closing the conversation with confidence.',
    excerptAr: 'دليل تفاوضي عملي من البحث عن أسعار السوق إلى إتمام المحادثة بثقة.',
    content: 'Salary negotiation is one of the most valuable skills you can develop in your career. Research shows that candidates who negotiate earn an average of 15% more over their lifetime compared to those who accept the first offer...',
    category: 'Career Tips', tags: ['Salary', 'Negotiation', 'Career'],
    tagsAr: ['الراتب', 'التفاوض', 'مهنة'],
    author: { name: 'Anjali Nair', nameAr: 'أنجالي ناير', avatar: 'AN', bio: 'Career Strategist', bioAr: 'استراتيجية مسار مهني' },
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    publishedAt: '2026-03-10', readTimeMinutes: 10,
  },
  {
    id: 'b-6', slug: 'interview-with-a-software-engineer-at-google', featured: false,
    title: '"It Took Me 6 Attempts" An Interview with a Google Engineer',
    titleAr: '"استغرق الأمر مني 6 محاولات" مقابلة مع مهندس في Google',
    excerpt: 'Vikram shares his honest journey from rejections to landing his dream job at Google Bangalore, and the lessons he learned.',
    excerptAr: 'يشارك فيكرام رحلته الصادقة من الرفض إلى الحصول على وظيفة أحلامه في Google بنغالور والدروس التي تعلمها.',
    content: 'Vikram Singh, now a Senior Software Engineer at Google, sat down with us to share his raw and honest journey. His story is one of persistence, learning from failure, and methodical preparation...',
    category: 'Interviews', tags: ['Google', 'Interview', 'Success Story'],
    tagsAr: ['Google', 'مقابلة', 'قصة نجاح'],
    author: { name: 'Editorial Team', nameAr: 'فريق التحرير', avatar: 'ET', bio: 'JobPortal Editorial', bioAr: 'تحرير بوابة الوظائف' },
    coverImage: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80',
    publishedAt: '2026-03-05', readTimeMinutes: 9,
  },
];

export interface BlogFilter {
  category: BlogCategory | '';
  search: string;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  private posts = signal<BlogPost[]>(MOCK_POSTS);

  getAll(): BlogPost[] { return this.posts(); }

  getFeatured(): BlogPost | undefined {
    return this.posts().find(p => p.featured);
  }

  getFiltered(filter: BlogFilter): BlogPost[] {
    return this.posts().filter(p => {
      if (filter.category && p.category !== filter.category) return false;
      if (filter.search && !p.title.toLowerCase().includes(filter.search.toLowerCase()) && !p.excerpt.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    });
  }

  getBySlug(slug: string): BlogPost | undefined {
    return this.posts().find(p => p.slug === slug);
  }

  getCategories(): BlogCategory[] {
    return [...new Set(this.posts().map(p => p.category))];
  }

  getRelated(post: BlogPost, limit = 3): BlogPost[] {
    return this.posts().filter(p => p.id !== post.id && p.category === post.category).slice(0, limit);
  }
}
