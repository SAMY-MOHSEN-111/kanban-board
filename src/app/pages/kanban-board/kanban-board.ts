import {Component, inject} from '@angular/core';
import {TasksList} from '@app/components/tasks-list/tasks-list';
import {CdkDragDrop, CdkDropListGroup} from '@angular/cdk/drag-drop';
import {TasksService} from '@app/services/tasks-service';
import {Task, TaskStatus} from '@app/models/task.model';

@Component({
  selector: 'app-kanban-board',
  imports: [
    TasksList,
    CdkDropListGroup
  ],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css',
})
export class KanbanBoard {
  readonly tasksService = inject(TasksService);

  onTaskDropped($event: CdkDragDrop<Task[], Task[], Task>) {
    const task = $event.item.data;
    const containerId = $event.container.id;
    task.status = containerId as TaskStatus;
    this.tasksService.updateTask(task.id, task);
  }

  protected readonly TaskStatus = TaskStatus;
}
