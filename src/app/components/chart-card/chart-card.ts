import {Component, input} from '@angular/core';
import {ChartConfiguration, ChartType} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'app-chart-card',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './chart-card.html',
  styleUrl: './chart-card.css',
})
export class ChartCard {
  title = input.required<string>();
  type = input.required<ChartType>();
  data = input.required<ChartConfiguration['data']>();
  options = input<ChartConfiguration['options']>();
  height = input<string>("300px");
}
