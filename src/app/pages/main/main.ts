import { Component } from '@angular/core';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { TodoPage } from './todo/todo-page';

@Component({
  selector: 'app-main',
  imports: [Header, TodoPage, Footer],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {}
