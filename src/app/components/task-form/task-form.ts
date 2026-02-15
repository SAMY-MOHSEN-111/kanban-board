import {ChangeDetectionStrategy, Component, inject, input, OnInit, output} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Task, TaskPriority, TaskStatus} from '@app/models/task.model';
import {NgClass} from '@angular/common';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {heroXMarkSolid} from '@ng-icons/heroicons/solid';
import {AssigneesService} from '@app/services/assignees.service';
import {TaskSaveEvent} from '@app/types/task-form.type';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIcon],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
  viewProviders: [provideIcons({heroXMarkSolid})],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskForm implements OnInit {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly assigneesService = inject(AssigneesService);

  task = input<Task | null>(null);
  save = output<TaskSaveEvent>();
  cancel = output<void>();

  taskForm = this.#fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    status: [TaskStatus.TODO, [Validators.required]],
    priority: [TaskPriority.LOW, [Validators.required]],
    assignee: ['', [Validators.required]],
    dueDate: [new Date().toISOString().split('T')[0], [Validators.required]]
  });

  ngOnInit() {
    const task = this.task();
    if (task) {
      this.taskForm.patchValue({
        ...task,
        assignee: task.assignee.id
      });
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const {assignee, ...taskData} = this.taskForm.getRawValue();
      this.save.emit({
        taskData,
        assigneeId: assignee
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  protected readonly TaskStatus = TaskStatus;
  protected readonly TaskPriority = TaskPriority;
}
