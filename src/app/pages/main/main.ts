import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Header } from './header/header';
import { Section } from './section/section';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-main',
  imports: [Header, Section, Footer],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['']);
    alert('로그아웃 되었습니다.');
  }
}
