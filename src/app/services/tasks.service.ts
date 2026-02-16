import {inject, Injectable} from '@angular/core';
import {Task} from '../models/task.model';
import {TasksRepository} from '@app/repositories/tasks.repository';
import {Observable} from 'rxjs';
import {HttpResourceRef} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class TasksService {
  readonly #tasksRepository = inject(TasksRepository);

  getAllResource(): HttpResourceRef<Task[]> {
    return this.#tasksRepository.getAllResource();
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
}
