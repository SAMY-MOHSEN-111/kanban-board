import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TaskSkeleton} from '../task/task-skeleton';

@Component({
  selector: 'app-tasks-list-skeleton',
  standalone: true,
  imports: [TaskSkeleton],
  template: `
    <div class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-md space-y-4 border-2 border-dashed border-black/20 dark:border-gray-600 animate-pulse">
      <div class="flex items-center justify-between">
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
      </div>
      <div class="space-y-4">
        @for (task of [1, 2, 3]; track task) {
          <app-task-skeleton />
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksListSkeleton {}
