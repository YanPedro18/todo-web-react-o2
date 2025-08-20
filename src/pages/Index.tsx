import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { TaskFilters } from '@/components/TaskFilters';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskStatus } from '@/types/task';
import { Plus, CheckCircle2, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const {
    tasks,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    createTask,
    updateTask,
    deleteTask,
    taskStats,
  } = useTasks();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const { toast } = useToast();

  // CREATE
  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await createTask(taskData);
      toast({ title: 'Tarefa criada', description: 'Sua tarefa foi criada com sucesso' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Erro', description: 'Não foi possível criar a tarefa', variant: 'destructive' });
    }
  };

  // UPDATE
  const handleUpdateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, taskData);
      toast({ title: "Tarefa atualizada", description: "Sua tarefa foi atualizada com sucesso." });
      setEditingTask(undefined);
      setIsFormOpen(false);
    } catch {
      toast({ title: "Erro", description: "Não foi possível atualizar a tarefa.", variant: "destructive" });
    }
  };

  // STATUS CHANGE
const handleStatusChange = async (id: number, status: TaskStatus) => {
  try {
    const done = status === 'concluído';
    const updatedTask = await updateTask(id, { status, done });
    toast({ title: 'Status da tarefa atualizado', description: `Status alterado para "${status}"` });
    return updatedTask;
  } catch {
    toast({ title: "Erro", description: "Não foi possível atualizar o status.", variant: "destructive" });
  }
};

  // DELETE
  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      toast({ title: "Tarefa excluída", description: "A tarefa foi removida com sucesso.", variant: "destructive" });
    } catch {
      toast({ title: "Erro", description: "Não foi possível excluir a tarefa.", variant: "destructive" });
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Gerenciador de Tarefas
              </h1>
              <p className="text-muted-foreground">Organize seu trabalho e aumente a produtividade</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Mantenha-se organizado, mantenha-se produtivo</span>
            </div>
            <Button onClick={openCreateForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Tarefa
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <TaskFilters
            filters={filters}
            onFiltersChange={setFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            taskStats={taskStats} // ✅ taskStats agora compatível com TaskStatus em português
          />
        </div>

        {/* Tasks */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent className="space-y-4">
                {Object.values(filters).some(v => v) ? (
                  <>
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Nenhuma tarefa corresponde aos filtros</h3>
                      <p className="text-muted-foreground mb-4">Tente ajustar seus critérios de busca ou limpar os filtros</p>
                      <Button variant="outline" onClick={() => setFilters({})}>Limpar Filtros</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Nenhuma tarefa ainda</h3>
                      <p className="text-muted-foreground mb-4">Comece criando sua primeira tarefa</p>
                      <Button onClick={openCreateForm} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Criar Sua Primeira Tarefa
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tasks.map(task => (
                
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange} // passa direto
                  onEdit={handleEdit}
                  onDelete={() => handleDelete(task.id)}
                />
              

                
              ))}
              
            </div>
          )}
        </div>

        {/* Task Form Modal */}
        <TaskForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialTask={editingTask}
          mode={editingTask ? 'edit' : 'create'}
        />
      </div>
    </div>
  );
};

export default Index;
