import {computed, DestroyRef, inject, Injectable} from '@angular/core';
import {Task, TaskStatus} from '../models/task.model';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {TasksRepository} from '@app/repositories/tasks.repository';
import {BehaviorSubject, switchMap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class TasksService {
  readonly #destroyRef = inject(DestroyRef);
  readonly #tasksRepository = inject(TasksRepository);
  readonly #refresh$ = new BehaviorSubject<void>(undefined);

  tasks = toSignal(this.#refresh$.pipe(switchMap(() => this.#tasksRepository.getAll())), {initialValue: []});
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

  refresh() {
    this.#refresh$.next();
  }

  getTaskById(taskId: string) {
    return this.#tasksRepository.getById(taskId);
  }

  createTask(task: Task) {
    this.#tasksRepository.create(task);
  }

  updateTask(taskId: string, task: Partial<Task>) {
    return this.#tasksRepository.update(taskId, task)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe();
  }

  deleteTask(taskId: string) {
    this.#tasksRepository.delete(taskId);
  }
}
