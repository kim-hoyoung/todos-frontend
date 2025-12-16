import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, GetTodosQuery, Todo, TodoUpsertPayload } from '../models/todo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  private authHeaders(token: string) {
    return new HttpHeaders({
      Authorization: token,
    });
  }

  getTodos(token: string, query?: GetTodosQuery): Observable<ApiResponse<Todo[]>> {
    let params = new HttpParams();

    if (query?.sort) params = params.set('sort', query.sort);
    if (query?.order) params = params.set('order', query.order);
    if (query?.priorityFilter) params = params.set('priorityFilter', query.priorityFilter);
    if (query?.keyword) params = params.set('keyword', query.keyword);
    if (query?.countOnly !== undefined) params = params.set('countOnly', String(query.countOnly));

    return this.http.get<ApiResponse<Todo[]>>(`${this.baseUrl}/todos`, {
      headers: this.authHeaders(token),
      params,
    });
  }
  // 2) 단건 조회 GET /todos/:id
  getTodoById(token: string, id: string): Observable<ApiResponse<Todo>> {
    return this.http.get<ApiResponse<Todo>>(`${this.baseUrl}/todos/${id}`, {
      headers: this.authHeaders(token),
    });
  }

  // 3) 생성 POST /todos
  createTodo(token: string, body: TodoUpsertPayload): Observable<ApiResponse<Todo>> {
    return this.http.post<ApiResponse<Todo>>(`${this.baseUrl}/todos`, body, {
      headers: this.authHeaders(token),
    });
  }

  // 4) 수정 PUT /todos/:id
  updateTodo(token: string, id: string, body: TodoUpsertPayload): Observable<ApiResponse<Todo>> {
    return this.http.put<ApiResponse<Todo>>(`${this.baseUrl}/todos/${id}`, body, {
      headers: this.authHeaders(token),
    });
  }

  // 5) 완료 토글 PATCH /todos/:id/complete
  toggleComplete(token: string, id: string): Observable<ApiResponse<Todo>> {
    return this.http.patch<ApiResponse<Todo>>(
      `${this.baseUrl}/todos/${id}/complete`,
      {}, // 바디 없음이지만 Angular patch는 body 인자 자리 필요해서 {} 넣음
      { headers: this.authHeaders(token) }
    );
  }

  // 6) 삭제 DELETE /todos/:id
  deleteTodo(token: string, id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/todos/${id}`, {
      headers: this.authHeaders(token),
    });
  }
}
