import { Injectable, signal } from '@angular/core';
import { Course } from '../../../../models';

const MOCK_COURSES: Course[] = [
  {
    id: 'c-1', title: 'Full-Stack Web Development Bootcamp', titleAr: 'معسكر تطوير الويب المتكامل',
    description: 'Master HTML, CSS, JavaScript, Angular, Node.js and PostgreSQL to become a job-ready full-stack developer.',
    descriptionAr: 'أتقن HTML وCSS وJavaScript وAngular وNode.js وPostgreSQL لتصبح مطورا متكاملا جاهزا لسوق العمل.',
    instructorName: 'Rahul Mehta', instructorNameAr: 'راهول ميهتا', instructorAvatar: 'RM', level: 'Beginner', category: 'Web Development', categoryAr: 'تطوير الويب',
    duration: '12 weeks', durationAr: '12 أسبوعا', price: 0, currency: 'INR', rating: 4.8, enrolledCount: 12400,
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
    skills: ['HTML/CSS', 'JavaScript', 'Angular', 'Node.js', 'PostgreSQL'], certificateOffered: true,
    skillsAr: ['HTML/CSS', 'JavaScript', 'Angular', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 'c-2', title: 'Python for Data Science & Machine Learning', titleAr: 'بايثون لعلوم البيانات وتعلم الآلة',
    description: 'Learn Python, Pandas, NumPy, Matplotlib, and Scikit-learn through real-world projects.',
    descriptionAr: 'تعلم Python وPandas وNumPy وMatplotlib وScikit-learn من خلال مشاريع واقعية.',
    instructorName: 'Priya Sharma', instructorNameAr: 'بريا شارما', instructorAvatar: 'PS', level: 'Intermediate', category: 'Data Science', categoryAr: 'علوم البيانات',
    duration: '8 weeks', durationAr: '8 أسابيع', price: 2999, currency: 'INR', rating: 4.7, enrolledCount: 8900,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80',
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib'], certificateOffered: true,
    skillsAr: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib'],
  },
  {
    id: 'c-3', title: 'UI/UX Design Fundamentals', titleAr: 'أساسيات تصميم UI/UX',
    description: 'Learn user-centered design principles, Figma, prototyping, and how to conduct user research.',
    descriptionAr: 'تعلم مبادئ التصميم المتمحور حول المستخدم وFigma والنمذجة الأولية وكيفية إجراء أبحاث المستخدمين.',
    instructorName: 'Anjali Nair', instructorNameAr: 'أنجالي ناير', instructorAvatar: 'AN', level: 'Beginner', category: 'Design', categoryAr: 'التصميم',
    duration: '6 weeks', durationAr: '6 أسابيع', price: 1999, currency: 'INR', rating: 4.9, enrolledCount: 6700,
    thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80',
    skills: ['Figma', 'Wireframing', 'Prototyping', 'User Research'], certificateOffered: true,
    skillsAr: ['Figma', 'التخطيط الهيكلي', 'النماذج الأولية', 'بحث المستخدم'],
  },
  {
    id: 'c-4', title: 'Advanced React & Next.js', titleAr: 'React و Next.js المتقدمان',
    description: 'Build production-grade web applications with React 19, Next.js 15, TypeScript and modern tooling.',
    descriptionAr: 'أنشئ تطبيقات ويب جاهزة للإنتاج باستخدام React 19 وNext.js 15 وTypeScript وأدوات حديثة.',
    instructorName: 'Vikram Singh', instructorNameAr: 'فيكرام سينغ', instructorAvatar: 'VS', level: 'Advanced', category: 'Web Development', categoryAr: 'تطوير الويب',
    duration: '10 weeks', durationAr: '10 أسابيع', price: 3999, currency: 'INR', rating: 4.8, enrolledCount: 5200,
    thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600&q=80',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'], certificateOffered: true,
    skillsAr: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
  },
  {
    id: 'c-5', title: 'Digital Marketing Mastery', titleAr: 'إتقان التسويق الرقمي',
    description: 'Learn SEO, SEM, social media marketing, email marketing, and analytics from scratch.',
    descriptionAr: 'تعلم SEO وSEM والتسويق عبر وسائل التواصل الاجتماعي والتسويق عبر البريد الإلكتروني والتحليلات من الصفر.',
    instructorName: 'Kavya Reddy', instructorNameAr: 'كافيا ريدي', instructorAvatar: 'KR', level: 'Beginner', category: 'Marketing', categoryAr: 'التسويق',
    duration: 'Self-paced', durationAr: 'بالسرعة التي تناسبك', price: 0, currency: 'INR', rating: 4.5, enrolledCount: 15000,
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&q=80',
    skills: ['SEO', 'Google Ads', 'Social Media', 'Email Marketing', 'Analytics'], certificateOffered: false,
    skillsAr: ['SEO', 'إعلانات Google', 'وسائل التواصل الاجتماعي', 'التسويق عبر البريد الإلكتروني', 'التحليلات'],
  },
  {
    id: 'c-6', title: 'DevOps & Cloud Engineering', titleAr: 'هندسة DevOps والسحابة',
    description: 'Master Docker, Kubernetes, CI/CD pipelines, AWS, and infrastructure-as-code with Terraform.',
    descriptionAr: 'أتقن Docker وKubernetes وخطوط CI/CD وAWS والبنية التحتية ككود باستخدام Terraform.',
    instructorName: 'Arjun Patel', instructorNameAr: 'أرجون باتيل', instructorAvatar: 'AP', level: 'Advanced', category: 'DevOps', categoryAr: 'ديف أوبس',
    duration: '14 weeks', durationAr: '14 أسبوعا', price: 4999, currency: 'INR', rating: 4.6, enrolledCount: 3800,
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&q=80',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins'], certificateOffered: true,
    skillsAr: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins'],
  },
];

export interface CourseFilter {
  search: string;
  level: string;
  category: string;
  priceType: string;
}

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private courses = signal<Course[]>(MOCK_COURSES);

  getAll(): Course[] { return this.courses(); }

  getFiltered(filter: CourseFilter): Course[] {
    return this.courses().filter(c => {
      if (filter.search) {
        const query = filter.search.toLowerCase();
        const haystack = [
          c.title,
          c.titleAr,
          c.description,
          c.descriptionAr,
          c.category,
          c.categoryAr,
          c.instructorName,
          c.instructorNameAr,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(query)) return false;
      }
      if (filter.level && c.level !== filter.level) return false;
      if (filter.category && c.category !== filter.category) return false;
      if (filter.priceType === 'free' && c.price !== 0) return false;
      if (filter.priceType === 'paid' && c.price === 0) return false;
      return true;
    });
  }

  getById(id: string): Course | undefined {
    return this.courses().find(c => c.id === id);
  }

  getCategories(): string[] {
    return [...new Set(this.courses().map(c => c.category))];
  }
}
