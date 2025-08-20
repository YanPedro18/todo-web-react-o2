import { useEffect, useState, useMemo } from "react";
import { Task, TaskFilters, TaskSortBy, SortOrder, TaskUpdateInput } from "@/types/task";
import { taskService } from "@/services/taskService";


export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [sortBy, setSortBy] = useState<TaskSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // fetch inicial
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getAll();
      setTasks(data);
      console.log("Tasks fetched:", data);
    } catch (err) {
      console.error("fetchTasks error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // create
  const createTask = async (payload: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      const created = await taskService.create(payload);
      setTasks(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error("createTask error:", err);
      throw err;
    }
  };

  // update
const updateTask = async (id: number, updates: TaskUpdateInput) => {
  try {
    const updated = await taskService.update(id, updates);
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
    return updated;
  } catch (err) {
    console.error("updateTask error:", err);
    throw err;
  }
};


  // toggleDone (considerando que o status pode ser alterado para "concluído" / "a fazer")
  const toggleDone = async (id: number, done: boolean) => {
    try {
      const updated = await taskService.toggleDone(id, done);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      
      return updated;
    } catch (err) {
      console.error("toggleDone error:", err);
      throw err;
    }
  };

  // delete
  const deleteTask = async (id: number) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("deleteTask error:", err);
      throw err;
    }
  };

  // filtros + ordenação
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.slice();

    if (filters.status) filtered = filtered.filter(t => t.status === filters.status);
    if (filters.priority) filtered = filtered.filter(t => t.priority === filters.priority);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(
        t => t.title.toLowerCase().includes(s) || (t.description && t.description.toLowerCase().includes(s))
      );
    }
    if (filters.dueDateFrom) filtered = filtered.filter(
      t => t.dueDate && new Date(t.dueDate) >= filters.dueDateFrom!
    );
    if (filters.dueDateTo) filtered = filtered.filter(
      t => t.dueDate && new Date(t.dueDate) <= filters.dueDateTo!
    );

    const orderMap: Record<string, number> = { "baixa": 1, "média": 2, "alta": 3 };
    filtered.sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;

      switch (sortBy) {
        case "createdAt":
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case "dueDate":
          aVal = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          bVal = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          break;
        case "priority":
          aVal = orderMap[a.priority] ?? 0;
          bVal = orderMap[b.priority] ?? 0;
          break;
        case "title":
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
      }

      if (typeof aVal === "number" && typeof bVal === "number") return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      return sortOrder === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });

    return filtered;
  }, [tasks, filters, sortBy, sortOrder]);

  const taskStats = useMemo(() => ({
    total: tasks.length,
    "a fazer": tasks.filter(t => t.status === "a fazer").length,
    "em andamento": tasks.filter(t => t.status === "em andamento").length,
    "concluído": tasks.filter(t => t.status === "concluído").length,
  }), [tasks]);

  return {
    tasks: filteredAndSortedTasks,
    loading,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    fetchTasks,
    createTask,
    updateTask,
    toggleDone,
    deleteTask,
    taskStats,
  };
};
