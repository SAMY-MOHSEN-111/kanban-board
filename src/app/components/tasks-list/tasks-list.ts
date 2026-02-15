import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import {Task as TaskComponent} from '../task/task' ;
import {Task, TaskStatus} from '@app/models/task.model';

@Component({
  selector: 'app-tasks-list',
  imports: [
    CdkDropList,
    TaskComponent,
    CdkDrag,
    CdkDragPlaceholder,
  ],
  templateUrl: './tasks-list.html',
  styleUrl: './tasks-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksList {
  id = input.required<TaskStatus>();
  title = input.required<string>();
  tasks = input.required<Task[]>();
  taskDropped = output<CdkDragDrop<Task[], Task[], Task>>();
  isDraggingOver = signal(true);

  onDragEntered() {
    this.isDraggingOver.set(false);
  }

  onDragExited() {
    this.isDraggingOver.set(true);
  }

  drop(event: CdkDragDrop<Task[], Task[], Task>) {
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
    this.taskDropped.emit(event);
  }
}
