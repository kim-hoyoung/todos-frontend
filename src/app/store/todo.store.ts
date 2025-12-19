import { Injectable, signal } from '@angular/core';
import { GetTodosQuery, Todo, TodoPriority, TodoUpsertPayload } from '../models/todo';
import { TodoService } from '../api/services/todo.service';
import { first, firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodoStore {
  // 임시데이터
  todoList = signal<Todo[]>([]);

  selectedTodo = signal<Todo | null>(null);

  query = signal<GetTodosQuery>({
    sort: 'createdAt',
    order: 'desc',
  });

  // 날짜 선택
  selectedDate = signal<Date>(new Date());

  constructor(private todoApi: TodoService) {}

  async loadTodos(override?: GetTodosQuery) {
    const nextQuery = { ...this.query(), ...(override ?? {}) };
    this.query.set(nextQuery);

    const res = await firstValueFrom(this.todoApi.getTodos(nextQuery));
    const list = res.data ?? [];

    this.todoList.set(list);

    const current = this.selectedTodo();
    if (current) {
      const refreshed = list.find((t) => t.id === current.id) ?? null;
      this.selectedTodo.set(refreshed);
    }
  }

  // 투두 선택
  selectTodo(todo: Todo) {
    this.selectedTodo.set(todo);
  }

  // 투두 할 일 추가 -------------------
  async addTodo(title: string) {
    if (!title.trim()) {
      alert('할 일을 작성해 주세요');
      return;
    }
    const payload: TodoUpsertPayload = {
      title: title.trim(),
      content: '우선순위 및 해야할 일에 대한 상세 내용을 입력해 주세요.',
      priority: 'normal',
    };

    const res = await firstValueFrom(this.todoApi.createTodo(payload));
    const created = res.data;

    // 생성날짜 내림차순으로 정렬.
    this.todoList.update((list) => [created, ...list]);
    this.selectedTodo.set(created);
  }

  // 투두 할 일 수정하기 -------------------
  async updateTodo(id: string, patch: { title: string; priority: TodoPriority; content: string }) {
    const payload: TodoUpsertPayload = {
      title: patch.title,
      content: patch.content,
      priority: patch.priority,
    };

    const res = await firstValueFrom(this.todoApi.updateTodo(id, payload));
    const updated = res.data;

    this.todoList.update((list) => list.map((t) => (t.id === id ? updated : t)));
    const current = this.selectedTodo();
    if (current?.id === id) this.selectedTodo.set(updated);
  }

  // 투두 할 일 완료 토글 --------------------
  async toggleTodo(id: string) {
    const res = await firstValueFrom(this.todoApi.toggleComplete(id));
    const updated = res.data;

    this.todoList.update((list) => list.map((t) => (t.id === id ? updated : t)));
    const current = this.selectedTodo();
    if (current?.id === id) this.selectedTodo.set(updated);
  }
  // 투두 일정 삭제 -----------------------------
  async deleteTodo(id: string) {
    const deleteItem = confirm('정말 삭제하시겠습니까?');
    if (!deleteItem) return;

    await firstValueFrom(this.todoApi.deleteTodo(id));

    this.todoList.update((list) => list.filter((t) => t.id !== id));
    const selected = this.selectedTodo();

    if (selected?.id === id) this.selectedTodo.set(null);

    alert('일정이 삭제되었습니다.');
  }
  // 날짜별 투두 일정 조회
  todosBySelectedDate() {
    const day = this.selectedDate();

    return this.todoList().filter((t) => this.isSameDay(new Date(t.createdAt), day));
  }
  private isSameDay(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  // completedTodos() {
  //   return this.todoList().filter((t) => t.isCompleted);
  // }
  // activeTodos() {
  //   return this.todoList().filter((t) => !t.isCompleted);
  // }

  activeTodosByDate() {
    return this.todosBySelectedDate().filter((t) => !t.isCompleted);
  }
  completedTodosByDate() {
    return this.todosBySelectedDate().filter((t) => t.isCompleted);
  }

  setSelectedDate(date: Date) {
    this.selectedDate.set(date);
  }
}
