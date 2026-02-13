import {Component, input, output, signal} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import {Task as TaskComponent} from '../task/task' ;
import {Task} from '@app/models/task.model';

@Component({
  selector: 'app-tasks-list',
  imports: [
    CdkDropList,
    TaskComponent,
    CdkDrag,
    CdkDragPlaceholder
  ],
  templateUrl: './tasks-list.html',
  styleUrl: './tasks-list.css',
})
export class TasksList {
  title = input.required<string>();
  tasks = input.required<Task[]>();
  taskDropped = output<CdkDragDrop<Task[]>>();
  isDraggingOver = signal(true);

  onDragEntered() {
    this.isDraggingOver.set(false);
  }

  onDragExited() {
    this.isDraggingOver.set(true);
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.tasks(), event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
