import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-stat-card-skeleton',
  standalone: true,
  template: `
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
      <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
      <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardSkeleton {}
