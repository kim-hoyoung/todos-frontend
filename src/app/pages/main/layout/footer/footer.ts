import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../../../api/services/auth.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  constructor(private router: Router, private authApi: Auth) {}
  logout() {
    const logout = confirm('로그아웃 하시겠습니까?');

    if (!logout) return;

    localStorage.removeItem('token');
    this.router.navigate(['']);
    alert('로그아웃 되었습니다.');
  }

  async deleteAccount() {
    const deleteAccount = confirm('정말 탈퇴하시겠습니까?');
    if (!deleteAccount) return;

    await firstValueFrom(this.authApi.deleteAccount());

    localStorage.removeItem('token');
    this.router.navigate(['']);
    alert('탈퇴가 완료되었습니다.');
  }
}
