import { Component, signal } from '@angular/core';
import { email, Field, form, minLength, pattern, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Auth } from '../../api/services/auth.service';
import { firstValueFrom } from 'rxjs';

interface SignupData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [Field],
  templateUrl: './signup.html',
  styleUrl: '../login/login.css',
})
export class Signup {
  constructor(private router: Router, private authApi: Auth) {}

  signupModel = signal<SignupData>({
    email: '',
    password: '',
  });

  serverError = signal<string>('');

  signupForm = form(this.signupModel, (schemaPath) => {
    required(schemaPath.email, { message: '이메일을 입력해 주세요.' });
    email(schemaPath.email);
    pattern(schemaPath.email, /.+@.+\..+/, { message: '이메일은 @와 .을 포함해야 합니다.' });

    // 비밀번호
    required(schemaPath.password, { message: '비밀번호를 입력해 주세요' });
    minLength(schemaPath.password, 8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' });
  });

  // 회원가입 요청
  async onSubmit(event: Event) {
    event.preventDefault();
    this.serverError.set('');

    if (this.signupForm().invalid()) {
      return;
    }

    const credentials = this.signupModel();
    console.log('Logging in with:', credentials);

    try {
      const res = await firstValueFrom(this.authApi.signup(credentials));
      alert(res.message);

      localStorage.setItem('token', res.token);

      this.router.navigate(['/main']);
    } catch (e: any) {
      const status = e?.status ?? e?.error?.status;

      if (status === 409) {
        alert('이미 가입된 계정입니다.');
        return;
      }

      this.serverError.set('회원가입에 실패했습니다.');
      console.error(e);
    }
  }

  goLogin() {
    this.router.navigate(['']);
  }
}
