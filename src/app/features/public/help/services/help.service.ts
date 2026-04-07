import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FAQ, FAQCategory, SupportTicket } from '../../../../models';

type FaqKeyItem = {
  id: string;
  category: FAQCategory;
  questionKey: string;
  answerKey: string;
};

const FAQ_ITEMS: FaqKeyItem[] = [
  { id: '1', category: 'Candidates', questionKey: 'HELP.FAQ.CANDIDATES.CREATE_PROFILE.Q', answerKey: 'HELP.FAQ.CANDIDATES.CREATE_PROFILE.A' },
  { id: '2', category: 'Candidates', questionKey: 'HELP.FAQ.CANDIDATES.MULTIPLE_APPLICATIONS.Q', answerKey: 'HELP.FAQ.CANDIDATES.MULTIPLE_APPLICATIONS.A' },
  { id: '3', category: 'Candidates', questionKey: 'HELP.FAQ.CANDIDATES.UPLOAD_RESUME.Q', answerKey: 'HELP.FAQ.CANDIDATES.UPLOAD_RESUME.A' },
  { id: '4', category: 'Candidates', questionKey: 'HELP.FAQ.CANDIDATES.PROFILE_VISIBILITY.Q', answerKey: 'HELP.FAQ.CANDIDATES.PROFILE_VISIBILITY.A' },
  { id: '5', category: 'Employers', questionKey: 'HELP.FAQ.EMPLOYERS.POST_JOB.Q', answerKey: 'HELP.FAQ.EMPLOYERS.POST_JOB.A' },
  { id: '6', category: 'Employers', questionKey: 'HELP.FAQ.EMPLOYERS.FREE_JOBS.Q', answerKey: 'HELP.FAQ.EMPLOYERS.FREE_JOBS.A' },
  { id: '7', category: 'Employers', questionKey: 'HELP.FAQ.EMPLOYERS.EDIT_JOB.Q', answerKey: 'HELP.FAQ.EMPLOYERS.EDIT_JOB.A' },
  { id: '8', category: 'General', questionKey: 'HELP.FAQ.GENERAL.FREE_TO_USE.Q', answerKey: 'HELP.FAQ.GENERAL.FREE_TO_USE.A' },
  { id: '9', category: 'General', questionKey: 'HELP.FAQ.GENERAL.RESET_PASSWORD.Q', answerKey: 'HELP.FAQ.GENERAL.RESET_PASSWORD.A' },
  { id: '10', category: 'General', questionKey: 'HELP.FAQ.GENERAL.AVAILABILITY.Q', answerKey: 'HELP.FAQ.GENERAL.AVAILABILITY.A' },
  { id: '11', category: 'Billing', questionKey: 'HELP.FAQ.BILLING.PAYMENT_METHODS.Q', answerKey: 'HELP.FAQ.BILLING.PAYMENT_METHODS.A' },
  { id: '12', category: 'Billing', questionKey: 'HELP.FAQ.BILLING.CANCEL_SUBSCRIPTION.Q', answerKey: 'HELP.FAQ.BILLING.CANCEL_SUBSCRIPTION.A' },
];

@Injectable({ providedIn: 'root' })
export class HelpService {
  private readonly translate = inject(TranslateService);

  getFAQs(category?: FAQCategory): FAQ[] {
    const items = category ? FAQ_ITEMS.filter(f => f.category === category) : FAQ_ITEMS;
    return items.map(item => this.toFaq(item));
  }

  searchFAQs(query: string): FAQ[] {
    const q = query.toLowerCase().trim();
    const faqs = this.getFAQs();
    if (!q) return faqs;
    return faqs.filter(f =>
      f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
  }

  submitTicket(ticket: SupportTicket): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 800));
  }

  private toFaq(item: FaqKeyItem): FAQ {
    return {
      id: item.id,
      category: item.category,
      question: this.translate.instant(item.questionKey),
      answer: this.translate.instant(item.answerKey),
    };
  }
}
