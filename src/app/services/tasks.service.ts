import {computed, inject, Injectable, linkedSignal} from '@angular/core';
import {Task, TaskStatus} from '../models/task.model';
import {toSignal} from '@angular/core/rxjs-interop';
import {TasksRepository} from '@app/repositories/tasks.repository';
import {Subject, switchMap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class TasksService {
  readonly #tasksRepository = inject(TasksRepository);
  readonly #load$ = new Subject<void>();

  tasksSource = toSignal(this.#load$.pipe(switchMap(() => this.#tasksRepository.getAll())), {initialValue: []});
  tasks = linkedSignal(() => this.tasksSource());
  todoTasks = computed(() => this.tasks().filter((task) => task.status === TaskStatus.TODO));
  inProgressTasks = computed(() => this.tasks().filter((task) => task.status === TaskStatus.IN_PROGRESS));
  doneTasks = computed(() => this.tasks().filter((task) => task.status === TaskStatus.DONE));

  tasksStats = computed(() => ({
    total: this.tasks().length,
    todo: this.todoTasks().length,
    inProgress: this.inProgressTasks().length,
    done: this.doneTasks().length,
  }));

  tasksOverTimeChartData = computed(() => {
    const labels = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    })
    const numberOfEntries = labels.map(date => this.tasks().filter(task => task.createdAt.startsWith(date)).length);
    return {labels, numberOfEntries};
  });

  load() {
    this.#load$.next();
  }

  createTask(task: Partial<Task>) {
    return this.#tasksRepository.create(task);
  }

  updateTask(taskId: string, task: Partial<Task>) {
    return this.#tasksRepository.update(taskId, task);
  }

  deleteTask(taskId: string) {
    return this.#tasksRepository.delete(taskId);
  }

  exportToJson() {
    const data = JSON.stringify(this.tasksSource(), null, 2);
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
