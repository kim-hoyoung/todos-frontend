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
    if (!newText.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: newText,
      content: '해야할 일에 대한 상세 내용을 입력해 주세요.',
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

  deleteTodo() {}
}
