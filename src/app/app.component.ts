import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AppMaskInputDirective } from './app.mask-input.directive';
import { TopicService } from './service/topic.service';
import { AsyncPipe } from '@angular/common';
import { FeedbackService } from './service/feedback.service';
import { Feedback } from './model/feedback.model';
import { catchError, map, Observable, of } from 'rxjs';
import { Message } from './model/message.model';
import { CaptchaService } from './service/captcha.service';
import { Captcha } from './model/captcha.model';


@Component({
  
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule
    , AppMaskInputDirective, AsyncPipe, 
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'WebUI';  
  switchingForms = 'feedbackForm';
  constructor(){}

feedbackForm = new FormGroup({
      nameEventControl: new FormControl('', Validators.required),
      emailEventControl: new FormControl('', [Validators.required, Validators.email]),
      phoneEventControl: new FormControl('', [Validators.required, Validators.pattern('^\\+\\d\\(\\d{3}\\)\\d{3}-\\d{2}-\\d{2}$')]),
      topicEventControl: new FormControl('', Validators.required),
      messageEventControl: new FormControl('', Validators.required),
      captchaEventControl: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.minLength(5)],
        asyncValidators: [this.caprchaValidator()]
      }),
      captchaIdEventControl: new FormControl(''),      
    })  
   
  topicService = inject(TopicService);
  captchaService = inject(CaptchaService);
  feedbackService = inject(FeedbackService);
  captcha$!: Observable<Captcha>;
  message?: Message;
  topics$ = this.topicService.getTopics();  
  feedback?:Feedback;  
  captchaCheck: Captcha = {id:'', captchaImage:''};
  
  ngOnInit(){
    this.captcha$ = this.captchaService.getCaptcha();
  }
    
  submitFeedbackForm(){
    this.feedback = {
      name: this.feedbackForm.value.nameEventControl as string,
      email: this.feedbackForm.value.emailEventControl as string,
      phone: this.feedbackForm.value.phoneEventControl as string,
      topic: this.feedbackForm.value.topicEventControl as string,
      message: this.feedbackForm.value.messageEventControl as string,
      captcha: this.feedbackForm.value.captchaEventControl as string,
    }

    if(this.feedbackForm.invalid) {
      alert('Ошибочка :( \nПопробуйте заполнить поля формы корректно.');
      this.captcha$ = this.captchaService.getCaptcha();
      this.feedbackForm.controls.captchaEventControl.setValue('');
      return;
    }
    
    this.feedbackService.postFeedback(this.feedback).subscribe({
    next:(data: Message) => {
      this.message = data;
      this.feedbackForm.reset();
      this.switchingForms = 'messageForm'      
    },
    error: error => {
      alert('Что-то пошло не так :( \nПопробуйте отправить заново.');
      this.captcha$ = this.captchaService.getCaptcha();
      }      
    });
    
  }

  submitMessageForm(){    
    this.switchingForms = 'feedbackForm';
  }
  
  caprchaValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const input = <HTMLInputElement>document.getElementById('captchaId');
      if (input == null) return of(null);
      this.captchaCheck.id = input.value;
      this.captchaCheck.captchaImage = control.value;
      return this.captchaService.postCaptcha(this.captchaCheck)
        .pipe(
          map((result) => result.status == 400 ? {statusCheck: { v: control.value}} : null),
          catchError(er => of(er))
        )
    }
  }

}
