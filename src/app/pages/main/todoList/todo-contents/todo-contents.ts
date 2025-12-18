import { Component, signal } from '@angular/core';
import { Todo } from '../../../../models/todo';
import { CommonModule } from '@angular/common';
import { TodoStore } from '../../../../store/todo.store';

@Component({
  selector: 'app-todo-contents',
  imports: [CommonModule],
  templateUrl: './todo-contents.html',
  styleUrl: './todo-contents.css',
})
export class TodoContents {
  todoList = signal<Todo[]>([]);

  constructor(public todoStore: TodoStore) {}
}
