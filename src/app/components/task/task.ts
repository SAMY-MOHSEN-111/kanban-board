import {Component, input} from '@angular/core';
import {CdkDrag} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task',
  imports: [
    CdkDrag
  ],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {
  task = input.required<any>();
}
