import {computed, inject, Injectable} from '@angular/core';
import {TaskStatus} from '../models/task.model';
import {toSignal} from '@angular/core/rxjs-interop';
import {TasksRepository} from '@app/repositories/tasks.repository';

@Injectable({providedIn: 'root'})
export class TasksService {
  readonly #tasksRepository = inject(TasksRepository);
  tasks = toSignal(this.#tasksRepository.getAll(), {initialValue: []});
  todoTasks = computed(() => this.tasks().filter((task) => task.status === TaskStatus.TODO));
  inProgressTasks = computed(() => this.tasks().filter((task) => task.status === TaskStatus.IN_PROGRESS));
  doneTasks = computed(() => this.tasks().filter((task) => task.status === TaskStatus.DONE));

  taskStats = computed(() => ({
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
}
