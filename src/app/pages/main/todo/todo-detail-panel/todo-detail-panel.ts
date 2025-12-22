import { Component } from '@angular/core';
import { TodoStore } from '../../../../store/todo.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-detail-panel',
  imports: [CommonModule],
  templateUrl: './todo-detail-panel.html',
  styleUrl: './todo-detail-panel.css',
})
export class TodoDetailPanel {
  constructor(public todoStore: TodoStore) {}
}
