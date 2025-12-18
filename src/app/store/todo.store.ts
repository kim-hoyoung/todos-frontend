import { Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({ providedIn: 'root' })
export class TodoStore {
  // 임시데이터
  todoList = signal<Todo[]>([
    {
      id: '1',
      title: 'Angular 공부하기',
      content: 'signal 개념 이해',
      priority: 'normal',
      isCompleted: true,
      completedAt: '2027-01-20',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Angular 공부하기2',
      content: 'signal 개념 이해하는 방법과 앵귤러의 사용을 익혀보자',
      priority: 'urgent',
      isCompleted: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Angular 공부하기3',
      content: 'signal 개념 이해하는 방법과 앵귤러의 사용을 익혀보자',
      priority: 'urgent',
      isCompleted: false,
      completedAt: null,
      createdAt: '2025-12-17',
      updatedAt: '',
    },
  ]);

  selectedTodo = signal<Todo | null>(null);

  selectTodo(todo: Todo) {
    this.selectedTodo.set(todo);
  }

  // 토글
  toggleTodo(id: string) {
    this.todoList.update((list) =>
      list.map((todo) => (todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo))
    );
  }

  completedTodos() {
    return this.todoList().filter((t) => t.isCompleted);
  }
  activeTodos() {
    return this.todoList().filter((t) => !t.isCompleted);
  }

  // 할 일 추가
  addTodo(newText: string) {
    if (!newText.trim()) {
      alert('할 일을 작성해 주세요');
      return;
    }
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: newText,
      content: '우선순위 및 해야할 일에 대한 상세 내용을 입력해 주세요.',
      priority: 'normal',
      isCompleted: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.todoList.update((list) => [...list, newTodo]);
  }

  updateTodo(
    id: string,
    patch: { title: string; priority: 'normal' | 'urgent' | 'low'; content: string }
  ) {
    this.todoList.update((todos) =>
      todos.map((t) =>
        t.id === id
          ? {
              ...t,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );

    const current = this.selectedTodo();
    if (current?.id === id) {
      this.selectedTodo.set({ ...current, ...patch, updatedAt: new Date().toISOString() });
    }
  }

  deleteTodo(id: string) {
    const deleteItem = confirm('정말 삭제하시겠습니까?');

    if (!deleteItem) return;
    this.todoList.update((todos) => todos.filter((todo) => todo.id !== id));

    const selected = this.selectedTodo();
    if (selected?.id === id) {
      this.selectedTodo.set(null);
    }

    alert('일정이 삭제되었습니다.');
  }

  selectedDate = signal<Date>(new Date());

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
