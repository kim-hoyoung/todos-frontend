import { Component } from '@angular/core';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { TodoList } from './todoList/todoList';

@Component({
  selector: 'app-main',
  imports: [Header, TodoList, Footer],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {}
