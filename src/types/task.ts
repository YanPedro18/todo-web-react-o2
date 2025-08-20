// types/task.ts
export type TaskStatus = 'a fazer' | 'em andamento' | 'concluído';
export type TaskPriority = 'baixa' | 'média' | 'alta';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  done?: boolean; // <-- importante
}

export type TaskUpdateInput = Partial<{
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  done: boolean;
  dueDate?: string;
}>;

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  dueDateFrom?: Date;
  dueDateTo?: Date;
}

export type TaskSortBy = 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortOrder = 'asc' | 'desc';
