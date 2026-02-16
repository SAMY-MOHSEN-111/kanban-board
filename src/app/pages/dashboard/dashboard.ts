import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {StatCard} from '@app/components/stat-card/stat-card';
import {ChartCard} from '@app/components/chart-card/chart-card';
import {ChartConfiguration, ChartData, ChartOptions} from 'chart.js';
import {TasksService} from '@app/services/tasks.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {TaskStatus} from '@app/models/task.model';

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
export class Dashboard {
  readonly #tasksService = inject(TasksService);

  tasks = toSignal(this.#tasksService.getAll(), {initialValue: []});
  total = computed(() => this.tasks().length);
  todo = computed(() => this.tasks().filter((task) => task.status === TaskStatus.TODO).length);
  inProgress = computed(() => this.tasks().filter((task) => task.status === TaskStatus.IN_PROGRESS).length);
  done = computed(() => this.tasks().filter((task) => task.status === TaskStatus.DONE).length);

  tasksOverTimeChartData = computed(() => {
    const labels = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    })
    const numberOfEntries = labels.map(date => this.tasks().filter(task => task.createdAt.startsWith(date)).length);
    return {labels, numberOfEntries};
  });

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
}
