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
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Angular 공부하기2',
      content: 'signal 개념 이해',
      priority: 'normal',
      isCompleted: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  // 토글
  toggleTodo(id: string) {
    this.todoList.update((list) =>
      list.map((todo) => (todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo))
    );
  }
  addTodo(newText: string) {
    if (!newText.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: newText,
      content: '',
      priority: 'normal',
      isCompleted: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.todoList.update((list) => [...list, newTodo]);
  }
}
