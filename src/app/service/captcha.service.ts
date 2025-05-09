import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Captcha } from '../model/captcha.model';
import { Observable, pipe, publishReplay, refCount, share } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  private http: HttpClient = inject(HttpClient);
  private apiURL = environment.apiURL + "/api/Captcha";  
  
  constructor() { }

  getCaptcha(): Observable<Captcha>{
    return this.http.get<Captcha>(this.apiURL);
  }

  postCaptcha(captcha: Captcha, send = false){
    return this.http.post<Response>(this.apiURL + '?check=' + send, captcha, {observe: 'response'});
  }

}
