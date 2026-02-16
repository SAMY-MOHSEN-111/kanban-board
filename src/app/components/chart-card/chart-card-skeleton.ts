import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-chart-card-skeleton',
  standalone: true,
  template: `
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse flex flex-col items-center h-[400px]">
      <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
      <div class="w-full h-full bg-gray-100 dark:bg-gray-700/50 rounded-lg"></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartCardSkeleton {}
