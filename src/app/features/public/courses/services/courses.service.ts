import { Injectable, signal } from '@angular/core';
import { Course } from '../../../../models';

const MOCK_COURSES: Course[] = [
  {
    id: 'c-1', title: 'Full-Stack Web Development Bootcamp', description: 'Master HTML, CSS, JavaScript, Angular, Node.js and PostgreSQL to become a job-ready full-stack developer.',
    instructorName: 'Rahul Mehta', instructorAvatar: 'RM', level: 'Beginner', category: 'Web Development',
    duration: '12 weeks', price: 0, currency: 'INR', rating: 4.8, enrolledCount: 12400,
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
    skills: ['HTML/CSS', 'JavaScript', 'Angular', 'Node.js', 'PostgreSQL'], certificateOffered: true,
  },
  {
    id: 'c-2', title: 'Python for Data Science & Machine Learning', description: 'Learn Python, Pandas, NumPy, Matplotlib, and Scikit-learn through real-world projects.',
    instructorName: 'Priya Sharma', instructorAvatar: 'PS', level: 'Intermediate', category: 'Data Science',
    duration: '8 weeks', price: 2999, currency: 'INR', rating: 4.7, enrolledCount: 8900,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80',
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib'], certificateOffered: true,
  },
  {
    id: 'c-3', title: 'UI/UX Design Fundamentals', description: 'Learn user-centered design principles, Figma, prototyping, and how to conduct user research.',
    instructorName: 'Anjali Nair', instructorAvatar: 'AN', level: 'Beginner', category: 'Design',
    duration: '6 weeks', price: 1999, currency: 'INR', rating: 4.9, enrolledCount: 6700,
    thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80',
    skills: ['Figma', 'Wireframing', 'Prototyping', 'User Research'], certificateOffered: true,
  },
  {
    id: 'c-4', title: 'Advanced React & Next.js', description: 'Build production-grade web applications with React 19, Next.js 15, TypeScript and modern tooling.',
    instructorName: 'Vikram Singh', instructorAvatar: 'VS', level: 'Advanced', category: 'Web Development',
    duration: '10 weeks', price: 3999, currency: 'INR', rating: 4.8, enrolledCount: 5200,
    thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600&q=80',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'], certificateOffered: true,
  },
  {
    id: 'c-5', title: 'Digital Marketing Mastery', description: 'Learn SEO, SEM, social media marketing, email marketing, and analytics from scratch.',
    instructorName: 'Kavya Reddy', instructorAvatar: 'KR', level: 'Beginner', category: 'Marketing',
    duration: 'Self-paced', price: 0, currency: 'INR', rating: 4.5, enrolledCount: 15000,
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&q=80',
    skills: ['SEO', 'Google Ads', 'Social Media', 'Email Marketing', 'Analytics'], certificateOffered: false,
  },
  {
    id: 'c-6', title: 'DevOps & Cloud Engineering', description: 'Master Docker, Kubernetes, CI/CD pipelines, AWS, and infrastructure-as-code with Terraform.',
    instructorName: 'Arjun Patel', instructorAvatar: 'AP', level: 'Advanced', category: 'DevOps',
    duration: '14 weeks', price: 4999, currency: 'INR', rating: 4.6, enrolledCount: 3800,
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&q=80',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins'], certificateOffered: true,
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
      if (filter.search && !c.title.toLowerCase().includes(filter.search.toLowerCase()) && !c.category.toLowerCase().includes(filter.search.toLowerCase())) return false;
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
