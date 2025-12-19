import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, GetTodosQuery, Todo, TodoUpsertPayload } from '../../models/todo';
import { Observable } from 'rxjs';
import { HttpService } from './httpService';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private api: HttpService) {}

  getTodos(query?: GetTodosQuery): Observable<ApiResponse<Todo[]>> {
    let params = new HttpParams();

    if (query?.sort) params = params.set('sort', query.sort);
    if (query?.order) params = params.set('order', query.order);
    if (query?.priorityFilter) params = params.set('priorityFilter', query.priorityFilter);
    if (query?.keyword) params = params.set('keyword', query.keyword);
    if (query?.countOnly !== undefined) params = params.set('countOnly', String(query.countOnly));

    return this.api.get<ApiResponse<Todo[]>>('/todos', {
      params,
    });
  }
  // 2) 단건 조회 GET /todos/:id
  getTodoById(id: string): Observable<ApiResponse<Todo>> {
    return this.api.get<ApiResponse<Todo>>(`/todos/${id}`);
  }

  // 3) 생성 POST /todos
  createTodo(body: TodoUpsertPayload): Observable<ApiResponse<Todo>> {
    return this.api.post<ApiResponse<Todo>>(`/todos`, body);
  }

  // 4) 수정 PUT /todos/:id
  updateTodo(id: string, body: TodoUpsertPayload): Observable<ApiResponse<Todo>> {
    return this.api.put<ApiResponse<Todo>>(`/todos/${id}`, body);
  }

  // 5) 완료 토글 PATCH /todos/:id/complete
  toggleComplete(id: string): Observable<ApiResponse<Todo>> {
    return this.api.patch<ApiResponse<Todo>>(`/todos/${id}/complete`, {});
  }

  // 6) 삭제 DELETE /todos/:id
  deleteTodo(id: string): Observable<ApiResponse<null>> {
    return this.api.delete<ApiResponse<null>>(`/todos/${id}`);
  }
}
