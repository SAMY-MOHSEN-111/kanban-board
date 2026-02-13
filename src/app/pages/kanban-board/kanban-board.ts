import {Component, inject} from '@angular/core';
import {TasksList} from '@app/components/tasks-list/tasks-list';
import {CdkDropListGroup} from '@angular/cdk/drag-drop';
import {TasksService} from '@app/services/tasks-service';

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
}
