import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {NgClass, UpperCasePipe} from '@angular/common';
import {TaskPriority} from '@app/models/task.model';
import {RemoveNonAlphanumericPipe} from '@app/pipes/remove-non-alphanumeric-pipe';

@Component({
  selector: 'app-task',
  imports: [
    UpperCasePipe,
    NgClass,
    RemoveNonAlphanumericPipe
  ],
  templateUrl: './task.html',
  styleUrl: './task.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Task {
  task = input.required<any>();
  priorityColor = computed(() => {
    const priority = this.task().priority;
    switch (priority) {
      case TaskPriority.HIGH:
        return 'text-red-600';
      case TaskPriority.MEDIUM:
        return 'text-yellow-600';
      case TaskPriority.LOW:
        return 'text-green-600 ';
      default:
        return 'text-gray-600';
    }
  });
}
