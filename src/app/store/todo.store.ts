import { Injectable, signal } from '@angular/core';
import { GetTodosQuery, Todo, TodoPriority, TodoUpsertPayload } from '../models/todo';
import { TodoService } from '../api/services/todo.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodoStore {
  todoList = signal<Todo[]>([]);

  selectedTodo = signal<Todo | null>(null);

  query = signal<GetTodosQuery>({
    sort: 'createdAt',
    order: 'desc',
  });

  // 날짜 선택
  selectedDate = signal<Date>(new Date());

  constructor(private todoApi: TodoService) {}

  // 공통 에러 처리 래퍼
  private async runApi<T>(task: Promise<T>) {
    try {
      return await task;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  // 투두 불러오기
  async loadTodos(override?: GetTodosQuery) {
    const nextQuery = { ...this.query(), ...(override ?? {}) };
    this.query.set(nextQuery);

    const res = await this.runApi(firstValueFrom(this.todoApi.getTodos(nextQuery)));
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

  // 투두 단건 조회
  async selectTodoById(id: string) {
    const res = await this.runApi(firstValueFrom(this.todoApi.getTodoById(id)));
    const todo = res.data ?? null;
    this.selectedTodo.set(todo);
  }

  // 투두 할 일 추가 -------------------
  async addTodo(title: string) {
    const next = (title ?? '').trim();
    if (!next) {
      throw new Error('EMPTY_TITLE');
    }
    const payload: TodoUpsertPayload = {
      title: title.trim(),
      content: '우선순위 및 해야할 일에 대한 상세 내용을 입력해 주세요.',
      priority: 'normal',
    };

    const res = await this.runApi(firstValueFrom(this.todoApi.createTodo(payload)));
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
    const res = await this.runApi(firstValueFrom(this.todoApi.toggleComplete(id)));
    const updated = res.data;

    this.todoList.update((list) => list.map((t) => (t.id === id ? updated : t)));
    const current = this.selectedTodo();
    if (current?.id === id) this.selectedTodo.set(updated);
  }
  // 투두 일정 삭제 -----------------------------
  async deleteTodo(id: string) {
    try {
      await this.runApi(firstValueFrom(this.todoApi.deleteTodo(id)));

      this.todoList.update((list) => list.filter((t) => t.id !== id));
      const selected = this.selectedTodo();

      if (selected?.id === id) this.selectedTodo.set(null);
    } catch (e) {
      console.error(e);
      throw e;
    }
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
  incompleteTodosByDate() {
    return this.todosBySelectedDate().filter((t) => !t.isCompleted);
  }
  completedTodosByDate() {
    return this.todosBySelectedDate().filter((t) => t.isCompleted);
  }
  setSelectedDate(date: Date) {
    this.selectedDate.set(date);
  }

  // 검색
  async setSearch(keyword: string) {
    const next = (keyword ?? '').trim();
    this.query.set({ ...this.query(), keyword: next || undefined });
    await this.loadTodos({ keyword: next || undefined });
  }

  // 정렬방향
  async toggleSortMode() {
    const { sort, order } = this.query();

    if (sort === 'createdAt' && order === 'desc') {
      this.query.set({ ...this.query(), sort: 'createdAt', order: 'asc' });
      await this.loadTodos({ sort: 'createdAt', order: 'asc' });
      return;
    }
    if (sort === 'createdAt' && order === 'asc') {
      this.query.set({ ...this.query(), sort: 'updatedAt', order: 'desc' });
      await this.loadTodos({ sort: 'updatedAt', order: 'desc' });
      return;
    }

    this.query.set({ ...this.query(), sort: 'createdAt', order: 'desc' });
    await this.loadTodos({ sort: 'createdAt', order: 'desc' });
  }

  getSortLabel() {
    const { sort, order } = this.query();

    if (sort === 'createdAt' && order === 'desc') return '최신순';
    if (sort === 'createdAt' && order === 'asc') return '오래된순';
    if (sort === 'updatedAt') return '업데이트순';

    return '정렬';
  }

  // 정렬 기준
  async setSortField(sort: GetTodosQuery['sort']) {
    const q = this.query();
    this.query.set({ ...q, sort });

    await this.loadTodos({ sort });
  }
  // 우선순위
  async setPriorityFilter(priority?: TodoPriority) {
    const q = this.query();
    const next = priority ?? undefined;
    this.query.set({ ...q, priorityFilter: next });
    await this.loadTodos({ priorityFilter: next });
  }
}
