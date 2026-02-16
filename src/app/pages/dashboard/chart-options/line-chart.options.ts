import {ChartOptions} from 'chart.js';

export const LINE_CHART_OPTIONS: ChartOptions<'line'> = {
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
