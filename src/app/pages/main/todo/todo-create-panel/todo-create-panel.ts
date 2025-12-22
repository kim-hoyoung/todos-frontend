import { Component, signal } from '@angular/core';
import { Todo } from '../../../../models/todo';
import { CommonModule } from '@angular/common';
import { TodoStore } from '../../../../store/todo.store';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-todo-create-panel',
  imports: [CommonModule],
  templateUrl: './todo-create-panel.html',
  styleUrl: './todo-create-panel.css',
})
export class TodoCreatePanel {
  todoList = signal<Todo[]>([]);

  constructor(public todoStore: TodoStore, private router: Router, private route: ActivatedRoute) {}

  onClickTodo(todo: Todo) {
    this.todoStore.selectTodo(todo);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { todoId: todo.id },
      queryParamsHandling: 'merge',
    });
  }

  get incompleteCount(): number {
    return this.todoStore.incompleteTodosByDate().length;
  }
  get completedCount(): number {
    return this.todoStore.completedTodosByDate().length;
  }
}
