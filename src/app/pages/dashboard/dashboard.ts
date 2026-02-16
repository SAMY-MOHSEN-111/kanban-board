import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {StatCard} from '@app/components/stat-card/stat-card';
import {ChartCard} from '@app/components/chart-card/chart-card';
import {StatCardSkeleton} from '@app/components/stat-card/stat-card-skeleton';
import {ChartCardSkeleton} from '@app/components/chart-card/chart-card-skeleton';
import {ChartConfiguration, ChartData} from 'chart.js';
import {TasksService} from '@app/services/tasks.service';
import {TaskStatus} from '@app/models/task.model';
import {PIE_CHART_OPTIONS} from '@app/pages/dashboard/chart-options/pie-chart.options';
import {LINE_CHART_OPTIONS} from '@app/pages/dashboard/chart-options/line-chart.options';

@Component({
  selector: 'app-dashboard',
  imports: [
    StatCard,
    ChartCard,
    StatCardSkeleton,
    ChartCardSkeleton
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  readonly #tasksService = inject(TasksService);

  tasks = this.#tasksService.getAllResource();
  total = computed(() => this.tasks.value().length);
  todo = computed(() => this.tasks.value().filter((task) => task.status === TaskStatus.TODO).length);
  inProgress = computed(() => this.tasks.value().filter((task) => task.status === TaskStatus.IN_PROGRESS).length);
  done = computed(() => this.tasks.value().filter((task) => task.status === TaskStatus.DONE).length);

  tasksOverTimeChartData = computed(() => {
    const labels = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    })
    const numberOfEntries = labels.map(date => this.tasks.value().filter(task => task.createdAt.startsWith(date)).length);
    return {labels, numberOfEntries};
  });


  pieChartData = computed<ChartConfiguration<'pie'>['data']>(() => {
    return {
      labels: ['To Do', 'In Progress', 'Done'],
      datasets: [
        {
          data: [this.todo(), this.inProgress(), this.done()],
          backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
        },
      ],
    };
  });

  lineChartData = computed<ChartData<'line'>>(() => {
    const {labels, numberOfEntries} = this.tasksOverTimeChartData();
    return {
      labels: labels || [],
      datasets: [
        {
          data: numberOfEntries,
          label: 'Tasks Created',
          fill: true,
          tension: 0.3,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
      ],
    };
  });

  protected readonly PIE_CHART_OPTIONS = PIE_CHART_OPTIONS;
  protected readonly LINE_CHART_OPTIONS = LINE_CHART_OPTIONS;
}
