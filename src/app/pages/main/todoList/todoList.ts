import { Component } from '@angular/core';
import { TodoContents } from './todo-contents/todo-contents';
import { FormsModule } from '@angular/forms';
import { TodoStore } from '../../../store/todo.store';
import { TodoDetails } from './todo-details/todo-details';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-List',
  imports: [TodoContents, FormsModule, TodoDetails, CommonModule],
  templateUrl: './todoList.html',
  styleUrl: './todoList.css',
})
export class TodoList {
  newText: string = '';

  constructor(public todoStore: TodoStore) {}

  add() {
    this.todoStore.addTodo(this.newText);
    this.newText = '';
  }
}
