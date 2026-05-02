import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { SupportTicket } from '../../../../models';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
}

export interface UpsertFaqRequest {
  question: string;
  answer: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class HelpService {
  private readonly api = inject(ApiService);

  getFAQs(): Observable<FaqItem[]> {
    return this.api.get<FaqItem[]>('faq');
  }

  getFAQById(id: string): Observable<FaqItem> {
    return this.api.get<FaqItem>(`faq/${id}`);
  }

  createFAQ(payload: UpsertFaqRequest): Observable<FaqItem> {
    return this.api.post<FaqItem, UpsertFaqRequest>('faq', payload);
  }

  updateFAQ(id: string, payload: UpsertFaqRequest): Observable<FaqItem> {
    return this.api.put<FaqItem, UpsertFaqRequest>(`faq/${id}`, payload);
  }

  deleteFAQ(id: string): Observable<void> {
    return this.api.delete<void>(`faq/${id}`);
  }

  submitTicket(_ticket: SupportTicket): Promise<void> {
    return Promise.resolve();
  }
}
