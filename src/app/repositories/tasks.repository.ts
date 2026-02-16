import {Observable} from "rxjs";
import {Task} from "@app/models/task.model";
import {HttpClient, httpResource, HttpResourceRef} from '@angular/common/http';
import {environment} from '@env/environment';
import {inject, Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class TasksRepository {
  readonly #apiUrl = `${environment.apiUrl}/tasks`;
  readonly #httpClient = inject(HttpClient);

  getAllResource(): HttpResourceRef<Task[]> {
    return httpResource<Task[]>(() => this.#apiUrl, {defaultValue: []});
  }

  create(task: Partial<Task>): Observable<Task> {
    return this.#httpClient.post<Task>(this.#apiUrl, task);
  }

  update(id: string, task: Partial<Task>): Observable<Task> {
    return this.#httpClient.patch<Task>(`${this.#apiUrl}/${id}`, task);
  }

  delete(id: string): Observable<void> {
    return this.#httpClient.delete<void>(`${this.#apiUrl}/${id}`);
  }
}
