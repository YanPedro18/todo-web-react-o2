import api from "../api/apiHandler";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";

// formato que a API retorna
type ApiTask = {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  done?: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};

// Backend types
export type BackendStatus = 'a fazer' | 'em andamento' | 'concluído';
export type BackendPriority = 'baixa' | 'média' | 'alta';

export interface TaskCreateInput {
  title: string;
  description?: string;
  status: BackendStatus;
  priority: BackendPriority;
  dueDate?: string;
}

/** mapeia ApiTask -> Task (frontend) */
const mapApiToTask = (t: ApiTask): Task => ({
  id: t.id,
  title: t.title,
  description: t.description,
  // **Mapeamos diretamente para os valores em português (se seus tipos front usam português)**
  status:
    t.status === "a fazer" ? "a fazer" :
    t.status === "em andamento" ? "em andamento" :
    "concluído",
  priority:
    t.priority === "baixa" ? "baixa" :
    t.priority === "média" ? "média" :
    "alta",
  dueDate: t.dueDate ?? undefined,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
  done: !!t.done, // importante: garante booleano
});

export const taskService = {
  getAll: async (): Promise<Task[]> => {
    const res = await api.get<ApiResponse<ApiTask[]>>("/tasks");
    return res.data.data.map(mapApiToTask);
  },

  // ✅ Aqui aceitamos TaskCreateInput, para o front enviar backendPayload diretamente
  create: async (taskPayload: TaskCreateInput): Promise<Task> => {
    const res = await api.post<ApiResponse<ApiTask>>("/tasks", taskPayload);
    return mapApiToTask(res.data.data);
  },

  update: async (id: number, payload: Partial<Task>): Promise<Task> => {
    const res = await api.put<ApiResponse<ApiTask>>(`/tasks/${id}`, payload);
    return mapApiToTask(res.data.data);
  },

  toggleDone: async (id: number, done: boolean): Promise<Task> => {
    const res = await api.put<ApiResponse<ApiTask>>(`/tasks/${id}/done`, { done });
    return mapApiToTask(res.data.data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
