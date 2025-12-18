import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  constructor(private router: Router) {}
  logout() {
    const logout = confirm('로그아웃 하시겠습니까?');

    if (!logout) return;

    localStorage.removeItem('token');
    this.router.navigate(['']);
    alert('로그아웃 되었습니다.');
  }
}
