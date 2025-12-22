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
