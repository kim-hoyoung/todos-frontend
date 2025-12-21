import { Component, signal } from '@angular/core';
import { email, Field, form, minLength, pattern, required, validate } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Auth } from '../../api/services/auth.service';
import { firstValueFrom } from 'rxjs';

interface SignupData {
  email: string;
  password: string;
  passwordConfirm: string;
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
    passwordConfirm: '',
  });

  serverError = signal<string>('');

  // 이메일 중복 체크
  isEmailDuplicate = signal(false);
  emailCheckMessage = signal<string>('');

  signupForm = form(this.signupModel, (schemaPath) => {
    required(schemaPath.email, { message: '이메일을 입력해 주세요.' });
    email(schemaPath.email);
    pattern(schemaPath.email, /.+@.+\..+/, { message: '이메일은 @와 .을 포함해야 합니다.' });

    // 이메일 중복 체크
    validate(schemaPath.email, ({ value }) => {
      if (this.isEmailDuplicate()) {
        return {
          kind: 'emailDuplicate',
          message: '중복된 계정입니다. 다른 이메일을 사용해 주세요.',
        };
      }
      return null;
    });

    // 비밀번호
    required(schemaPath.password, { message: '비밀번호를 입력해 주세요' });
    minLength(schemaPath.password, 8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' });

    // 비밀번호 확인
    required(schemaPath.passwordConfirm, { message: '비밀번호를 한 번 더 입력해 주세요.' });
    validate(schemaPath.passwordConfirm, ({ value, valueOf }) => {
      const confirm = value();
      const password = valueOf(schemaPath.password);

      if (!confirm) return null;

      if (confirm !== password) {
        return { kind: 'paswrdMismatch', message: '비밀번호가 다릅니다.' };
      }
      return null;
    });
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
      const { email, password } = credentials;
      const res = await firstValueFrom(this.authApi.signup({ email, password }));

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
