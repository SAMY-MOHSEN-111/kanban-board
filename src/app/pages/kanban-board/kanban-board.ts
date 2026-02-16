import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal
} from '@angular/core';
import {TasksList} from '@app/components/tasks-list/tasks-list';
import {TasksListSkeleton} from '@app/components/tasks-list/tasks-list-skeleton';
import {CdkDragDrop, CdkDropListGroup} from '@angular/cdk/drag-drop';
import {TasksService} from '@app/services/tasks.service';
import {Task, TaskPriority, TaskStatus} from '@app/models/task.model';
import {TaskForm} from '@app/components/task-form/task-form';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {heroArrowDownCircle, heroPlus} from '@ng-icons/heroicons/outline';
import {NonNullableFormBuilder, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, finalize, firstValueFrom} from 'rxjs';
import {TaskSaveEvent} from '@app/types/task-form.type';
import {AssigneesService} from '@app/services/assignees.service';
import {Assignee} from '@app/models/assignee.model';
import {downloadFile} from '@app/utils/file.util';

@Component({
  selector: 'app-kanban-board',
  imports: [
    TasksList,
    TasksListSkeleton,
    CdkDropListGroup,
    TaskForm,
    NgIcon,
    ReactiveFormsModule
  ],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css',
  viewProviders: [provideIcons({heroPlus, heroArrowDownCircle})],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanbanBoard {
  readonly #destroyRef = inject(DestroyRef);
  readonly #tasksService = inject(TasksService);
  readonly #assigneesService = inject(AssigneesService);
  readonly #fb = inject(NonNullableFormBuilder);

  searchControl = this.#fb.control("");
  searchTerm = toSignal(this.searchControl.valueChanges
    .pipe(debounceTime(200), distinctUntilChanged()), {initialValue: ""});

  assigneeControl = this.#fb.control("");
  assignee = toSignal(this.assigneeControl.valueChanges, {initialValue: ""});

  priorityControl = this.#fb.control("");
  priority = toSignal(this.priorityControl.valueChanges, {initialValue: ""});

  statusControl = this.#fb.control("");
  status = toSignal(this.statusControl.valueChanges, {initialValue: ""});

  tasks = this.#tasksService.getAllResource();
  filteredTasks = computed<Task[]>(() => this.tasks.value().filter(task => this.#taskMatches(task)));
  todoTasks = computed<Task[]>(() => this.filteredTasks().filter(task => task.status === TaskStatus.TODO));
  inProgressTasks = computed<Task[]>(() => this.filteredTasks().filter(task => task.status === TaskStatus.IN_PROGRESS));
  doneTasks = computed<Task[]>(() => this.filteredTasks().filter(task => task.status === TaskStatus.DONE));

  assignees = computed(() => this.#assigneesService.assignees());

  showForm = signal(false);
  selectedTask = signal<Task | null>(null);

  #taskMatches(task: Task): boolean {
    const search = this.searchTerm().toLowerCase();
    const assignee = this.assignee();
    const priority = this.priority();
    const status = this.status();

    const matchesSearch = task.title.toLowerCase().includes(search) || task.description?.toLowerCase().includes(search);
    const matchesAssignee = !assignee || task.assignee.id === assignee;
    const matchesPriority = !priority || task.priority === priority;
    const matchesStatus = !status || task.status === status;

    return (
      matchesSearch &&
      matchesAssignee &&
      matchesPriority &&
      matchesStatus
    );
  }

  onTaskDropped($event: CdkDragDrop<Task[], Task[], Task>) {
    const task = $event.item.data;
    const containerId = $event.container.id;
    task.status = containerId as TaskStatus;
    this.#tasksService.updateTask(task.id, task)
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
    const tasksSnapshot = this.tasks.value();
    this.tasks.update(tasks => tasks.filter(t => t.id !== task.id));
    this.#tasksService.deleteTask(task.id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        error: () => this.tasks.set(tasksSnapshot),
      });
  }

  async onSaveTask(event: TaskSaveEvent) {
    const {assigneeId, taskData} = event;
    const currentTask = this.selectedTask();
    const tasksSnapshot = this.tasks.value();

    const assignee = await firstValueFrom(this.#assigneesService.getAssigneeById(assigneeId).pipe(finalize(() => this.showForm.set(false))));

    if (currentTask) {
      this.#updateExistingTask(currentTask, taskData, assignee, tasksSnapshot);
    } else {
      this.#createNewTask(taskData, assignee, tasksSnapshot);
    }
  }

  #updateExistingTask(current: Task, data: Partial<Omit<Task, 'assignee'>>, assignee: Assignee, snapshot: Task[]) {
    const now = new Date().toISOString();
    const updatedTask = {...current, ...data, assignee, updatedAt: now};
    this.tasks.update(tasks => tasks.map(task => task.id === current.id ? updatedTask : task));
    this.#tasksService.updateTask(current.id, updatedTask)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        error: () => this.tasks.set(snapshot)
      });
  }

  #createNewTask(data: Partial<Omit<Task, 'assignee'>>, assignee: Assignee, snapshot: Task[]) {
    const now = new Date().toISOString();
    const tempId = crypto.randomUUID();
    const newTask = {...data, id: tempId, assignee, createdAt: now, updatedAt: now} as Task;
    this.tasks.update(tasks => [newTask, ...tasks]);
    this.#tasksService.createTask(newTask)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (serverTask) => this.tasks.update(tasks => tasks.map(task => task.id === tempId ? serverTask : task)),
        error: () => this.tasks.set(snapshot)
      });
  }

  onCancelForm() {
    this.showForm.set(false);
  }

  onExportToJson() {
    const data = JSON.stringify(this.tasks.value(), null, 2);
    downloadFile(data, 'tasks.json', 'application/json');
  }

  protected readonly TaskStatus = TaskStatus;
  protected readonly TaskPriority = TaskPriority;
}
