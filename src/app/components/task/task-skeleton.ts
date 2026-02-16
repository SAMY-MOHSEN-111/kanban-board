import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-task-skeleton',
  standalone: true,
  template: `
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-3 h-46.25 animate-pulse">
      <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskSkeleton {}
