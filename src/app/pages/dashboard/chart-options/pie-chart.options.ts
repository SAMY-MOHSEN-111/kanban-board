import {ChartOptions} from 'chart.js';

export const PIE_CHART_OPTIONS: ChartOptions<'pie'> = {
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
