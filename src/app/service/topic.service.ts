import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Topic } from '../model/topic.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TopicService {  

  private http: HttpClient = inject(HttpClient);
  private apiURL = environment.apiURL + '/api/Topic';  
  private topics: Topic[] = [
    {topic: 'Техподдержка'},
    {topic: 'Продажи'},
    {topic: 'Другое'},
    {topic: 'Еще один пункт'},
  ]  

  constructor() { }
  getTopics(): Observable<Topic[]>{
    return this.http.get<Topic[]>(this.apiURL).pipe(catchError(err => of(this.topics)));
  }
  
}
