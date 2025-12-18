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

  isEditMode = false;

  editTitle = '';
  editPriority: 'urgent' | 'normal' | 'low' = 'normal';
  editContent = '';

  constructor(public todoStore: TodoStore) {}

  add() {
    this.todoStore.addTodo(this.newText);
    this.newText = '';
  }

  startEdit() {
    const todo = this.todoStore.selectedTodo();
    if (!todo) return;

    this.isEditMode = true;
    this.editTitle = todo.title ?? '';
    this.editPriority = (todo.priority ?? 'normal') as any;
    this.editContent = todo.content ?? '';
  }

  cancelEdit() {
    this.isEditMode = false;
  }

  saveEdit() {
    const todo = this.todoStore.selectedTodo();
    if (!todo) return;

    if (!this.editTitle.trim()) return;

    this.todoStore.updateTodo(todo.id, {
      title: this.editTitle.trim(),
      priority: this.editPriority,
      content: this.editContent.trim(),
    });
    this.isEditMode = false;
  }

  deleteSelected() {
    const todo = this.todoStore.selectedTodo();
    if (!todo) return;

    this.todoStore.deleteTodo(todo.id);
    this.todoStore.selectedTodo.set(null);
  }
}
