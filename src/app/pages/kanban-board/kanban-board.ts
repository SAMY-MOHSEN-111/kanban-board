import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {TasksList} from '@app/components/tasks-list/tasks-list';
import {CdkDragDrop, CdkDropListGroup} from '@angular/cdk/drag-drop';
import {TasksService} from '@app/services/tasks-service';
import {Task, TaskStatus} from '@app/models/task.model';
import {TaskForm} from '@app/components/task-form/task-form';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {heroPlus} from '@ng-icons/heroicons/outline';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-kanban-board',
  imports: [
    TasksList,
    CdkDropListGroup,
    TaskForm,
    NgIcon,
    ReactiveFormsModule
  ],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css',
  viewProviders: [provideIcons({heroPlus})],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanbanBoard implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly tasksService = inject(TasksService);

  searchControl = new FormControl("", {nonNullable: true});
  searchTerm = toSignal(this.searchControl.valueChanges.pipe(debounceTime(200), distinctUntilChanged()), {initialValue: ""});

  filteredTasks = computed<Task[]>(() => this.tasksService.tasks().filter(task => this.#taskMatches(task)));
  todoTasks = computed<Task[]>(() => this.filteredTasks().filter(task => task.status === TaskStatus.TODO));
  inProgressTasks = computed<Task[]>(() => this.filteredTasks().filter(task => task.status === TaskStatus.IN_PROGRESS));
  doneTasks = computed<Task[]>(() => this.filteredTasks().filter(task => task.status === TaskStatus.DONE));

  showForm = signal(false);
  selectedTask = signal<Task | null>(null);

  ngOnInit(): void {
    this.tasksService.load();
  }

  #taskMatches(task: Task): boolean {
    return task.title.toLowerCase().includes(this.searchTerm()) || task.description?.toLowerCase().includes(this.searchTerm());
  }

  onTaskDropped($event: CdkDragDrop<Task[], Task[], Task>) {
    const task = $event.item.data;
    const containerId = $event.container.id;
    task.status = containerId as TaskStatus;
    this.tasksService.updateTask(task.id, task)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe();
  }

  onAddTask() {
    this.selectedTask.set(null);
    this.showForm.set(true);
  }

  onEditTask(task: Task) {
    this.selectedTask.set(task);
    this.showForm.set(true);
  }

  onDeleteTask(task: Task) {
    if (!confirm(`Are you sure you want to delete "${task.title}"?`)) return;
    const tasksSnapshot = this.tasksService.tasks();
    this.tasksService.tasks.update(tasks => tasks.filter(t => t.id !== task.id));
    this.tasksService.deleteTask(task.id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        error: () => this.tasksService.tasks.set(tasksSnapshot),
      });
  }

  onSaveTask(taskData: Partial<Task>) {
    const currentTask = this.selectedTask();
    const now = new Date().toISOString();
    const tasksSnapshot = this.tasksService.tasks();

    if (currentTask) {
      this.tasksService.tasks.update(tasks => tasks.map(task =>
        task.id === currentTask.id ? {...task, ...taskData, updatedAt: now} : task));

      this.tasksService.updateTask(currentTask.id, {...taskData, updatedAt: now})
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          error: () => this.tasksService.tasks.set(tasksSnapshot)
        });
    } else {
      const id = crypto.randomUUID();
      const tempTask: Task = {id, ...taskData, createdAt: now, updatedAt: now} as Task;
      this.tasksService.tasks.update(tasks => [tempTask, ...tasks]);
      this.tasksService.createTask(tempTask)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: (createdTask) => this.tasksService.tasks.update(tasks => tasks.map(task => task.id === id ? createdTask : task)),
          error: () => this.tasksService.tasks.set(tasksSnapshot)
        });
    }

    this.showForm.set(false);
  }

  onCancelForm() {
    this.showForm.set(false);
  }

  protected readonly TaskStatus = TaskStatus;
}
