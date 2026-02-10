import {Component, input, output} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList} from '@angular/cdk/drag-drop';
import {Task} from '../task/task';

@Component({
  selector: 'app-tasks-list',
  imports: [
    CdkDropList,
    Task,
    CdkDrag,
    CdkDragPlaceholder
  ],
  templateUrl: './tasks-list.html',
  styleUrl: './tasks-list.css',
})
export class TasksList {
  title = input.required<string>();
  tasks = input.required<any[]>();
  taskDropped = output<CdkDragDrop<any>>();

  drop(event: CdkDragDrop<any>) {
    this.taskDropped.emit(event);
  }
}
