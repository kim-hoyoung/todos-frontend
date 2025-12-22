import { Component, EventEmitter, Output, signal } from '@angular/core';
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
  constructor(public todoStore: TodoStore, private router: Router, private route: ActivatedRoute) {}

  @Output() todoClick = new EventEmitter<Todo>();
  @Output() toggle = new EventEmitter<string>();

  onClickTodo(todo: Todo) {
    this.todoClick.emit(todo);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { todoId: todo.id },
      queryParamsHandling: 'merge',
    });
  }

  onToggle(todoId: string, event: Event) {
    event.stopPropagation();
    this.toggle.emit(todoId);
  }

  get incompleteCount(): number {
    return this.todoStore.incompleteTodosByDate().length;
  }
  get completedCount(): number {
    return this.todoStore.completedTodosByDate().length;
  }
}
