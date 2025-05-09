import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Feedback } from '../model/feedback.model';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Message } from '../model/message.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private http: HttpClient = inject(HttpClient);
  private apiURL = environment.apiURL + '/api/FeedbackForm';
  
  constructor() { }

  postFeedback(feedback: Feedback | undefined): Observable<Message> {
    return this.http.post<Message>(this.apiURL, feedback);
  }
        
}
