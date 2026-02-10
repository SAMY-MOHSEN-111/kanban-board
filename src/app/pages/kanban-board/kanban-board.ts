import { Component } from '@angular/core';
import {TasksList} from '../../components/tasks-list/tasks-list';
import {CdkDropListGroup} from '@angular/cdk/drag-drop';

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

}
