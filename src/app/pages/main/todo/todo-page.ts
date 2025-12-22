import { Component } from '@angular/core';
import { TodoCreatePanel } from './todo-create-panel/todo-create-panel';
import { FormsModule } from '@angular/forms';
import { TodoStore } from '../../../store/todo.store';
import { TodoDetailPanel } from './todo-detail-panel/todo-detail-panel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-page',
  imports: [TodoCreatePanel, FormsModule, TodoDetailPanel, CommonModule],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.css',
})
export class TodoPage {
  newText: string = '';
  searchText: string = '';

  isEditMode = false;

  editTitle = '';
  editPriority: 'urgent' | 'normal' | 'low' = 'normal';
  editContent = '';

  constructor(public todoStore: TodoStore) {}

  async ngOnInit() {
    await this.todoStore.loadTodos();
  }

  // 투두 추가하기
  add() {
    this.todoStore.addTodo(this.newText);
    this.newText = '';
  }
  // 투두 수정
  startEdit() {
    const todo = this.todoStore.selectedTodo();
    if (!todo) return;

    this.isEditMode = true;
    this.editTitle = todo.title ?? '';
    this.editPriority = (todo.priority ?? 'normal') as any;
    this.editContent = todo.content ?? '';
  }
  // 투두 수정 취소
  cancelEdit() {
    this.isEditMode = false;
  }
  // 투두 수정 저장
  saveEdit() {
    const todo = this.todoStore.selectedTodo();
    const save = confirm('변경사항을 저장하시겠습니까?');
    if (!save) return;
    if (!todo) return;
    if (!this.editTitle.trim()) return;

    this.todoStore.updateTodo(todo.id, {
      title: this.editTitle.trim(),
      priority: this.editPriority,
      content: this.editContent.trim(),
    });
    this.isEditMode = false;
  }
  // 투두 삭제
  deleteSelected() {
    const todo = this.todoStore.selectedTodo();
    if (!todo) return;

    this.todoStore.deleteTodo(todo.id);
    this.todoStore.selectedTodo;
  }
}
