import {Task} from '@app/models/task.model';

export type TaskSaveEvent = {
  taskData: Partial<Omit<Task, 'assignee'>>;
  assigneeId: string;
};
