import { Component } from '@angular/core';
import { TodoContents } from './todo-contents/todo-contents';
import { FormsModule } from '@angular/forms';
import { TodoStore } from '../../../store/todo.store';

@Component({
  selector: 'app-todo-List',
  imports: [TodoContents, FormsModule],
  templateUrl: './todoList.html',
  styleUrl: './todoList.css',
})
export class TodoList {
  newText: string = '';

  constructor(private todoStore: TodoStore) {}

  add() {
    this.todoStore.addTodo(this.newText);
    this.newText = '';
  }
}
