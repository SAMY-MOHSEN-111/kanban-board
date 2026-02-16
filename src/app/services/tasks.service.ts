import {inject, Injectable} from '@angular/core';
import {Task} from '../models/task.model';
import {toSignal} from '@angular/core/rxjs-interop';
import {TasksRepository} from '@app/repositories/tasks.repository';
import {firstValueFrom, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class TasksService {
  readonly #tasksRepository = inject(TasksRepository);

  getAll(): Observable<Task[]> {
    return this.#tasksRepository.getAll();
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.#tasksRepository.create(task);
  }

  updateTask(taskId: string, task: Partial<Task>): Observable<Task> {
    return this.#tasksRepository.update(taskId, task);
  }

  deleteTask(taskId: string): Observable<void> {
    return this.#tasksRepository.delete(taskId);
  }

  async exportToJson() {
    const tasks = await firstValueFrom(this.#tasksRepository.getAll());
    const data = JSON.stringify(tasks, null, 2);
    this.#downloadFile(data, 'tasks.json', 'application/json');
  }

  #downloadFile(data: string, fileName: string, mimeType: string) {
    const a = document.createElement('a');
    const file = new Blob([data], {type: mimeType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }
}
