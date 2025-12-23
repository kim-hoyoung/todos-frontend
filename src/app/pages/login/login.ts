import { Component, signal } from '@angular/core';
import { email, Field, form, minLength, pattern, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Auth } from '../../api/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { AuthRequest } from '../../models/auth';

@Component({
  selector: 'app-login',
  imports: [Field],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private router: Router, private authApi: Auth) {}

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigate(['/main']);
    }
  }

  loginModel = signal<AuthRequest>({
    email: '',
    password: '',
  });

  serverError = signal<string>('');

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: '이메일을 입력해 주세요.' });
    email(schemaPath.email);
    pattern(schemaPath.email, /.+@.+\..+/, { message: '이메일은 @와 .을 포함해야 합니다.' });

    // 비밀번호
    required(schemaPath.password, { message: '비밀번호를 입력해 주세요' });
    minLength(schemaPath.password, 8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' });
  });

  // 로그인 및 로컬스토리지에 토큰 저장
  async onSubmit(event: Event) {
    event.preventDefault();
    this.serverError.set('');

    if (this.loginForm().invalid()) {
      return;
    }

    const credentials = this.loginModel();
    //console.log('Logging in with:', credentials);

    try {
      const res = await firstValueFrom(this.authApi.login(credentials));

      alert(res.message);

      localStorage.setItem('token', res.token);
      this.router.navigate(['/main']);
    } catch (e: any) {
      alert(e.message);
    }
  }

  goSignup() {
    this.router.navigate(['/signup']);
  }
}

//ngModule provider ( service 의 하는 역할이 무엇인지 )

// 생명주기 메소드 최소한 ngOninit ngOnChange ngAfterViewInit ngOndestory
// ngOninit 과 constructor 의 차이점
// subscribtion 열심히 -> signal 없이 subject 로 바꿔서 behaviorSubject, 어쓰 가드 , canActivate, Angular pipe (RxJS 아님)
// 의존성 @Injecter     //  directive  //ngContainer //

// 위의 대한 내용들에 대한 개념들에 대해 발표를 하되 글로써 설명이아닌 예시를거나 활용
// 생명주기 메소드에 대한 내용들에 대한 얘기를 하면 어떻게 다른지 어떤식으로 다름을 활용할 수 있는지, 공부
// 좋은 아이디어 있으면 ppt 반영시키고

// Angular 17.3 버전으로.

// 1월 2일 까지 이해하고 공부하기.
