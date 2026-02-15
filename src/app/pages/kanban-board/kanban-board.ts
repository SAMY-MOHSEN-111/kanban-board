import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanbanBoard implements OnInit {
  readonly tasksService = inject(TasksService);

  ngOnInit(): void {
    this.tasksService.load();
  }

  onTaskDropped($event: CdkDragDrop<Task[], Task[], Task>) {
    const task = $event.item.data;
    const containerId = $event.container.id;
    task.status = containerId as TaskStatus;
    this.tasksService.updateTask(task.id, task);
  }

  protected readonly TaskStatus = TaskStatus;
}
