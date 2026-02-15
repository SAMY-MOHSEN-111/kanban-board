import {ChangeDetectionStrategy, Component, computed, inject, OnInit} from '@angular/core';
import {StatCard} from '@app/components/stat-card/stat-card';
import {ChartCard} from '@app/components/chart-card/chart-card';
import {ChartConfiguration, ChartData, ChartOptions} from 'chart.js';
import {TasksService} from '@app/services/tasks-service';

@Component({
  selector: 'app-dashboard',
  imports: [
    StatCard,
    ChartCard
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard implements OnInit {
  readonly #tasksService = inject(TasksService);

  ngOnInit(): void {
    this.#tasksService.load();
  }

  total = computed(() => this.#tasksService.tasksStats().total);
  todo = computed(() => this.#tasksService.tasksStats().todo);
  inProgress = computed(() => this.#tasksService.tasksStats().inProgress);
  done = computed(() => this.#tasksService.tasksStats().done);

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Task Status Distribution'
      }
    }
  };

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


  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Created Tasks (Last 7 Days)'
      }
    },
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Tasks'
        }
      }
    }
  };

  lineChartData = computed<ChartData<'line'>>(() => {
    const {labels, numberOfEntries} = this.#tasksService.tasksOverTimeChartData();
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
}
