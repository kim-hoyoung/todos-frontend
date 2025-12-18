import { Component } from '@angular/core';
import { TodoStore } from '../../../../store/todo.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-details',
  imports: [CommonModule],
  templateUrl: './todo-details.html',
  styleUrl: './todo-details.css',
})
export class TodoDetails {
  constructor(public todoStore: TodoStore) {}
}
