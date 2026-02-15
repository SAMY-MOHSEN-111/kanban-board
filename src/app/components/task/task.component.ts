import {ChangeDetectionStrategy, Component, computed, input, output} from '@angular/core';
import {NgClass, UpperCasePipe} from '@angular/common';
import {Task, TaskPriority, TaskStatus} from '@app/models/task.model';
import {RemoveNonAlphanumericPipe} from '@app/pipes/remove-non-alphanumeric-pipe';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {heroExclamationTriangle, heroTrash} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-task',
  imports: [
    UpperCasePipe,
    NgClass,
    RemoveNonAlphanumericPipe,
    NgIcon,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
  viewProviders: [provideIcons({heroExclamationTriangle, heroTrash})],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
  task = input.required<Task>();
  edit = output<Task>();
  remove = output<Task>();

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

  isOverdue = computed(() => new Date(this.task().dueDate) < new Date() && this.task().status != TaskStatus.DONE);

  onEdit() {
    this.edit.emit(this.task());
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.remove.emit(this.task());
  }
}
