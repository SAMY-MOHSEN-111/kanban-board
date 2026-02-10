import {Component, computed} from '@angular/core';
import {StatCard} from '../../components/stat-card/stat-card';
import {ChartCard} from '../../components/chart-card/chart-card';
import {ChartConfiguration, ChartData, ChartOptions, ScaleOptionsByType} from 'chart.js';

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
          data: [10, 12, 20],
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
        text: 'Created Tasks Trend Over Time'
      }
    },
    scales: {
      x: {
        type: 'category',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      } as ScaleOptionsByType<'category'>,
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
    const xScales = this.lineChartOptions.scales?.['x'] as ScaleOptionsByType<'category'> | undefined;
    const labels = xScales?.labels as string[] | undefined;
    return {
      labels: labels || [],
      datasets: [
        {
          data: [65, 59, 80, 81, 56, 55, 100],
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
