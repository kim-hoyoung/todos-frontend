import { Component, signal } from '@angular/core';
import { Todo } from '../../../../models/todo';
import { CommonModule } from '@angular/common';
import { TodoStore } from '../../../../store/todo.store';

@Component({
  selector: 'app-todo-create-panel',
  imports: [CommonModule],
  templateUrl: './todo-create-panel.html',
  styleUrl: './todo-create-panel.css',
})
export class TodoCreatePanel {
  todoList = signal<Todo[]>([]);

  constructor(public todoStore: TodoStore) {}
}
