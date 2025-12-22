import { Component } from '@angular/core';
import { TodoCreatePanel } from './todo-create-panel/todo-create-panel';
import { FormsModule } from '@angular/forms';
import { TodoStore } from '../../../store/todo.store';
import { TodoDetailPanel } from './todo-detail-panel/todo-detail-panel';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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

  constructor(public todoStore: TodoStore, private route: ActivatedRoute) {}

  async ngOnInit() {
    // 투두 목록 불러오기.
    await this.todoStore.loadTodos();

    this.route.queryParamMap.subscribe(async (map) => {
      const todoId = map.get('todoId');
      if (!todoId) {
        this.todoStore.selectedTodo.set(null);
        return;
      }
      try {
        this.todoStore.selectTodoById(todoId);
      } catch (e) {
        alert('조회에 실패했습니다.');
      }
    });
  }
  // 투두 추가하기
  async add() {
    try {
      await this.todoStore.addTodo(this.newText);
      this.newText = '';
    } catch (e: any) {
      if (e?.message === 'EMPTY_TITLE') {
        alert('할 일을 작성해 주세요.');
        return;
      }
      alert('추가에 실패했습니다.');
    }
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
  // 투두 수정 이동
  onClickTodo(todo: any) {
    const current = this.todoStore.selectedTodo();
    if (this.isEditMode && current?.id !== todo.id) {
      const isMove = confirm('수정 중인 내용이 있어요. 이동하면 수정내용이 사라져요. 이동할까요?');
      if (!isMove) return;

      this.cancelEdit();
    }
    this.todoStore.selectTodo(todo);
  }
  // 투두 수정 저장
  async saveEdit() {
    const todo = this.todoStore.selectedTodo();
    const save = confirm('변경사항을 저장하시겠습니까?');
    if (!save) return;
    if (!todo) return;
    if (!this.editTitle.trim()) return;

    try {
      await this.todoStore.updateTodo(todo.id, {
        title: this.editTitle.trim(),
        priority: this.editPriority,
        content: this.editContent.trim(),
      });
      this.isEditMode = false;
      alert('수정이 완료되었습니다.');
    } catch (e) {
      alert('수정에 실패했습니다.');
    }
  }
  // 투두 삭제
  async deleteSelected() {
    const todo = this.todoStore.selectedTodo();
    if (!todo) return;

    const deleteItem = confirm('정말 삭제하시겠습니까?');
    if (!deleteItem) return;

    try {
      await this.todoStore.deleteTodo(todo.id);
      alert('일정이 삭제되었습니다.');
    } catch (e) {
      alert('삭제에 실패했습니다');
    }
  }
}
