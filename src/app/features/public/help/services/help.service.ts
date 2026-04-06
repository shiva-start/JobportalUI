import { Injectable, signal } from '@angular/core';
import { FAQ, FAQCategory, SupportTicket } from '../../../../models';

const MOCK_FAQS: FAQ[] = [
  { id: '1', category: 'Candidates', question: 'How do I create a candidate profile?', answer: 'Click "Get Started" and register with your email. Once verified, navigate to your profile page to fill in your experience, skills, and education details.' },
  { id: '2', category: 'Candidates', question: 'Can I apply to multiple jobs at once?', answer: 'Yes. Browse jobs and click "Apply" on each listing. You can track all your applications from the Applications section in your dashboard.' },
  { id: '3', category: 'Candidates', question: 'How do I upload my resume?', answer: 'Go to your Profile page and scroll to the Resume section. Click "Upload Resume" and select a PDF file up to 5MB.' },
  { id: '4', category: 'Candidates', question: 'Will employers see my profile before I apply?', answer: 'Only if your profile visibility is set to Public. You can toggle this in Settings under Privacy.' },
  { id: '5', category: 'Employers', question: 'How do I post a job listing?', answer: 'Log in as an employer, navigate to "Post Job" from your dashboard, fill in the job details, and submit. Your listing will go live after a quick review.' },
  { id: '6', category: 'Employers', question: 'How many jobs can I post for free?', answer: 'The free plan allows up to 3 active job listings. Upgrade to a paid plan to post unlimited listings and access premium features.' },
  { id: '7', category: 'Employers', question: 'Can I edit a job post after publishing?', answer: 'Yes. Go to Manage Jobs in your dashboard, find the listing, and click Edit. Changes are reflected immediately.' },
  { id: '8', category: 'General', question: 'Is JobPortal free to use?', answer: 'JobPortal is free for candidates. Employers can post up to 3 jobs for free. Premium plans are available for advanced hiring features.' },
  { id: '9', category: 'General', question: 'How do I reset my password?', answer: 'Click "Sign in" then "Forgot password". Enter your registered email and we will send you a reset link within 5 minutes.' },
  { id: '10', category: 'General', question: 'Which countries is JobPortal available in?', answer: 'JobPortal is available worldwide. Remote jobs are accessible globally, while on-site listings are filtered by location.' },
  { id: '11', category: 'Billing', question: 'What payment methods are accepted?', answer: 'We accept all major credit/debit cards (Visa, Mastercard, Amex) and UPI payments.' },
  { id: '12', category: 'Billing', question: 'Can I cancel my subscription at any time?', answer: 'Yes. You can cancel anytime from your billing settings. Your plan remains active until the end of the current billing cycle.' },
];

@Injectable({ providedIn: 'root' })
export class HelpService {
  private faqs = signal<FAQ[]>(MOCK_FAQS);

  getFAQs(category?: FAQCategory): FAQ[] {
    if (!category) return this.faqs();
    return this.faqs().filter(f => f.category === category);
  }

  searchFAQs(query: string): FAQ[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.faqs();
    return this.faqs().filter(f =>
      f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
  }

  submitTicket(ticket: SupportTicket): Promise<void> {
    // In production this would call a real API endpoint
    return new Promise(resolve => setTimeout(resolve, 800));
  }
}
