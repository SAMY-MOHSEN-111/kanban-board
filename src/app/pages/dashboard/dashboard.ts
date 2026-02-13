import {Component, computed, inject} from '@angular/core';
import {StatCard} from '../../components/stat-card/stat-card';
import {ChartCard} from '../../components/chart-card/chart-card';
import {ChartConfiguration, ChartData, ChartOptions, ScaleOptionsByType} from 'chart.js';
import {TasksService} from '../../services/tasks-service';

@Component({
  selector: 'app-dashboard',
  imports: [
    StatCard,
    ChartCard
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly #tasksService = inject(TasksService);
  total = computed(() => this.#tasksService.taskStats().total);
  todo = computed(() => this.#tasksService.taskStats().todo);
  inProgress = computed(() => this.#tasksService.taskStats().inProgress);
  done = computed(() => this.#tasksService.taskStats().done);


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
    const { labels, numberOfEntries } = this.#tasksService.tasksOverTimeChartData();

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
