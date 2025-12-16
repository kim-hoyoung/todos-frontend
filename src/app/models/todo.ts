export type TodoPriority = 'urgent' | 'normal' | 'low';

export interface Todo {
  id: string;
  title: string;
  content: string;

  priority: TodoPriority;

  isCompleted: boolean;
  completedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface GetTodosQuery {
  sort?: 'createdAt' | 'updatedAt' | 'priority';
  order?: 'asc' | 'desc';
  priorityFilter?: TodoPriority;
  keyword?: string;
  countOnly?: boolean;
}

export interface ApiResponse<T> {
  data: T;
}

export type TodoUpsertPayload = Pick<Todo, 'title' | 'content' | 'priority'>;

export type CreateTodoRequest = TodoUpsertPayload;

export type UpdateTodoRequest = TodoUpsertPayload;
