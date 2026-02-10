import {Component, input} from '@angular/core';
import {NgClass, NgStyle} from '@angular/common';

@Component({
  selector: 'app-stat-card',
  imports: [
    NgClass
  ],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {
  title  = input.required<string>();
  numberOfTasks = input.required<string | number>();
  cardColor = input.required<string>();
}
